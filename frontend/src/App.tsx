import React from "react";
import { Button, Layout, Menu } from "antd";
import { Routes, Route } from "react-router-dom";
import MapScheme from "./pages/geo_map_scheme/MapScheme";
import Sider from "antd/es/layout/Sider";
import MenuItem from "antd/es/menu/MenuItem";
import { GlobalOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";

function App() {
  return (
    <>
      <Layout>
        <Sider collapsible theme="dark" defaultCollapsed>
          <Menu theme="dark" selectedKeys={["1"]}>
            <MenuItem key={"1"} title="Карта" icon={<GlobalOutlined />}>
              Карта
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
            <MapScheme />
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
