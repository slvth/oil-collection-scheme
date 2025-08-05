import { Button, Modal, Select, Space, Tabs, TabsProps } from "antd";
import { createWell, getWells, Well } from "../../../services/Scheme";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { DrawEvent } from "ol/interaction/Draw";
import { Vector as VectorSource } from "ol/source";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import { Map } from "ol";

export enum FormMode {
  create,
  update,
}

interface WellFormProp {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  well?: Well;
  formMode?: FormMode;
  pendingFeature: DrawEvent | null;
  setPendingFeature: Dispatch<SetStateAction<DrawEvent | null>>;
  wellSource: VectorSource;
  mapInstance: Map;
}

export default function WellForm({
  open,
  setOpen,
  pendingFeature,
  setPendingFeature,
  wellSource,
  mapInstance,
}: WellFormProp) {
  const [selectedWellId, setSelectedWellId] = useState(NaN);
  const [wellOptions, setWellOptions] = useState<
    { value: number | undefined; label: string | undefined }[]
  >([]);

  useEffect(() => {
    async function fetchWellData() {
      const wells: Well[] = await getWells({ scheme_id: 1 });
      console.log(wells);
      const wellOptions = wells.map((well) => ({
        value: well.well_id,
        label: well.name,
      }));
      console.log(wellOptions);
      setWellOptions(wellOptions);
    }
    fetchWellData();
    return () => {
      setWellOptions([]);
    };
  }, []);

  const items: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: "Добавление",
        children: (
          <>
            <AddWellDrawForm
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
        children: "Content of Tab Pane 2",
      },
    ];
  }, [selectedWellId, wellOptions, pendingFeature, wellSource, mapInstance]);

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
    </>
  );
}

function AddWellDrawForm({
  wellOptions,
  selectedWellId,
  setSelectedWellId,
  setOpen,
  pendingFeature,
  setPendingFeature,
  wellSource,
  mapInstance,
}: {
  wellOptions: { value: number | undefined; label: string | undefined }[];
  selectedWellId: number;
  setSelectedWellId: Dispatch<SetStateAction<number>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  pendingFeature: DrawEvent | null;
  setPendingFeature: Dispatch<SetStateAction<DrawEvent | null>>;
  wellSource: VectorSource;
  mapInstance: Map;
}) {
  async function OnAddWell() {
    if (pendingFeature && mapInstance) {
      const geometry = pendingFeature.feature.getGeometry();
      const point = geometry as Point;
      const coordinates = point.getCoordinates();
      const wgs84Coords = transform(
        coordinates,
        mapInstance.getView().getProjection(),
        "EPSG:4326"
      );
      var well: Well = {
        name: "efsefs",
        well_pump_id: 1,
        scheme_id: 1,
        latitude: wgs84Coords[0],
        longitude: wgs84Coords[1],
      };
      await createWell({ well: well });
      setOpen(false);
    }
  }

  return (
    <>
      <Select
        style={{ width: "100%" }}
        options={wellOptions}
        onChange={(value) => setSelectedWellId(value)}
      />
      <Space
        style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          onClick={() => {
            setOpen(false);
            if (pendingFeature) {
              wellSource.removeFeature(pendingFeature.feature);
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
