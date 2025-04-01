import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import React, { RefObject, useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { FloatButton } from "antd";
import wellIcon from "../assets/well_icon.png";
import gzuIcon from "../assets/gzu_icon.png";
import { PlusOutlined } from "@ant-design/icons";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Interaction from "ol/interaction/Interaction";
import { Draw } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";

export default function MapScheme() {
  const mapInstance: any = useRef(null);

  //Source
  const wellSource: any = useRef(new VectorSource());
  const gzuSource: any = useRef(new VectorSource());

  //Draw
  const wellDraw: any = useRef(null);
  const gzuDraw: any = useRef(null);

  //Инициализация карты
  useEffect(() => {
    mapInstance.current = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([52.24, 54.89]),
        zoom: 12,
      }),
    });

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
  }, [mapInstance.current]);

  return (
    <>
      <div
        id="map"
        style={{ height: "100vh", width: "100%", position: "absolute" }}
      />
      <div
        style={{ width: 20, borderWidth: 2, height: 20, position: "relative" }}
      >
        <ObjectsFloatingButton wellDraw={wellDraw} gzuDraw={gzuDraw} />
      </div>
    </>
  );
}

function ObjectsFloatingButton({
  wellDraw,
  gzuDraw,
}: {
  wellDraw: any;
  gzuDraw: any;
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
        style={{ insetInlineEnd: 24 }}
        icon={<PlusOutlined />}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <FloatButton
          tooltip={<div>Скважина</div>}
          icon={<CustomIconComponent src={wellIcon} size={20} />}
          type={selectedObject == "well" ? "primary" : "default"}
          onClick={() => {
            gzuDraw.current.setActive(false);
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
            wellDraw.current.setActive(false);
            const isGzuDrawing: boolean = gzuDraw.current.getActive();
            gzuDraw.current.setActive(!isGzuDrawing);
            setSelectedObject((prev) => (prev === "gzu" ? null : "gzu"));
          }}
        />
      </FloatButton.Group>
    </>
  );
}
