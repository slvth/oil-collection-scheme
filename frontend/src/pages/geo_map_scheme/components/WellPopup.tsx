import { Card, Space } from "antd";
import { useAppSelector } from "../../../hooks/redux";

export function WellPopup() {
  const { popupText } = useAppSelector((state) => state.scheme);
  return (
    <>
      {popupText.length > 0 && (
        <Card>
          <Space direction="vertical">
            {popupText.map((item) => {
              return (
                <div>
                  {item.label}: {item.value}
                </div>
              );
            })}
          </Space>
        </Card>
      )}
    </>
  );
}
