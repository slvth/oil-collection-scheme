import React, { useState, useEffect } from "react";
import { Form, Modal, Input, Select } from "antd";
import {
  createScheme,
  getSchemeBySchemeId,
  Scheme,
  updateScheme,
} from "../../../services/Scheme";
import { set } from "ol/transform";

export enum FormMode {
  create,
  update,
}

export default function SchemeForm({
  scheme_id,
  openSchemeForm,
  setOpenSchemeForm,
  formMode,
  onSuccess,
}: {
  scheme_id: number;
  openSchemeForm: boolean;
  setOpenSchemeForm: any;
  formMode: FormMode;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchemeData = async () => {
      if (formMode == FormMode.update && scheme_id) {
        try {
          setLoading(true);
          const scheme = await getSchemeBySchemeId({ scheme_id });
          form.setFieldsValue(scheme);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        form.resetFields();
      }
    };

    if (openSchemeForm) {
      fetchSchemeData();
    }
  }, [scheme_id, formMode, openSchemeForm, form]);

  const onSubmit = async (values: Partial<Scheme>) => {
    try {
      setLoading(true);
      var scheme: Scheme = {
        name: values.name,
        department_id: 1,
        user_id: 1,
      };
      if (formMode === FormMode.create) {
        await createScheme({ scheme: scheme });
      } else if (formMode === FormMode.update && scheme_id) {
        await updateScheme({ scheme_id: scheme_id, scheme: scheme });
      }
      setOpenSchemeForm(false);
      onSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={openSchemeForm}
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        onCancel={() => setOpenSchemeForm(false)}
        onOk={form.submit}
        destroyOnClose
      >
        <Form layout="vertical" form={form} clearOnDestroy onFinish={onSubmit}>
          <Form.Item
            name="name"
            label="Название"
            rules={[
              {
                required: true,
                message: "Пожалуйста введите название схемы!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
