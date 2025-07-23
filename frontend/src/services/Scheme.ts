import axios from "axios";
const baseUrl = "http://localhost:5059";

export interface Scheme {
  scheme_id?: number;
  name?: string;
  department_id?: number;
  user_id?: number;
}

export interface Well {
  well_id?: number;
  name?: string;
  well_pump_id?: number;
  scheme_id?: number;
  longitude: number;
  latitude: number;
}
export interface MeteringStation {
  metering_station_id?: number;
  name?: string;
  metering_station_type_id?: number;
  counter_type_id?: number;
  longitude: number;
  latitude: number;
  scheme_id?: number;
}

export interface PumpingStation {
  metering_station_id?: number;
  name?: string;
  longitude: number;
  latitude: number;
  scheme_id?: number;
}

export interface StorageTank {
  storage_tank_id?: number;
  name?: string;
  longitude: number;
  latitude: number;
  scheme_id?: number;
}

export const getSchemes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/schemes`);
    return response.data.schemes;
  } catch (e) {
    console.error(e);
  }
};

export const getSchemeBySchemeId = async ({
  scheme_id,
}: {
  scheme_id: number;
}) => {
  const response = await axios.get(`${baseUrl}/schemes/${scheme_id}`);
  return response.data;
};

export const createScheme = async ({
  scheme,
}: {
  scheme: Omit<Scheme, "scheme_id">;
}) => {
  const response = await axios.post(`${baseUrl}/schemes/`, scheme);
  return response.data;
};

export const updateScheme = async ({
  scheme_id,
  scheme,
}: {
  scheme_id: number;
  scheme: Scheme;
}) => {
  const response = await axios.put(`${baseUrl}/schemes/${scheme_id}`, scheme);
  return response.data;
};

export const deleteScheme = async ({ scheme_id }: { scheme_id: number }) => {
  const response = await axios.delete(`${baseUrl}/schemes/${scheme_id}`);
  return response.data;
};

//Скважина
export const getWells = async ({ scheme_id }: { scheme_id: number }) => {
  const response = await axios.get(`${baseUrl}/wells?scheme_id=` + scheme_id);
  return response.data.wells;
};

export const createWell = async ({ well }: { well: Omit<Well, "well_id"> }) => {
  const response = await axios.post(`${baseUrl}/wells/`, well);
  return response.data;
};

//ГЗУ
export const getMeteringStations = async ({
  scheme_id,
}: {
  scheme_id: number;
}) => {
  const response = await axios.get(
    `${baseUrl}/MeteringStations?scheme_id=` + scheme_id
  );
  return response.data.metering_stations;
};

export const createMeteringStation = async ({
  meteringStation,
}: {
  meteringStation: Omit<MeteringStation, "metering_station_id">;
}) => {
  const response = await axios.post(
    `${baseUrl}/MeteringStations/`,
    meteringStation
  );
  return response.data;
};

//ДНС
export const getPumpingStations = async ({
  scheme_id,
}: {
  scheme_id: number;
}) => {
  const response = await axios.get(
    `${baseUrl}/PumpingStations?scheme_id=` + scheme_id
  );
  return response.data.pumping_stations;
};

export const createPumpingStation = async ({
  pumpingStation,
}: {
  pumpingStation: Omit<MeteringStation, "metering_station_id">;
}) => {
  const response = await axios.post(
    `${baseUrl}/PumpingStations/`,
    pumpingStation
  );
  return response.data;
};

//РВС
export const getStorageTanks = async ({ scheme_id }: { scheme_id: number }) => {
  const response = await axios.get(
    `${baseUrl}/StorageTanks?scheme_id=` + scheme_id
  );
  return response.data.storage_tanks;
};

export const createStorageTank = async ({
  storageTank,
}: {
  storageTank: Omit<StorageTank, "storage_tank_id">;
}) => {
  const response = await axios.post(`${baseUrl}/StorageTanks/`, storageTank);
  return response.data;
};
