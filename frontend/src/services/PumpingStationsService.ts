import { IPumpingStation } from "../models/IPumpingStation";
import { api } from "./Api";

interface IPumpingStationRequest {
  name: string;
  longitude: number;
  latitude: number;
  scheme_id: number;
}

class PumpingStationsService {
  async createPumpingStation(pumpingStation: IPumpingStation) {
    console.log("API createPumpingStation");
    const request: IPumpingStationRequest = pumpingStation;
    const response = await api.post("/PumpingStations", request);
    return response.data;
  }

  async getPumpingStations(scheme_id: number) {
    console.log("API getPumpingStations");
    const response = await api.get("/PumpingStations?scheme_id=" + scheme_id);
    return response.data.pumping_stations;
  }

  async updatePumpingStation(meteringStation: IPumpingStation) {
    try {
      console.log("API updateMeteringStation");
      const request: IPumpingStationRequest = meteringStation;
      const response = await api.put(
        `/PumpingStations/${meteringStation.pumping_station_id}`,
        request
      );
      return response.data;
    } catch (e) {}
  }
}

export const pumpingStationsService = new PumpingStationsService();
