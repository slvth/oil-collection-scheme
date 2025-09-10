import { Button, Form, Input, Space } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useAppSelector } from "../../../hooks/redux";
import { IProductPark } from "../../../models/IStorageTank";

export function CreateProductParkForm({
  form,
  onCreate,
  onCancel,
}: {
  form: FormInstance;
  onCreate: (productPark: IProductPark) => void;
  onCancel: () => void;
}) {
  const { selectedSchemeId } = useAppSelector((state) => state.scheme);

  async function onSubmit(values: IProductPark) {
    const productPark = {
      ...values,
      scheme_id: selectedSchemeId,
    } as IProductPark;
    onCreate(productPark);
    form.resetFields();
  }

  return (
    <>
      <Form form={form} onFinish={onSubmit} requiredMark="optional">
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
