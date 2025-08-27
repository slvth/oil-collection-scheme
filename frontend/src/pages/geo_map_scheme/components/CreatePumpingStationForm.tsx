import { Button, Form, Input, Space } from "antd";
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
      <Form form={form} onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Название"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input />
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
