import { IStorageTank } from "../models/IStorageTank";
import { api } from "./Api";

interface IStorageTankRequest {
  name: string;
  longitude: number;
  latitude: number;
  scheme_id: number;
}

class StorageTanksService {
  async createStorageTank(productPark: IStorageTank) {
    console.log("API createWell");
    const request: IStorageTankRequest = productPark;
    const response = await api.post("/StorageTanks", request);
    return response.data;
  }

  async getStorageTanks(scheme_id: number) {
    console.log("API getStorageTanks");
    const response = await api.get("/StorageTanks?scheme_id=" + scheme_id);
    return response.data.storage_tanks;
  }

  async updateStorageTank(storageTank: IStorageTank) {
    try {
      const request: IStorageTankRequest = storageTank;
      const response = await api.put(
        `/StorageTanks/${storageTank.storage_tank_id}`,
        request
      );
      return response.data;
    } catch (e) {}
  }
}

export const storageTanksService = new StorageTanksService();
