import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import "ol/ol.css";
import "./MapScheme.css";

import wellIcon from "../assets/well_icon.png";
import gzuIcon from "../assets/gzu_icon.png";
import dnsIcon from "../assets/dns_icon.png";
import productParkIcon from "../assets/product_park_icon.png";
import pipeIcon from "../assets/pipe_icon.png";

import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import { defaults as defaultControls } from "ol/control/defaults.js";

import { Icon, Style, Stroke } from "ol/style";
import { Draw, Modify, Select, Snap } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";

import { FloatButton } from "antd";
import { PlusOutlined } from "@ant-design/icons";

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
        center: fromLonLat([52.24, 54.89]),
        zoom: 12,
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
    wellDraw.current.on("drawend", (e: DrawEvent) => {
      console.log(e.feature);
    });

    //ГЗУ
    gzuDraw.current = new Draw({
      source: gzuSource.current,
      type: "Point",
    });
    gzuDraw.current.setActive(false);
    mapInstance.current.addInteraction(gzuDraw.current);
    gzuDraw.current.on("drawend", (e: DrawEvent) => {
      console.log(e.feature);
    });

    //ДНС
    dnsDraw.current = new Draw({
      source: dnsSource.current,
      type: "Point",
    });
    dnsDraw.current.setActive(false);
    mapInstance.current.addInteraction(dnsDraw.current);
    dnsDraw.current.on("drawend", (e: DrawEvent) => {
      console.log(e.feature);
    });

    //Товарный парк
    productParkDraw.current = new Draw({
      source: productParkSource.current,
      type: "Point",
    });
    productParkDraw.current.setActive(false);
    mapInstance.current.addInteraction(productParkDraw.current);
    productParkDraw.current.on("drawend", (e: DrawEvent) => {
      console.log(e.feature);
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
  }, [mapInstance.current]);

  return (
    <>
      <div
        id="map"
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      />
      <div
        style={{ width: 20, borderWidth: 2, height: 20, position: "relative" }}
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
        style={{ insetInlineEnd: 40 }}
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
