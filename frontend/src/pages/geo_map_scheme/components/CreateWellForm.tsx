import { Button, Form, Input, Select, Space } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CreateWell } from "../../../store/reducers/SchemeSlice";
import { IWell } from "../../../models/IWell";

export function CreateWellForm({
  setOpen,
  form,
  onCancel,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  form: FormInstance;
  onCancel: () => void;
}) {
  const { selectedSchemeId, pendingFeature, map, wellPumps, wellTypes } =
    useAppSelector((state) => state.scheme);
  const dispatch = useAppDispatch();
  const [wellPumpOptions, setWellPumpOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [wellTypeOptions, setWellTypeOptions] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    if (wellPumps.length === 0) {
      return;
    }
    const options = wellPumps.map((wellPump) => ({
      value: wellPump.well_pump_id,
      label: wellPump.name,
    }));
    setWellPumpOptions(options);
  }, [wellPumps]);

  useEffect(() => {
    if (wellTypes.length === 0) {
      return;
    }
    const options = wellTypes.map((wellType) => ({
      value: wellType.well_type_id,
      label: wellType.name,
    }));
    setWellTypeOptions(options);
  }, [wellTypes]);

  async function onSubmit(values: IWell) {
    if (selectedSchemeId && pendingFeature) {
      const geometry = pendingFeature.getGeometry();
      const point = geometry as Point;
      const coordinates = point.getCoordinates();
      const wgs84Coords = transform(
        coordinates,
        map.getView().getProjection(),
        "EPSG:4326"
      );
      var well: IWell = {
        name: values.name,
        well_pump_id: values.well_pump_id,
        well_type_id: values.well_type_id,
        scheme_id: selectedSchemeId!,
        latitude: wgs84Coords[0],
        longitude: wgs84Coords[1],
      };
      dispatch(CreateWell(well));
      pendingFeature.setProperties({ name: well.name });
      setOpen(false);
      form.resetFields();
    }
  }

  return (
    <>
      <Form form={form} onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Название"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="well_pump_id"
          label="Тип насоса"
          rules={[{ required: true, message: "Выберите тип насоса" }]}
        >
          <Select
            showSearch
            placeholder="Выберите тип насоса"
            optionFilterProp="label"
            style={{ width: "100%" }}
            options={wellPumpOptions}
          />
        </Form.Item>
        <Form.Item
          name="well_type_id"
          label="Тип сважины"
          rules={[{ required: true, message: "Выберите тип скважины" }]}
        >
          <Select
            showSearch
            placeholder="Выберите тип скважины"
            optionFilterProp="label"
            style={{ width: "100%" }}
            options={wellTypeOptions}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Space
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={onCancel}>Отмена</Button>
            <Button type="primary" htmlType="submit">
              Создать
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
