import { Modal, Tabs, TabsProps, Typography, Space } from "antd";
import { JSX } from "react";
import { wellIcon } from "../../../assets";

interface AddOrCreateModalProps {
  title: string;
  titleIcon?: string;
  addDrawForm: JSX.Element;
  createForm: JSX.Element;
  open: boolean;
  onCancel: () => void;
}

export function AddOrCreateModal({
  title,
  titleIcon = wellIcon,
  addDrawForm,
  createForm,
  open,
  onCancel,
}: AddOrCreateModalProps) {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Добавление",
      children: <>{addDrawForm}</>,
    },
    {
      key: "2",
      label: "Создание",
      children: <>{createForm}</>,
    },
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <Modal
        title={
          <>
            <Space style={{ alignItems: "center" }}>
              <img src={titleIcon} alt="Объект" width="30px" height="30px" />
              <Typography>{title}</Typography>
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
