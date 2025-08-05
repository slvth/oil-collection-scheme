import { createSlice } from "@reduxjs/toolkit";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { OSM } from "ol/source";

interface SchemeState {
  map: Map;
}

const osmLayer = new TileLayer({ source: new OSM() });

const initialState = {
  map: new Map({
    target: "map",
    layers: [osmLayer],
    view: new View({
      center: fromLonLat([53.0422314905577, 54.84390266665241]),
      zoom: 13.5,
    }),
  }),
};

const schemeSlice = createSlice({
  name: "scheme",
  initialState,
  reducers: {
    setPentingFeature: (state, acti) => {},
  },
});
