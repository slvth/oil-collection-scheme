import React, { useEffect, useRef, useState } from "react";
import { Feature, Map, View } from "ol";
import "ol/ol.css";
import "./MapScheme.css";

import wellIcon from "../assets/well_icon.png";
import gzuIcon from "../assets/gzu_icon.png";
import dnsIcon from "../assets/dns_icon.png";
import productParkIcon from "../assets/product_park_icon.png";
import pipeIcon from "../assets/pipe_icon.png";

import { fromLonLat, transform } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import { defaults as defaultControls } from "ol/control/defaults.js";

import { Icon, Style, Stroke } from "ol/style";
import { Draw, Modify, Select, Snap } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";

import {
  FloatButton,
  Row,
  Col,
  Select as SelectAntd,
  Space,
  Button,
  Divider,
  Modal,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createMeteringStation,
  createPumpingStation,
  createStorageTank,
  createWell,
  deleteScheme,
  getMeteringStations,
  getPumpingStations,
  getSchemes,
  getStorageTanks,
  getWells,
  MeteringStation,
  PumpingStation,
  Scheme,
  StorageTank,
  Well,
} from "../services/Scheme";
import SchemeForm, { FormMode } from "../components/SchemeForm";
import { Geometry, Point } from "ol/geom";

export default function MapScheme() {
  const mapInstance: any = useRef(null);

  //Source
  const wellSource: any = useRef(new VectorSource());
  const gzuSource: any = useRef(new VectorSource());
  const dnsSource: any = useRef(new VectorSource());
  const productParkSource: any = useRef(new VectorSource());
  const pipeSource: any = useRef(new VectorSource());

  //Draw
  const wellDraw: any = useRef(null);
  const gzuDraw: any = useRef(null);
  const dnsDraw: any = useRef(null);
  const productParkDraw: any = useRef(null);
  const pipeDraw: any = useRef(null);

  //Select
  const selectInteraction: any = useRef(null);

  const [selectedScheme, setSelectedScheme] = useState<{ value: number }>({
    value: NaN,
  });

  useEffect(() => {
    const fetchSchemeData = async () => {
      // Очищаем источники данных
      wellSource.current?.clear();
      gzuSource.current?.clear();
      dnsSource.current?.clear();
      productParkSource.current?.clear();

      const scheme_id = selectedScheme.value;

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

    if (mapInstance.current && selectedScheme.value) {
      fetchSchemeData();
    }
  }, [mapInstance.current, selectedScheme.value]);

  // Вспомогательная функция для добавления фич в источник
  const addFeaturesToSource = (source: VectorSource | null, items: any[]) => {
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

  //Инициализация карты
  useEffect(() => {
    mapInstance.current = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
          //className: "greyFilter",
        }),
      ],
      view: new View({
        center: fromLonLat([53.0422314905577, 54.84390266665241]),
        zoom: 13.5,
      }),
      controls: defaultControls({ attribution: false }),
    });

    //Слой Трубы
    const pipeLayer: any = new VectorLayer({
      source: pipeSource.current,
      style: new Style({
        stroke: new Stroke({
          color: "#333",
          width: 3,
        }),
      }),
    });
    mapInstance.current.addLayer(pipeLayer);

    //Слой Скважины
    const wellLayer: any = new VectorLayer({
      source: wellSource.current,
      style: new Style({
        image: new Icon({
          scale: 0.4,
          size: [100, 100],
          src: wellIcon,
        }),
      }),
    });
    mapInstance.current.addLayer(wellLayer);

    //Слой ГЗУ
    const gzuLayer: any = new VectorLayer({
      source: gzuSource.current,
      style: new Style({
        image: new Icon({
          scale: 0.4,
          size: [100, 100],
          src: gzuIcon,
        }),
      }),
    });
    mapInstance.current.addLayer(gzuLayer);

    //Слой ДНС
    const dnsLayer: any = new VectorLayer({
      source: dnsSource.current,
      style: new Style({
        image: new Icon({
          scale: 0.4,
          size: [100, 100],
          src: dnsIcon,
        }),
      }),
    });
    mapInstance.current.addLayer(dnsLayer);

    //Слой Товарный парк
    const productParkLayer: any = new VectorLayer({
      source: productParkSource.current,
      style: new Style({
        image: new Icon({
          scale: 0.4,
          size: [100, 100],
          src: productParkIcon,
        }),
      }),
    });
    mapInstance.current.addLayer(productParkLayer);

    //Select
    selectInteraction.current = new Select({
      layers: [wellLayer, gzuLayer, dnsLayer, productParkLayer, pipeLayer],
    });

    mapInstance.current.addInteraction(selectInteraction.current);
    selectInteraction.current.on("select", (feature: any) => {
      console.log(feature.selected[0]);
    });
  }, []);

  //Drawing
  useEffect(() => {
    //Скважины
    wellDraw.current = new Draw({
      source: wellSource.current,
      type: "Point",
    });
    wellDraw.current.setActive(false);
    mapInstance.current.addInteraction(wellDraw.current);
    wellDraw.current.on("drawend", async (e: DrawEvent) => {
      console.log(e.feature);
      const well_name = window
        .prompt("Введите название скважины", `СКВ-${new Date().toISOString()}`)
        ?.toString();
      if (well_name == null) {
        console.log("Отмена");
      } else {
        const geometry = e.feature.getGeometry() as Point;
        const coordinates = geometry.getCoordinates();
        const wgs84Coords = transform(
          coordinates,
          mapInstance.current.getView().getProjection(),
          "EPSG:4326"
        );
        var well: Well = {
          name: well_name,
          well_pump_id: 1,
          scheme_id: selectedScheme.value,
          latitude: wgs84Coords[0],
          longitude: wgs84Coords[1],
        };
        await createWell({ well: well });
      }
    });

    //ГЗУ
    gzuDraw.current = new Draw({
      source: gzuSource.current,
      type: "Point",
    });
    gzuDraw.current.setActive(false);
    mapInstance.current.addInteraction(gzuDraw.current);
    gzuDraw.current.on("drawend", async (e: DrawEvent) => {
      console.log(e.feature);
      const metering_name = window
        .prompt("Введите название ГЗУ", `ГЗУ-${new Date().toISOString()}`)
        ?.toString();
      if (metering_name == null) {
        console.log("Отмена");
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
          scheme_id: selectedScheme.value,
          metering_station_type_id: 1,
          counter_type_id: 1,
          latitude: wgs84Coords[0],
          longitude: wgs84Coords[1],
        };
        await createMeteringStation({ meteringStation: meteringStation });
      }
    });

    //ДНС
    dnsDraw.current = new Draw({
      source: dnsSource.current,
      type: "Point",
    });
    dnsDraw.current.setActive(false);
    mapInstance.current.addInteraction(dnsDraw.current);
    dnsDraw.current.on("drawend", async (e: DrawEvent) => {
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
          scheme_id: selectedScheme.value,
          latitude: wgs84Coords[0],
          longitude: wgs84Coords[1],
        };
        await createPumpingStation({ pumpingStation: pumpingStation });
      }
    });

    //Товарный парк
    productParkDraw.current = new Draw({
      source: productParkSource.current,
      type: "Point",
    });
    productParkDraw.current.setActive(false);
    mapInstance.current.addInteraction(productParkDraw.current);
    productParkDraw.current.on("drawend", async (e: DrawEvent) => {
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
          scheme_id: selectedScheme.value,
          latitude: wgs84Coords[0],
          longitude: wgs84Coords[1],
        };
        await createStorageTank({ storageTank: storageTank });
      }
    });

    //Трубы
    pipeDraw.current = new Draw({
      source: pipeSource.current,
      type: "LineString",
    });
    pipeDraw.current.setActive(false);
    mapInstance.current.addInteraction(pipeDraw.current);
    pipeDraw.current.on("drawend", (e: DrawEvent) => {
      console.log(e.feature);
    });

    //Modify
    const modifyInteraction: any = new Modify({
      features: selectInteraction.current.getFeatures(),
    });
    mapInstance.current.addInteraction(modifyInteraction);

    //Snapping
    const wellSnapInteraction: any = new Snap({
      source: wellSource.current,
      pixelTolerance: 10,
    });
    const gzuSnapInteraction: any = new Snap({
      source: gzuSource.current,
      pixelTolerance: 10,
    });
    const dnsSnapInteraction: any = new Snap({
      source: dnsSource.current,
      pixelTolerance: 10,
    });
    const productParkSnapInteraction: any = new Snap({
      source: productParkSource.current,
      pixelTolerance: 10,
    });
    mapInstance.current.addInteraction(wellSnapInteraction);
    mapInstance.current.addInteraction(gzuSnapInteraction);
    mapInstance.current.addInteraction(dnsSnapInteraction);
    mapInstance.current.addInteraction(productParkSnapInteraction);
  }, [mapInstance.current, selectedScheme.value]);

  return (
    <>
      <Row style={{ height: "100%" }}>
        <Col span={19}>
          <div
            id="map"
            style={{
              height: "100%",
              width: "100%",
              position: "relative",
            }}
          >
            <ObjectsFloatingButton
              wellDraw={wellDraw}
              gzuDraw={gzuDraw}
              dnsDraw={dnsDraw}
              productParkDraw={productParkDraw}
              pipeDraw={pipeDraw}
              selectInteraction={selectInteraction}
            />
          </div>
        </Col>
        <Col span={5}>
          <MainPanel
            selectedScheme={selectedScheme}
            setSelectedScheme={setSelectedScheme}
          />
        </Col>
      </Row>
    </>
  );
}

function ObjectsFloatingButton({
  wellDraw,
  gzuDraw,
  dnsDraw,
  productParkDraw,
  pipeDraw,
  selectInteraction,
}: {
  wellDraw: any;
  gzuDraw: any;
  dnsDraw: any;
  productParkDraw: any;
  pipeDraw: any;
  selectInteraction: any;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  const CustomIconComponent = ({
    src,
    size,
  }: {
    src: string;
    size: number;
  }) => (
    <img
      src={src}
      alt="icon"
      style={{
        width: size,
        height: size,
      }}
    />
  );

  return (
    <>
      <FloatButton.Group
        open={open}
        trigger="click"
        type="primary"
        style={{ insetInlineEnd: 40, position: "absolute" }}
        icon={<PlusOutlined />}
        onClick={() => {
          selectInteraction.current.setActive(true);
          wellDraw.current.setActive(false);
          gzuDraw.current.setActive(false);
          dnsDraw.current.setActive(false);
          productParkDraw.current.setActive(false);
          pipeDraw.current.setActive(false);
          setSelectedObject(null);
          setOpen((prev) => !prev);
        }}
      >
        <FloatButton
          tooltip={<div>Скважина</div>}
          icon={<CustomIconComponent src={wellIcon} size={20} />}
          type={selectedObject == "well" ? "primary" : "default"}
          onClick={() => {
            selectInteraction.current.setActive(false);
            gzuDraw.current.setActive(false);
            dnsDraw.current.setActive(false);
            productParkDraw.current.setActive(false);
            pipeDraw.current.setActive(false);
            const isWellDrawing: boolean = wellDraw.current.getActive();
            wellDraw.current.setActive(!isWellDrawing);
            setSelectedObject((prev) => (prev === "well" ? null : "well"));
          }}
        />
        <FloatButton
          tooltip={<div>ГЗУ</div>}
          icon={<CustomIconComponent src={gzuIcon} size={20} />}
          type={selectedObject == "gzu" ? "primary" : "default"}
          onClick={() => {
            selectInteraction.current.setActive(false);
            wellDraw.current.setActive(false);
            dnsDraw.current.setActive(false);
            productParkDraw.current.setActive(false);
            pipeDraw.current.setActive(false);
            const isGzuDrawing: boolean = gzuDraw.current.getActive();
            gzuDraw.current.setActive(!isGzuDrawing);
            setSelectedObject((prev) => (prev === "gzu" ? null : "gzu"));
          }}
        />
        <FloatButton
          tooltip={<div>ДНС</div>}
          icon={<CustomIconComponent src={dnsIcon} size={20} />}
          type={selectedObject == "dns" ? "primary" : "default"}
          onClick={() => {
            selectInteraction.current.setActive(false);
            wellDraw.current.setActive(false);
            gzuDraw.current.setActive(false);
            productParkDraw.current.setActive(false);
            pipeDraw.current.setActive(false);
            const isDnsDrawing: boolean = dnsDraw.current.getActive();
            dnsDraw.current.setActive(!isDnsDrawing);
            setSelectedObject((prev) => (prev === "dns" ? null : "dns"));
          }}
        />
        <FloatButton
          tooltip={<div>Товарный парк</div>}
          icon={<CustomIconComponent src={productParkIcon} size={20} />}
          type={selectedObject == "productPark" ? "primary" : "default"}
          onClick={() => {
            selectInteraction.current.setActive(false);
            wellDraw.current.setActive(false);
            gzuDraw.current.setActive(false);
            dnsDraw.current.setActive(false);
            pipeDraw.current.setActive(false);
            const isProductParkDrawing: boolean =
              productParkDraw.current.getActive();
            productParkDraw.current.setActive(!isProductParkDrawing);
            setSelectedObject((prev) =>
              prev === "productPark" ? null : "productPark"
            );
          }}
        />
        <FloatButton
          tooltip={<div>Труба</div>}
          icon={<CustomIconComponent src={pipeIcon} size={20} />}
          type={selectedObject == "pipe" ? "primary" : "default"}
          onClick={() => {
            selectInteraction.current.setActive(false);
            wellDraw.current.setActive(false);
            gzuDraw.current.setActive(false);
            dnsDraw.current.setActive(false);
            productParkDraw.current.setActive(false);
            const isPipeDrawing: boolean = pipeDraw.current.getActive();
            pipeDraw.current.setActive(!isPipeDrawing);
            setSelectedObject((prev) => (prev === "pipe" ? null : "pipe"));
          }}
        />
      </FloatButton.Group>
    </>
  );
}

//
//Главная панель
//
function MainPanel({
  selectedScheme,
  setSelectedScheme,
}: {
  selectedScheme: { value: number };
  setSelectedScheme: any;
}) {
  const [schemes, setSchemes] = useState<{ value: number; label: string }[]>(
    []
  );

  const [formMode, setFormMode] = useState<FormMode>(FormMode.create);
  const [openSchemeForm, setOpenSchemeForm] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [textDelete, setTextDelete] = useState("");

  //Запросы на WebAPI
  useEffect(() => {
    const GetSchemes = async () => {
      const schemes = await getSchemes();
      if (schemes) {
        const schemesOptions = schemes.map((scheme: any) => ({
          value: scheme.scheme_id,
          label: scheme.name,
        }));
        setSchemes(schemesOptions);
        if (!selectedScheme.value && schemesOptions.length > 0) {
          setSelectedScheme(schemesOptions[0]);
        }
      }
    };
    GetSchemes();
  }, [openSchemeForm, openDeleteDialog]);

  //Удаление схемы
  const onDeleteScheme = async () => {
    if (!selectedScheme.value || schemes.length == 0) {
      alert("Выберите схему для удаления!");
      return;
    }
    await deleteScheme({ scheme_id: selectedScheme.value });
    setSelectedScheme({ value: NaN });
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <Space
        style={{ marginLeft: 10, marginRight: 10, width: "100%" }}
        direction="vertical"
      >
        <SelectAntd
          placeholder="Выберите схему..."
          value={selectedScheme.value || undefined}
          options={schemes}
          style={{ width: "100%" }}
          onChange={(value, option) => {
            setSelectedScheme({
              value: value,
            });
          }}
          dropdownRender={(menu) => (
            <>
              <div style={{ padding: "8px 12px", fontWeight: "bold" }}>
                Схема Сбора
              </div>
              <Divider style={{ margin: "4px 0" }} />
              {menu}
            </>
          )}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenSchemeForm(!openSchemeForm);
              setFormMode(FormMode.create);
            }}
          />
          <Space direction="horizontal">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setOpenSchemeForm(!openSchemeForm);
                setFormMode(FormMode.update);
              }}
            />
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                setOpenDeleteDialog(true);
                setTextDelete(
                  `Вы точно желаете удалить схему: "${
                    schemes.find(
                      (scheme) => scheme.value === selectedScheme.value
                    )?.label
                  }"?`
                );
              }}
            />
          </Space>
        </div>
      </Space>

      {/* Создание и Редактирование схемы */}
      <SchemeForm
        scheme_id={selectedScheme.value}
        openSchemeForm={openSchemeForm}
        setOpenSchemeForm={setOpenSchemeForm}
        formMode={formMode}
        onSuccess={() => {}}
      />

      {/* Удаление схемы */}
      <Modal
        title="Удаление схемы"
        closable={{ "aria-label": "Custom Close Button" }}
        open={openDeleteDialog}
        onOk={onDeleteScheme}
        onCancel={(e) => setOpenDeleteDialog(false)}
      >
        {textDelete}
      </Modal>
    </>
  );
}
