import { api } from "./Api";

class PipesService {
  async getPipes(scheme_id: number) {
    console.log("API getPipes");
    const response = await api.get("/Pipes?scheme_id=" + scheme_id);
    return response.data.pipes;
  }
}

export const pipesService = new PipesService();
