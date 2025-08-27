import { Button, Select, Space } from "antd";
import { useState } from "react";

interface AddStorageTankFormProps {
  storageTankOptions: { value: number; label: string }[];
  onAdd: (selectedId: number | null) => void;
  onCancel: () => void;
}

export function AddStorageTankForm({
  storageTankOptions,
  onAdd,
  onCancel,
}: AddStorageTankFormProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const OnAddStorageTank = async () => {
    onAdd(selectedId);
    setSelectedId(null);
  };

  return (
    <>
      <Select
        showSearch
        placeholder="Выберите товарный парк"
        optionFilterProp="label"
        style={{ width: "100%" }}
        options={storageTankOptions}
        value={selectedId}
        onChange={(value) => setSelectedId(value)}
      />
      <Space
        style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}
      >
        <Button onClick={onCancel}>Отмена</Button>
        <Button type="primary" onClick={OnAddStorageTank}>
          Добавить
        </Button>
      </Space>
    </>
  );
}
