import { IMeteringStation } from "../models/IMeteringStation";
import { api } from "./Api";

interface IMeteringStationRequest {
  name: string;
  metering_station_type_id: number;
  counter_type_id: number;
  longitude: number;
  latitude: number;
  scheme_id: number;
}

class MeteringStationsService {
  async createMeteringStation(meteringStation: IMeteringStation) {
    console.log("API createMeteringStation");
    const request: IMeteringStationRequest = meteringStation;
    const response = await api.post("/MeteringStations", request);
    return response.data;
  }

  async getMeteringStations(scheme_id: number) {
    console.log("API getMeteringStations");
    const response = await api.get("/MeteringStations?scheme_id=" + scheme_id);
    return response.data.metering_stations;
  }

  async updateMeteringStation(meteringStation: IMeteringStation) {
    try {
      console.log("API updateMeteringStation");
      const request: IMeteringStationRequest = meteringStation;
      const response = await api.put(
        `/MeteringStations/${meteringStation.metering_station_id}`,
        request
      );
      return response.data;
    } catch (e) {}
  }

  async getMeteringStationTypes() {
    console.log("API getMeteringStationTypes");
    const response = await api.get("/MeteringStationTypes");
    return response.data.metering_station_types;
  }

  async getCounterTypes() {
    console.log("API getCounterTypes");
    const response = await api.get("/CounterTypes");
    return response.data.counter_types;
  }
}

export const meteringStationService = new MeteringStationsService();
