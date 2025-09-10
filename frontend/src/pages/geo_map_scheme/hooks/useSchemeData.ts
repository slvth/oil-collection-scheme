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
  clearAllSources,
  clearPipeSource,
  GetCounterTypes,
  GetMeteringStations,
  GetPipes,
  GetProductParks,
  GetPumpingStations,
  GetWellPumps,
  GetWells,
  GetWellTypes,
  setPopupText,
} from "../../../store/reducers/SchemeSlice";
import { IPipe } from "../../../models/IPipe";
import { IWell } from "../../../models/IWell";
import { IMeteringStation } from "../../../models/IMeteringStation";
import { IPumpingStation } from "../../../models/IPumpingStation";
import { IProductPark } from "../../../models/IStorageTank";

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
    dispatch(clearAllSources());
    dispatch(setPopupText([]));
    dispatch(GetWells(scheme_id));
    dispatch(GetMeteringStations(scheme_id));
    dispatch(GetPumpingStations(scheme_id));
    dispatch(GetProductParks(scheme_id));
    dispatch(GetPipes(scheme_id));
    dispatch(GetWellTypes());
    dispatch(GetWellPumps());
    dispatch(GetCounterTypes());
  }, [selectedSchemeId]);

  useEffect(() => {
    const fetchSchemeData = async () => {
      wellSource.clear();
      meteringStationSource.clear();
      pumpingStationSource.clear();
      productParkSource.clear();
      pipeSource.clear();
      dispatch(clearPipeSource());
      dispatch(clearAllSources());

      const scheme_id = selectedSchemeId!;

      try {
        const [wells, meteringStations, pumpingStations, productParks] =
          await Promise.all([
            getWells({ scheme_id }),
            getMeteringStations({ scheme_id }),
            getPumpingStations({ scheme_id }),
            getStorageTanks({ scheme_id }),
          ]);
        console.log(wells);
        const filteredWells = wells.filter(
          (well: IWell) => well.latitude && well.longitude
        );
        const filteredMeteringStations = meteringStations.filter(
          (ms: IMeteringStation) => ms.latitude && ms.longitude
        );
        const filteredPumpingStations = pumpingStations.filter(
          (ps: IPumpingStation) => ps.latitude && ps.longitude
        );
        const filteredStorageTanks = productParks.filter(
          (st: IProductPark) => st.latitude && st.longitude
        );

        addFeaturesToPointSource(wellSource, filteredWells, "well");
        addFeaturesToPointSource(
          meteringStationSource,
          filteredMeteringStations,
          "meteringStation"
        );
        addFeaturesToPointSource(
          pumpingStationSource,
          filteredPumpingStations,
          "pumpingStation"
        );
        addFeaturesToPointSource(
          productParkSource,
          filteredStorageTanks,
          "productPark"
        );
      } catch (error) {
        console.error("Ошибка при загрузке данных схемы:", error);
      }
    };

    if (selectedSchemeId) {
      fetchSchemeData();
    }
  }, [selectedSchemeId]);

  useEffect(() => {
    if (pipes.length > 0) {
      pipeSource.clear();
      dispatch(clearPipeSource());
      const filteredPipes = pipes.filter((pipe: IPipe) => pipe.coordinates);
      addFeaturesToLineSource(pipeSource, filteredPipes);
    }
  }, [pipes]);

  // Вспомогательная функция для добавления фич в источник
  const addFeaturesToPointSource = (
    source: VectorSource,
    items: any[],
    type: string
  ) => {
    if (!source) return;

    const viewProjection = map.getView().getProjection();

    const features = items.map((item) => {
      const wgs84Coords = [item.latitude, item.longitude];
      const mapCoords = transform(wgs84Coords, "EPSG:4326", viewProjection);
      const point = new Point(mapCoords);
      return new Feature({
        geometry: point,
        type: type,
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
        const lineCoords = item.coordinates.map((coord) => {
          const wgs84Coords = [coord.latitude, coord.longitude];
          return transform(wgs84Coords, "EPSG:4326", viewProjection);
        });

        const line = new LineString(lineCoords);
        return new Feature({
          geometry: line,
          ...item,
        });
      })
      .filter((feature) => feature !== null) as Feature[];
    source.addFeatures(features);
  };
}
