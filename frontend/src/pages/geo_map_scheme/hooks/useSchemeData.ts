import { useEffect } from "react";

import { Feature } from "ol";
import { Vector as VectorSource } from "ol/source";
import { transform } from "ol/proj";
import { LineString, Point } from "ol/geom";

import {
  getMeteringStations,
  getPumpingStations,
  getStorageTanks,
  getWells,
} from "../../../services/Scheme";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import {
  clearPipeSource,
  GetMeteringStations,
  GetPipes,
  GetProductParks,
  GetPumpingStations,
  GetWells,
} from "../../../store/reducers/SchemeSlice";
import { IPipe } from "../../../models/IPipe";

interface FetchSchemeDataProp {
  selectedSchemeId: number | null;
}
export function useSchemeData({ selectedSchemeId }: FetchSchemeDataProp) {
  const {
    map,
    pipeSource,
    wellSource,
    meteringStationSource,
    pumpingStationSource,
    productParkSource,
    pipes,
  } = useAppSelector((state) => state.scheme);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!selectedSchemeId) {
      return;
    }
    const scheme_id = selectedSchemeId;
    dispatch(GetWells(scheme_id));
    dispatch(GetMeteringStations(scheme_id));
    dispatch(GetPumpingStations(scheme_id));
    dispatch(GetProductParks(scheme_id));
    dispatch(GetPipes(scheme_id));
  }, [selectedSchemeId]);

  useEffect(() => {
    const fetchSchemeData = async () => {
      wellSource.clear();
      meteringStationSource.clear();
      pumpingStationSource.clear();
      productParkSource.clear();
      pipeSource.clear();
      dispatch(clearPipeSource());

      const scheme_id = selectedSchemeId!;

      try {
        const [wells, meteringStations, pumpingStations, productParks] =
          await Promise.all([
            getWells({ scheme_id }),
            getMeteringStations({ scheme_id }),
            getPumpingStations({ scheme_id }),
            getStorageTanks({ scheme_id }),
          ]);

        // Фильтруем объекты без координат
        const filteredWells = wells.filter(
          (well: any) => well.latitude && well.longitude
        );
        const filteredMeteringStations = meteringStations.filter(
          (ms: any) => ms.latitude && ms.longitude
        );
        const filteredPumpingStations = pumpingStations.filter(
          (ps: any) => ps.latitude && ps.longitude
        );
        const filteredStorageTanks = productParks.filter(
          (st: any) => st.latitude && st.longitude
        );
        if (pipes.length > 0) {
          console.log(pipes);

          const filteredPipes = pipes.filter(
            (pipe: IPipe) =>
              pipe.coordinates && pipe.scheme_id === selectedSchemeId
          );
          console.log(filteredPipes);
          addFeaturesToLineSource(pipeSource, filteredPipes);
        }

        // Добавляем отфильтрованные объекты на карту
        addFeaturesToPointSource(wellSource, filteredWells);
        addFeaturesToPointSource(
          meteringStationSource,
          filteredMeteringStations
        );
        addFeaturesToPointSource(pumpingStationSource, filteredPumpingStations);
        addFeaturesToPointSource(productParkSource, filteredStorageTanks);
      } catch (error) {
        console.error("Ошибка при загрузке данных схемы:", error);
      }
    };

    if (selectedSchemeId) {
      fetchSchemeData();
    }
  }, [selectedSchemeId, pipes]);

  // Вспомогательная функция для добавления фич в источник
  const addFeaturesToPointSource = (source: VectorSource, items: any[]) => {
    if (!source) return;

    const viewProjection = map.getView().getProjection();

    const features = items.map((item) => {
      const wgs84Coords = [item.latitude, item.longitude];
      const mapCoords = transform(wgs84Coords, "EPSG:4326", viewProjection);
      const point = new Point(mapCoords);
      return new Feature({
        geometry: point,
        ...item,
      });
    });

    source.addFeatures(features);
  };

  const addFeaturesToLineSource = (source: VectorSource, items: IPipe[]) => {
    if (!source) return;

    const viewProjection = map.getView().getProjection();

    const features = items
      .map((item) => {
        if (!item.coordinates || item.coordinates.length < 2) {
          console.warn("Pipe has insufficient coordinates:", item);
          return null;
        }

        // Преобразуем все координаты из WGS84 в проекцию карты
        const lineCoords = item.coordinates.map((coord) => {
          const wgs84Coords = [coord.latitude, coord.longitude]; // longitude first!
          return transform(wgs84Coords, "EPSG:4326", viewProjection);
        });

        const line = new LineString(lineCoords);
        return new Feature({
          geometry: line,
          ...item,
        });
      })
      .filter((feature) => feature !== null) as Feature[]; // Фильтруем null значения

    source.addFeatures(features);
  };
}
