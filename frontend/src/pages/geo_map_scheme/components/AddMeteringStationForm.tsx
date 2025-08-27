import { useState } from "react";
import { Button, Select, Space } from "antd";

export function AddMeteringStationForm({
  meteringStationOptions,
  onAdd,
  onCancel,
}: {
  meteringStationOptions: { value: number; label: string }[];
  onAdd: (selectedId: number | null) => void;
  onCancel: () => void;
}) {
  console.log("Render AddMeteringStationForm");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const OnAddMeteringStation = async () => {
    onAdd(selectedId);
    setSelectedId(null);
  };

  return (
    <>
      <Select
        showSearch
        placeholder="Выберите ГЗУ"
        optionFilterProp="label"
        style={{ width: "100%" }}
        options={meteringStationOptions}
        value={selectedId}
        onChange={(value) => setSelectedId(value)}
      />
      <Space
        style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}
      >
        <Button onClick={onCancel}>Отмена</Button>
        <Button type="primary" onClick={OnAddMeteringStation}>
          Добавить
        </Button>
      </Space>
    </>
  );
}
