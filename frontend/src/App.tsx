import React, { useState } from "react";
import { Button, Layout, Menu } from "antd";
import { Routes, Route } from "react-router-dom";
import MapScheme from "./pages/geo_map_scheme/MapScheme";
import Sider from "antd/es/layout/Sider";
import MenuItem from "antd/es/menu/MenuItem";
import { GlobalOutlined, ApartmentOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import { TreeScheme } from "./pages/tree_map_scheme/TreeScheme";

function App() {
  const [selectedKey, setSelectedKey] = useState("1");

  function onSelect(e: any) {
    setSelectedKey(e.key);
  }

  return (
    <>
      <Layout>
        <Sider collapsible theme="dark" defaultCollapsed>
          <Menu theme="dark" selectedKeys={[selectedKey]} onClick={onSelect}>
            <MenuItem key={"1"} title="Геосхема" icon={<GlobalOutlined />}>
              Геосхема
            </MenuItem>
            <MenuItem key={"2"} title="Схема" icon={<ApartmentOutlined />}>
              Схема
            </MenuItem>
          </Menu>
        </Sider>
        <Layout>
          <Content
            style={{
              //background: "#0015294c",
              padding: 20,
              minHeight: "100vh",
            }}
          >
            {selectedKey == "1" && <MapScheme />}
            {selectedKey == "2" && <TreeScheme />}
          </Content>
        </Layout>
      </Layout>
      {/*
      <Routes>
        <Route path="/" element={<MapScheme />} />
      </Routes>
      */}
    </>
  );
}

export default App;
