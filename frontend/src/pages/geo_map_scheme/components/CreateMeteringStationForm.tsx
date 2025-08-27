import { Button, Form, Input, Select, Space } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { IMeteringStation } from "../../../models/IMeteringStation";
import { useAppSelector } from "../../../hooks/redux";
import { useEffect, useState } from "react";

export function CreateMeteringStationForm({
  form,
  onCreate,
  onCancel,
}: {
  form: FormInstance;
  onCreate: (meteringStation: IMeteringStation) => void;
  onCancel: () => void;
}) {
  const { selectedSchemeId, meteringStationTypes, counterTypes } =
    useAppSelector((state) => state.scheme);
  const [typeOptions, setTypeOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [counterTypeOptions, setCounterTypeOptions] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    if (meteringStationTypes.length === 0) {
      return;
    }
    const options = meteringStationTypes.map((mst) => ({
      value: mst.metering_station_type_id,
      label: mst.name,
    }));
    setTypeOptions(options);
  }, [meteringStationTypes]);

  useEffect(() => {
    if (counterTypes.length === 0) {
      return;
    }
    const options = counterTypes.map((counterType) => ({
      value: counterType.counter_type_id,
      label: counterType.name,
    }));
    setCounterTypeOptions(options);
    alert(JSON.stringify(counterTypes));
  }, [counterTypes]);

  async function onSubmit(values: IMeteringStation) {
    const meteringStation = {
      ...values,
      metering_station_type_id: values.metering_station_type_id,
      counter_type_id: values.counter_type_id,
      scheme_id: selectedSchemeId,
    } as IMeteringStation;
    onCreate(meteringStation);
    form.resetFields();
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
          name="metering_station_type_id"
          label="Тип ГЗУ"
          rules={[{ required: true, message: "Выберите тип ГЗУ" }]}
        >
          <Select
            showSearch
            placeholder="Выберите тип ГЗУ"
            optionFilterProp="label"
            style={{ width: "100%" }}
            options={typeOptions}
          />
        </Form.Item>
        <Form.Item
          name="counter_type_id"
          label="Тип счетчика"
          rules={[{ required: true, message: "Выберите тип счетчика" }]}
        >
          <Select
            showSearch
            placeholder="Выберите тип счетчика"
            optionFilterProp="label"
            style={{ width: "100%" }}
            options={counterTypeOptions}
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
