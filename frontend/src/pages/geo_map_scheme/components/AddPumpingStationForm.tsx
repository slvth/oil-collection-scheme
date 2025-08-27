import { useState } from "react";
import { Button, Select, Space } from "antd";

interface AddPumpingStationFormProps {
  pumpingStationOptions: { value: number; label: string }[];
  onAdd: (selectedId: number | null) => void;
  onCancel: () => void;
}

export function AddPumpingStationForm({
  pumpingStationOptions,
  onAdd,
  onCancel,
}: AddPumpingStationFormProps) {
  console.log("Render AddPumpingStationForm");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const OnAddPumpingStation = async () => {
    onAdd(selectedId);
    setSelectedId(null);
  };

  return (
    <>
      <Select
        showSearch
        placeholder="Выберите ДНС"
        optionFilterProp="label"
        style={{ width: "100%" }}
        options={pumpingStationOptions}
        value={selectedId}
        onChange={(value) => setSelectedId(value)}
      />
      <Space
        style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}
      >
        <Button onClick={onCancel}>Отмена</Button>
        <Button type="primary" onClick={OnAddPumpingStation}>
          Добавить
        </Button>
      </Space>
    </>
  );
}
