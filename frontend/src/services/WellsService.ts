import { IWell } from "../models/IWell";
import { api } from "./Api";

interface IWellRequest {
  name: string;
  well_pump_id: number;
  scheme_id: number;
  longitude: number;
  latitude: number;
}

class WellsService {
  async createWell(well: IWell) {
    console.log("API createWell");
    const request: IWellRequest = well;
    const response = await api.post("/wells", request);
    return response.data;
  }

  async getWells(scheme_id: number) {
    console.log("API getWells");
    const response = await api.get("/wells?scheme_id=" + scheme_id);
    return response.data.wells;
  }

  async updateWell(well: IWell) {
    console.log("API updateWell");
    const request: IWellRequest = well;
    const response = await api.put(`/wells/${well.well_id}`, request);
    return response.data;
  }

  async getWellPumps() {
    console.log("API getWellPumps");
    const response = await api.get("/WellPumps");
    return response.data.well_pumps;
  }

  async getWellTypes() {
    console.log("API getWellTypes");
    const response = await api.get("/WellTypes");
    return response.data.well_types;
  }
}

export const wellService = new WellsService();
