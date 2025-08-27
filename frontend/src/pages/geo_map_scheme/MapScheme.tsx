import { useEffect, useState } from "react";
import "ol/ol.css";
import "./MapScheme.css";

import wellIcon from "../../assets/well_icon.png";
import gzuIcon from "../../assets/gzu_icon.png";
import dnsIcon from "../../assets/dns_icon.png";
import productParkIcon from "../../assets/product_park_icon.png";
import pipeIcon from "../../assets/pipe_icon.png";

import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

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
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { deleteScheme, getSchemes } from "../../services/Scheme";
import SchemeForm, { FormMode } from "./components/SchemeForm";
import { useMapInit } from "./hooks/useMapInit";
import { useDraw } from "./hooks/useDraw";
import { useInteractions } from "./hooks/useInteractions";
import { useSchemeData } from "./hooks/useSchemeData";
import WellModal from "./components/WellModal";
import { DrawEvent } from "ol/interaction/Draw";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { schemeSlice } from "../../store/reducers/SchemeSlice";
import { MeteringStationModal } from "./components/MeteringStationModal";
import { PumpingStationModal } from "./components/PumpingStationModal";
import { StorageTankModal } from "./components/StorageTankModal";

export default function MapScheme() {
  const { map, wellSource, selectedSchemeId } = useAppSelector(
    (state) => state.scheme
  );
  const dispatch = useAppDispatch();
  //const [selectedSchemeId, setSelectedSchemeId] = useState(NaN);
  const [wellFormOpen, setWellFormOpen] = useState(false);
  const [openMeteringStationForm, setOpenMeteringStationForm] = useState(false);
  const [openPumpingStationForm, setOpenPumpingStationForm] = useState(false);
  const [openStorageTankForm, setOpenStorageTankForm] = useState(false);
  const [pendingFeature, setPendingFeature] = useState<DrawEvent | null>(null);

  //const { selectInteraction } = useMapInit();
  useMapInit();

  //useInteractions({ selectInteraction });
  const { selectInteraction } = useInteractions();

  const { wellDraw, gzuDraw, dnsDraw, productParkDraw, pipeDraw } = useDraw({
    setWellFormOpen,
    setOpenMeteringStationForm,
    setOpenPumpingStationForm,
    setOpenStorageTankForm,
    setPendingFeature,
    selectInteraction,
  });

  useSchemeData({ selectedSchemeId });

  return (
    <>
      <Row style={{ height: "100%" }}>
        <Col span={24}>
          <div id="map" />
          <div
            style={{
              width: "100%",
              justifyContent: "flex-end",
              display: "flex",
              paddingRight: "20px",
              paddingTop: "10px",
            }}
          >
            <div style={{ width: "250px" }}>
              <MainPanel wellSource={wellSource} />
            </div>
          </div>

          <ObjectsFloatingButton
            wellDraw={wellDraw}
            gzuDraw={gzuDraw}
            dnsDraw={dnsDraw}
            productParkDraw={productParkDraw}
            pipeDraw={pipeDraw}
            selectInteraction={selectInteraction}
          />
        </Col>
        {/*
          <Col span={5} style={{ paddingLeft: "10" }}>
          <MainPanel
            selectedSchemeId={selectedSchemeId}
            setSelectedSchemeId={setSelectedSchemeId}
            wellSource={wellSource}
          />
        </Col>
          */}

        <WellModal
          open={wellFormOpen}
          setOpen={setWellFormOpen}
          pendingFeature={pendingFeature}
          setPendingFeature={setPendingFeature}
          wellSource={wellSource}
          mapInstance={map}
        />

        <MeteringStationModal
          open={openMeteringStationForm}
          setOpen={setOpenMeteringStationForm}
        />
        <PumpingStationModal
          open={openPumpingStationForm}
          setOpen={setOpenPumpingStationForm}
        />
        <StorageTankModal
          open={openStorageTankForm}
          setOpen={setOpenStorageTankForm}
        />
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
function MainPanel({ wellSource }: { wellSource: VectorSource }) {
  const { selectedSchemeId } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();
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
        if (!selectedSchemeId && schemesOptions.length > 0) {
          //setSelectedSchemeId(schemesOptions[0].value);
          dispatch(
            schemeSlice.actions.setSelectedSchemeId(schemesOptions[0].value)
          );
        }
      }
    };
    GetSchemes();
  }, [openSchemeForm, openDeleteDialog]);

  //Удаление схемы
  const onDeleteScheme = async () => {
    if (!selectedSchemeId || schemes.length == 0) {
      alert("Выберите схему для удаления!");
      return;
    }
    await deleteScheme({ scheme_id: selectedSchemeId });
    dispatch(schemeSlice.actions.setSelectedSchemeId(null));
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <Space
        style={{ width: "100%", marginLeft: 10, marginRight: 10 }}
        direction="vertical"
      >
        <SelectAntd
          placeholder="Выберите схему..."
          value={selectedSchemeId || undefined}
          options={schemes}
          style={{ width: "100%" }}
          onChange={(value, option) => {
            dispatch(schemeSlice.actions.setSelectedSchemeId(value));
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
              icon={<DownloadOutlined />}
              onClick={() => {
                const geo = new GeoJSON();
                const geos = geo.writeFeatures(wellSource.getFeatures());
                // Create download link
                const blob = new Blob([geos], { type: "application/json" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "geo.geojson";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
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
                    schemes.find((scheme) => scheme.value === selectedSchemeId)
                      ?.label
                  }"?`
                );
              }}
            />
          </Space>
        </div>
      </Space>

      {/* Создание и Редактирование схемы */}
      {selectedSchemeId && (
        <SchemeForm
          scheme_id={selectedSchemeId}
          openSchemeForm={openSchemeForm}
          setOpenSchemeForm={setOpenSchemeForm}
          formMode={formMode}
          onSuccess={() => {}}
        />
      )}

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
