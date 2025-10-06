import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  GetProp,
  Input,
  message,
  Modal,
  Space,
  Typography,
  Upload,
} from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useState } from "react";

interface ImportSchemeModalProps {
  open: boolean;
  onCancel: () => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export function ImportSchemeModal({ open, onCancel }: ImportSchemeModalProps) {
  const [schemeName, setSchemeName] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    if (schemeName == "") {
      message.error("Введите название");
      return;
    }
    if (fileList.length == 0) {
      message.error("Выберите файл");
      return;
    }
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file as FileType);
    });
    formData.append("scheme_name", schemeName);
    setUploading(true);
    fetch("http://localhost:5059/Import", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        message.success("upload successfully.");
      })
      .catch(() => {
        message.error("upload failed.");
      })
      .finally(() => {
        setUploading(false);
        setFileList([]);
        setSchemeName("");
        onCancel();
      });
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  return (
    <>
      <Modal
        title={
          <>
            <Typography>Импорт схемы</Typography>
          </>
        }
        open={open}
        onCancel={() => {
          onCancel();
          setFileList([]);
          setSchemeName("");
        }}
        loading={uploading}
        onOk={handleUpload}
        okText="Импорт"
        cancelText="Отмена"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Введите название схемы"
            value={schemeName}
            onChange={(e) => {
              setSchemeName(e.target.value);
            }}
          />
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Выберите файл (.xlsx)</Button>
          </Upload>
          {/* <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          ></Button> */}
        </Space>
      </Modal>
    </>
  );
}
