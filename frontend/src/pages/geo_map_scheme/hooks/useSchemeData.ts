import { useEffect } from "react";

import { Feature, Map } from "ol";
import { Vector as VectorSource } from "ol/source";
import { transform } from "ol/proj";
import { Point } from "ol/geom";

import {
  getMeteringStations,
  getPumpingStations,
  getStorageTanks,
  getWells,
} from "../../../services/Scheme";

interface FetchSchemeDataProp {
  mapInstance: React.RefObject<Map>;
  wellSource: React.RefObject<VectorSource>;
  gzuSource: React.RefObject<VectorSource>;
  dnsSource: React.RefObject<VectorSource>;
  productParkSource: React.RefObject<VectorSource>;
  pipeSource: React.RefObject<VectorSource>;
  selectedSchemeId: number;
}
export function useSchemeData({
  mapInstance,
  wellSource,
  gzuSource,
  dnsSource,
  productParkSource,
  pipeSource,
  selectedSchemeId,
}: FetchSchemeDataProp) {
  useEffect(() => {
    const fetchSchemeData = async () => {
      wellSource.current.clear();
      gzuSource.current?.clear();
      dnsSource.current?.clear();
      productParkSource.current?.clear();
      pipeSource.current?.clear();

      const scheme_id = selectedSchemeId;

      try {
        // Получаем данные с сервера
        const [wells, meteringStations, pumpingStations, storageTanks] =
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
        const filteredStorageTanks = storageTanks.filter(
          (st: any) => st.latitude && st.longitude
        );

        // Добавляем отфильтрованные объекты на карту
        addFeaturesToSource(wellSource.current, filteredWells);
        addFeaturesToSource(gzuSource.current, filteredMeteringStations);
        addFeaturesToSource(dnsSource.current, filteredPumpingStations);
        addFeaturesToSource(productParkSource.current, filteredStorageTanks);
      } catch (error) {
        console.error("Ошибка при загрузке данных схемы:", error);
      }
    };

    if (mapInstance.current && selectedSchemeId) {
      fetchSchemeData();
    }
  }, [mapInstance.current, selectedSchemeId]);

  // Вспомогательная функция для добавления фич в источник
  const addFeaturesToSource = (source: VectorSource, items: any[]) => {
    if (!source) return;

    const viewProjection = mapInstance.current.getView().getProjection();

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
}
