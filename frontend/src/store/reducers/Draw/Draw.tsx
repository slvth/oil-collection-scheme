import { createSlice } from "@reduxjs/toolkit";
import { DrawEvent } from "ol/interaction/Draw";

export enum featureType {
  well = "well",
  gzu = "gzu",
  dns = "dns",
  productPark = "park",
}

export interface DrawState {
  pendingFeature: DrawEvent | null;
  drawType: featureType | null;
}

const initialState: DrawState = {
  pendingFeature: null,
  drawType: null,
};

createSlice({
  name: "draw",
  initialState,
  reducers: {
    setPentingFeature: (state, acti) => {},
  },
});
