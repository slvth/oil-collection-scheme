import React from "react";
import { Button } from "antd";
import { Routes, Route } from "react-router-dom";
import MapScheme from "./pages/MapScheme";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MapScheme />} />
      </Routes>
    </>
  );
}

export default App;
