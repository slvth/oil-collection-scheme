import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

import { Map } from "ol";
import { Point } from "ol/geom";
import { Draw, Select } from "ol/interaction";
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
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setPendingFeature as setPendingFeatureAction } from "../../../store/reducers/SchemeSlice";

interface DrawProp {
  setWellFormOpen: Dispatch<SetStateAction<boolean>>;
  setOpenMeteringStationForm: Dispatch<SetStateAction<boolean>>;
  setOpenPumpingStationForm: Dispatch<SetStateAction<boolean>>;
  setOpenStorageTankForm: Dispatch<SetStateAction<boolean>>;
  setPendingFeature: Dispatch<SetStateAction<DrawEvent | null>>;
  selectInteraction: React.RefObject<Select>;
}

export function useDraw({
  setWellFormOpen,
  setOpenMeteringStationForm,
  setOpenPumpingStationForm,
  setOpenStorageTankForm,
  setPendingFeature,
  selectInteraction,
}: DrawProp) {
  const {
    map,
    selectedSchemeId,
    pipeSource,
    wellSource,
    meteringStationSource,
    pumpingStationSource,
    productParkSource,
  } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();

  const wellDraw = useRef(new Draw({ source: wellSource, type: "Point" }));
  const gzuDraw = useRef(
    new Draw({ source: meteringStationSource, type: "Point" })
  );
  const dnsDraw = useRef(
    new Draw({ source: pumpingStationSource, type: "Point" })
  );
  const productParkDraw: any = useRef(
    new Draw({ source: productParkSource, type: "Point" })
  );
  const pipeDraw: any = useRef(
    new Draw({
      source: pipeSource,
      type: "LineString",
      stopClick: true,
      freehand: false,
    })
  );

  useEffect(() => {
    if (!selectedSchemeId) {
      return;
    }
    const wellHandler = (e: DrawEvent) => {
      setWellFormOpen(true);
      setPendingFeature(e);
      dispatch(setPendingFeatureAction(e.feature));
      /*
      await onWellDrawEnd({
        map,
        wellSource,
        selectedSchemeId,
        setWellFormOpen,
        e,
      });
      */
    };
    const gzuHandler = async (e: DrawEvent) => {
      setOpenMeteringStationForm(true);
      dispatch(setPendingFeatureAction(e.feature));
      //await onGzuDrawEnd({ map, selectedSchemeId, e });
    };
    const dnsHandler = async (e: DrawEvent) => {
      setOpenPumpingStationForm(true);
      dispatch(setPendingFeatureAction(e.feature));
      //await onDnsDrawEnd({ map, selectedSchemeId, e });
    };
    const productParkHandler = async (e: DrawEvent) => {
      setOpenStorageTankForm(true);
      dispatch(setPendingFeatureAction(e.feature));
      //await onProductParkDrawEnd({ map, selectedSchemeId, e });
    };

    //Скважины
    wellDraw.current.setActive(false);
    map.addInteraction(wellDraw.current);
    wellDraw.current.on("drawend", wellHandler);
    //ГЗУ
    gzuDraw.current.setActive(false);
    map.addInteraction(gzuDraw.current);
    gzuDraw.current.on("drawend", gzuHandler);
    //ДНС
    dnsDraw.current.setActive(false);
    map.addInteraction(dnsDraw.current);
    dnsDraw.current.on("drawend", dnsHandler);
    //Товарный парк
    productParkDraw.current.setActive(false);
    map.addInteraction(productParkDraw.current);
    productParkDraw.current.on("drawend", productParkHandler);
    //Трубы
    pipeDraw.current.setActive(false);
    map.addInteraction(pipeDraw.current);

    return () => {
      wellDraw.current.un("drawend", wellHandler);
      gzuDraw.current.un("drawend", gzuHandler);
      dnsDraw.current.un("drawend", dnsHandler);
      productParkDraw.current.un("drawend", productParkHandler);
    };
  }, [map, selectedSchemeId]);

  return { wellDraw, gzuDraw, dnsDraw, productParkDraw, pipeDraw };
}

async function onWellDrawEnd({
  map,
  wellSource,
  selectedSchemeId,
  setWellFormOpen,
  e,
}: {
  map: Map;
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
    map.getView().getProjection(),
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
  map,
  selectedSchemeId,
  e,
}: {
  map: Map;
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
      map.getView().getProjection(),
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
  map,
  selectedSchemeId,
  e,
}: {
  map: Map;
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
      map.getView().getProjection(),
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
  map,
  selectedSchemeId,
  e,
}: {
  map: Map;
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
      map.getView().getProjection(),
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
