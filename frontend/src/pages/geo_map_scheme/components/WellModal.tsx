import {
  Button,
  Modal,
  Select,
  Space,
  Tabs,
  TabsProps,
  Typography,
} from "antd";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { DrawEvent } from "ol/interaction/Draw";
import { Vector as VectorSource } from "ol/source";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import { Map } from "ol";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  UpdateWell,
  GetWells,
  GetWellPumps,
  GetWellTypes,
} from "../../../store/reducers/SchemeSlice";
import { IWell } from "../../../models/IWell";
import { CreateWellForm } from "./CreateWellForm";
import { wellIcon } from "../../../assets";
import { useForm } from "antd/es/form/Form";

interface WellFormProp {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  pendingFeature: DrawEvent | null;
  setPendingFeature: Dispatch<SetStateAction<DrawEvent | null>>;
  wellSource: VectorSource;
  mapInstance: Map;
}

export default function WellModal({
  open,
  setOpen,
  pendingFeature,
  setPendingFeature,
  wellSource,
  mapInstance,
}: WellFormProp) {
  console.log("Render WellForm");
  const { wells, selectedSchemeId } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();

  const [formCreate] = useForm();
  const [selectedWellId, setSelectedWellId] = useState<number | null>(null);
  const [wellOptions, setWellOptions] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    if (!wells) {
      return;
    }
    const filteredWells: IWell[] = wells.filter(
      (well) => !well.latitude && !well.longitude
    );
    const wellOptions = filteredWells.map((well) => ({
      value: well.well_id!,
      label: well.name,
    }));
    setWellOptions(wellOptions);
    return () => {
      setSelectedWellId(null);
      setWellOptions([]);
    };
  }, [wells]);

  const onCancel = () => {
    setOpen(false);
    if (pendingFeature) {
      wellSource.removeFeature(pendingFeature.feature);
    }
    setPendingFeature(null);
    formCreate.resetFields();
  };

  const items: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: "Добавление",
        children: (
          <>
            <AddWellDrawForm
              selectedSchemeId={selectedSchemeId}
              wellOptions={wellOptions}
              selectedWellId={selectedWellId}
              setSelectedWellId={setSelectedWellId}
              setOpen={setOpen}
              pendingFeature={pendingFeature}
              setPendingFeature={setPendingFeature}
              wellSource={wellSource}
              mapInstance={mapInstance}
            />
          </>
        ),
      },
      {
        key: "2",
        label: "Создание",
        children: (
          <>
            <CreateWellForm
              setOpen={setOpen}
              form={formCreate}
              onCancel={onCancel}
            />
          </>
        ),
      },
    ];
  }, [selectedWellId, wellOptions, pendingFeature, wellSource, mapInstance]);

  const onChange = async (key: string) => {
    if (key === "2") {
      dispatch(GetWellPumps());
      dispatch(GetWellTypes());
    }
  };

  return (
    <>
      <Modal
        title={
          <>
            <Space>
              <img src={wellIcon} alt="Скважина" width="30px" />
              <Typography>Скважина</Typography>
            </Space>
          </>
        }
        open={open}
        footer={null}
        onCancel={onCancel}
      >
        <Tabs
          centered
          tabPosition="left"
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </Modal>
    </>
  );
}

function AddWellDrawForm({
  selectedSchemeId,
  wellOptions,
  selectedWellId,
  setSelectedWellId,
  setOpen,
  setPendingFeature,
  wellSource,
  mapInstance,
}: {
  selectedSchemeId: number | null;
  wellOptions: { value: number; label: string }[];
  selectedWellId: number | null;
  setSelectedWellId: Dispatch<SetStateAction<number | null>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  pendingFeature: DrawEvent | null;
  setPendingFeature: Dispatch<SetStateAction<DrawEvent | null>>;
  wellSource: VectorSource;
  mapInstance: Map;
}) {
  const { wells, pendingFeature } = useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();
  console.log("Render AddWellDrawForm");

  const OnAddWell = async () => {
    if (pendingFeature && mapInstance && selectedWellId) {
      const geometry = pendingFeature.getGeometry();
      const point = geometry as Point;
      const coordinates = point.getCoordinates();
      const wgs84Coords = transform(
        coordinates,
        mapInstance.getView().getProjection(),
        "EPSG:4326"
      );
      const latitude = wgs84Coords[0];
      const longitude = wgs84Coords[1];

      dispatch(UpdateWell({ well_id: selectedWellId, latitude, longitude }));
      const well = wells.find((w) => w.well_id === selectedWellId);
      pendingFeature.setProperties({
        ...well,
        type: "well",
      });

      setOpen(false);
      setSelectedWellId(null);
    }
  };

  return (
    <>
      <Select
        showSearch
        placeholder="Выберите скважину"
        optionFilterProp="label"
        style={{ width: "100%" }}
        options={wellOptions}
        value={selectedWellId}
        onChange={(value) => setSelectedWellId(value)}
      />
      <Space
        style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          onClick={() => {
            setOpen(false);
            if (pendingFeature) {
              wellSource.removeFeature(pendingFeature);
            }
            setPendingFeature(null);
          }}
        >
          Отмена
        </Button>
        <Button type="primary" onClick={OnAddWell}>
          Добавить
        </Button>
      </Space>
    </>
  );
}
