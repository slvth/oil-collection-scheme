import { IProductPark } from "../models/IStorageTank";
import { api } from "./Api";

interface IProductParkRequest {
  name: string;
  longitude: number;
  latitude: number;
  scheme_id: number;
}

class ProductParksService {
  async createProductPark(productPark: IProductPark) {
    console.log("API createWell");
    const request: IProductParkRequest = productPark;
    const response = await api.post("/ProductParks", request);
    return response.data;
  }

  async getProductParks(scheme_id: number) {
    console.log("API getProductParks");
    const response = await api.get("/ProductParks?scheme_id=" + scheme_id);
    return response.data.product_parks;
  }

  async updateProductPark(productPark: IProductPark) {
    try {
      const request: IProductParkRequest = productPark;
      const response = await api.put(
        `/ProductParks/${productPark.product_park_id}`,
        request
      );
      return response.data;
    } catch (e) {}
  }
}

export const productParksService = new ProductParksService();
