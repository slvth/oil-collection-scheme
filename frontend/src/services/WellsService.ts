import { IWell } from "../models/IWell";
import { api } from "./Api";

interface IWellRequest {
  name: string;
  drive_type_id: number;
  well_pump_id: number;
  water_cut: number;
  flow_rate: number;
  flow_rate_oil: number;
  longitude: number;
  latitude: number;
  scheme_id: number;
}

class WellsService {
  async createWell(well: IWell) {
    console.log("API createWell");
    const request: IWellRequest = well;
    const response = await api.post("/Wells", request);
    return response.data;
  }

  async getWells(scheme_id: number) {
    console.log("API getWells");
    const response = await api.get("/Wells?scheme_id=" + scheme_id);
    return response.data.wells;
  }

  async updateWell(well: IWell) {
    console.log("API updateWell");
    const request: IWellRequest = well;
    const response = await api.put(`/Wells/${well.well_id}`, request);
    return response.data;
  }

  async getLiftMethods() {
    console.log("API getLiftMethods");
    const response = await api.get("/LiftMethods");
    return response.data.lift_methods;
  }

  async getWellPumps() {
    console.log("API getWellPumps");
    const response = await api.get("/WellPumps");
    return response.data.well_pumps;
  }

  async getDriveTypes() {
    console.log("API getDriveTypes");
    const response = await api.get("/DriveTypes");
    return response.data.drive_types;
  }
}

export const wellService = new WellsService();
