import { Button, Form, Input, InputNumber, Space } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useAppSelector } from "../../../hooks/redux";
import { IPumpingStation } from "../../../models/IPumpingStation";

export function CreatePumpingStationForm({
  form,
  onCreate,
  onCancel,
}: {
  form: FormInstance;
  onCreate: (pumpingStation: IPumpingStation) => void;
  onCancel: () => void;
}) {
  const { selectedSchemeId } = useAppSelector((state) => state.scheme);

  async function onSubmit(values: IPumpingStation) {
    const pumpingStation = {
      ...values,
      scheme_id: selectedSchemeId,
    } as IPumpingStation;
    onCreate(pumpingStation);
    form.resetFields();
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        requiredMark="optional"
      >
        <Form.Item
          name="name"
          label="Название"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="pressure_working"
          label="Рабочее давление"
          rules={[{ required: true, message: "Введите рабочее давление" }]}
        >
          <InputNumber
            changeOnWheel
            suffix="МПа"
            decimalSeparator=","
            min={1}
            max={100}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="tank_volume"
          label="Емкость резервуара"
          rules={[{ required: true, message: "Введите емкость резервуара" }]}
        >
          <InputNumber
            changeOnWheel
            suffix="м³"
            min={100}
            max={10000}
            decimalSeparator=","
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="throughput"
          label="Пропускная способность"
          rules={[
            { required: true, message: "Введите пропускную способность" },
          ]}
        >
          <InputNumber
            changeOnWheel
            suffix="м³/сут"
            min={0}
            max={1000000}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="pump_performance"
          label="Производительность насоса"
          rules={[
            { required: true, message: "Введите производительность насоса" },
          ]}
        >
          <InputNumber
            changeOnWheel
            suffix="м³/ч"
            min={0}
            max={1000}
            style={{ width: "100%" }}
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
