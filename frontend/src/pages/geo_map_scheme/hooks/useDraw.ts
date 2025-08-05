import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { Map } from "ol";
import { Point } from "ol/geom";
import { Draw } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";
import { transform } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import {
  createWell,
  createMeteringStation,
  createPumpingStation,
  Well,
  MeteringStation,
  PumpingStation,
  StorageTank,
  createStorageTank,
} from "../../../services/Scheme";
import { Vector as VectorLayer } from "ol/layer";

interface DrawProp {
  mapInstance: React.RefObject<Map>;
  wellSource: React.RefObject<VectorSource>;
  gzuSource: React.RefObject<VectorSource>;
  dnsSource: React.RefObject<VectorSource>;
  productParkSource: React.RefObject<VectorSource>;
  pipeSource: React.RefObject<VectorSource>;
  selectedSchemeId: number;
  wellFormOpen: boolean;
  setWellFormOpen: Dispatch<SetStateAction<boolean>>;
  setPendingFeature: Dispatch<SetStateAction<DrawEvent | null>>;
}

export function useDraw({
  mapInstance,
  wellSource,
  gzuSource,
  dnsSource,
  productParkSource,
  pipeSource,
  selectedSchemeId,
  wellFormOpen,
  setWellFormOpen,
  setPendingFeature,
}: DrawProp) {
  const wellDraw = useRef(
    new Draw({ source: wellSource.current, type: "Point" })
  );
  const gzuDraw = useRef(
    new Draw({ source: gzuSource.current, type: "Point" })
  );
  const dnsDraw = useRef(
    new Draw({ source: dnsSource.current, type: "Point" })
  );
  const productParkDraw: any = useRef(
    new Draw({ source: productParkSource.current, type: "Point" })
  );
  const pipeDraw: any = useRef(
    new Draw({ source: pipeSource.current, type: "LineString" })
  );

  useEffect(() => {
    const wellHandler = async (e: DrawEvent) => {
      setWellFormOpen(true);
      setPendingFeature(e);
      /*
      await onWellDrawEnd({
        mapInstance,
        wellSource,
        selectedSchemeId,
        setWellFormOpen,
        e,
      });
      */
    };
    const gzuHandler = async (e: DrawEvent) => {
      await onGzuDrawEnd({ mapInstance, selectedSchemeId, e });
    };
    const dnsHandler = async (e: DrawEvent) => {
      await onDnsDrawEnd({ mapInstance, selectedSchemeId, e });
    };
    const productParkHandler = async (e: DrawEvent) => {
      await onProductParkDrawEnd({ mapInstance, selectedSchemeId, e });
    };

    //Скважины
    wellDraw.current.setActive(false);
    mapInstance.current.addInteraction(wellDraw.current);
    wellDraw.current.on("drawend", wellHandler);
    //ГЗУ
    gzuDraw.current.setActive(false);
    mapInstance.current.addInteraction(gzuDraw.current);
    gzuDraw.current.on("drawend", gzuHandler);
    //ДНС
    dnsDraw.current.setActive(false);
    mapInstance.current.addInteraction(dnsDraw.current);
    dnsDraw.current.on("drawend", dnsHandler);
    //Товарный парк
    productParkDraw.current.setActive(false);
    mapInstance.current.addInteraction(productParkDraw.current);
    productParkDraw.current.on("drawend", productParkHandler);
    //Трубы
    pipeDraw.current.setActive(false);
    mapInstance.current.addInteraction(pipeDraw.current);

    return () => {
      wellDraw.current.un("drawend", wellHandler);
      gzuDraw.current.un("drawend", gzuHandler);
      dnsDraw.current.un("drawend", dnsHandler);
      productParkDraw.current.un("drawend", productParkHandler);
    };
  }, [mapInstance.current, selectedSchemeId]);

  return { wellDraw, gzuDraw, dnsDraw, productParkDraw, pipeDraw };
}

async function onWellDrawEnd({
  mapInstance,
  wellSource,
  selectedSchemeId,
  setWellFormOpen,
  e,
}: {
  mapInstance: React.RefObject<Map>;
  wellSource: React.RefObject<VectorSource>;
  selectedSchemeId: number;
  setWellFormOpen: Dispatch<SetStateAction<boolean>>;
  e: DrawEvent;
}) {
  setWellFormOpen(true);
  console.log(e.feature);
  const well_name = "f";
  /*
  const well_name = window
    .prompt("Введите название скважины", `СКВ-${new Date().toISOString()}`)
    ?.toString();
    */
  if (well_name == null) {
    setTimeout(() => {
      wellSource.current.removeFeature(e.feature);
      console.log("Фигура удалена");
    }, 0);
    setWellFormOpen(false);
    return;
  }
  const geometry = e.feature.getGeometry();
  const point = geometry as Point;
  const coordinates = point.getCoordinates();
  const wgs84Coords = transform(
    coordinates,
    mapInstance.current.getView().getProjection(),
    "EPSG:4326"
  );
  var well: Well = {
    name: well_name,
    well_pump_id: 1,
    scheme_id: selectedSchemeId,
    latitude: wgs84Coords[0],
    longitude: wgs84Coords[1],
  };
  await createWell({ well: well });
}

async function onGzuDrawEnd({
  mapInstance,
  selectedSchemeId,
  e,
}: {
  mapInstance: React.RefObject<Map>;
  selectedSchemeId: number;
  e: DrawEvent;
}) {
  console.log(e.feature);
  const metering_name = window
    .prompt("Введите название ГЗУ", `ГЗУ-${new Date().toISOString()}`)
    ?.toString();
  if (metering_name == null) {
    setTimeout(() => {
      //gzu.current.removeFeature(e.feature);
      console.log("Фигура удалена");
    }, 0);
    return;
  } else {
    const geometry = e.feature.getGeometry() as Point;
    const coordinates = geometry.getCoordinates();
    const wgs84Coords = transform(
      coordinates,
      mapInstance.current.getView().getProjection(),
      "EPSG:4326"
    );
    var meteringStation: MeteringStation = {
      name: metering_name,
      scheme_id: selectedSchemeId,
      metering_station_type_id: 1,
      counter_type_id: 1,
      latitude: wgs84Coords[0],
      longitude: wgs84Coords[1],
    };
    await createMeteringStation({ meteringStation: meteringStation });
  }
}

async function onDnsDrawEnd({
  mapInstance,
  selectedSchemeId,
  e,
}: {
  mapInstance: React.RefObject<Map>;
  selectedSchemeId: number;
  e: DrawEvent;
}) {
  console.log(e.feature);
  const pumping_station_name = window
    .prompt("Введите название ДНС", `ДНС-${new Date().toISOString()}`)
    ?.toString();
  if (pumping_station_name == null) {
    console.log("Отмена");
  } else {
    const geometry = e.feature.getGeometry() as Point;
    const coordinates = geometry.getCoordinates();
    const wgs84Coords = transform(
      coordinates,
      mapInstance.current.getView().getProjection(),
      "EPSG:4326"
    );
    var pumpingStation: PumpingStation = {
      name: pumping_station_name,
      scheme_id: selectedSchemeId,
      latitude: wgs84Coords[0],
      longitude: wgs84Coords[1],
    };
    await createPumpingStation({ pumpingStation: pumpingStation });
  }
}

async function onProductParkDrawEnd({
  mapInstance,
  selectedSchemeId,
  e,
}: {
  mapInstance: React.RefObject<Map>;
  selectedSchemeId: number;
  e: DrawEvent;
}) {
  console.log(e.feature);
  const storage_tank_name = window
    .prompt("Введите название РВС", `РВС-${new Date().toISOString()}`)
    ?.toString();
  if (storage_tank_name == null) {
    console.log("Отмена");
  } else {
    const geometry = e.feature.getGeometry() as Point;
    const coordinates = geometry.getCoordinates();
    const wgs84Coords = transform(
      coordinates,
      mapInstance.current.getView().getProjection(),
      "EPSG:4326"
    );
    var storageTank: StorageTank = {
      name: storage_tank_name,
      scheme_id: selectedSchemeId,
      latitude: wgs84Coords[0],
      longitude: wgs84Coords[1],
    };
    await createStorageTank({ storageTank: storageTank });
  }
}
