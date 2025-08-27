import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Feature, Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { fromLonLat } from "ol/proj";
import { OSM, Vector as VectorSource } from "ol/source";
import { wellService } from "../../services/WellsService";
import { IWell } from "../../models/IWell";
import { RootState } from "..";
import { IMeteringStation } from "../../models/IMeteringStation";
import { meteringStationService } from "../../services/MeteringStationsService";
import { pumpingStationsService } from "../../services/PumpingStationsService";
import { IPumpingStation } from "../../models/IPumpingStation";
import { IStorageTank } from "../../models/IStorageTank";
import { storageTanksService } from "../../services/StorageTanksService";
import { pipesService } from "../../services/PipesService";
import { IPipe } from "../../models/IPipe";
import { IWellPump } from "../../models/IWellPump";
import { IWellType } from "../../models/IWellType";
import { IMeteringStationType } from "../../models/IMeteringStationType";
import { ICounterType } from "../../models/ICounterType";

//Wells
const CreateWell = createAsyncThunk(
  "scheme/well/create",
  async (well: IWell, { rejectWithValue }) => {
    try {
      const createdId = await wellService.createWell(well);
      well.well_id = createdId;
      return well;
    } catch (error) {
      return rejectWithValue("Ошибка при создании скважины. Ошибка: " + error);
    }
  }
);

const GetWells = createAsyncThunk(
  "scheme/wells/get",
  async (scheme_id: number, thunkAPI) => {
    try {
      const response = await wellService.getWells(scheme_id);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(
        "Ошибка при получении скважин. Ошибка: " + error
      );
    }
  }
);

const UpdateWell = createAsyncThunk<
  IWell,
  {
    well_id: number;
    latitude: number;
    longitude: number;
  },
  { state: RootState }
>(
  "scheme/well/update",
  async (
    { well_id, latitude, longitude },
    { rejectWithValue, dispatch, getState }
  ) => {
    const state = getState() as RootState;
    const wells = state.scheme.wells;
    const currentWell = wells.find((well) => well.well_id === well_id);

    try {
      if (currentWell) {
        const updatedWell: IWell = { ...currentWell, longitude, latitude };
        await wellService.updateWell(updatedWell);
        dispatch(GetPipes(state.scheme.selectedSchemeId!));
        return updatedWell;
      } else {
        throw Error("Не найдена скважина с такой well_id");
      }
    } catch (error) {
      return rejectWithValue(
        "Ошибка при обновлении скважины. Ошибка: " + error
      );
    }
  }
);

const GetWellPumps = createAsyncThunk(
  "scheme/well_pumps/get",
  async (_, thunkAPI) => {
    try {
      const response = await wellService.getWellPumps();
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(
        "Ошибка при получении типов насоса скважины. Ошибка: " + error
      );
    }
  }
);

const GetWellTypes = createAsyncThunk(
  "scheme/well_types/get",
  async (_, thunkAPI) => {
    try {
      const response = await wellService.getWellTypes();
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(
        "Ошибка при получении типов скважины. Ошибка: " + error
      );
    }
  }
);

//MeteringStations
const CreateMeteringStation = createAsyncThunk(
  "scheme/metering_stations/create",
  async (meteringStation: IMeteringStation, { rejectWithValue }) => {
    try {
      const createdId = await meteringStationService.createMeteringStation(
        meteringStation
      );
      meteringStation.metering_station_id = createdId;
      return meteringStation;
    } catch (error) {
      return rejectWithValue("Ошибка при создании ГЗУ. Ошибка: " + error);
    }
  }
);

const GetMeteringStations = createAsyncThunk(
  "scheme/metering_stations/get",
  async (scheme_id: number, thunkAPI) => {
    try {
      const response = await meteringStationService.getMeteringStations(
        scheme_id
      );
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(
        "Ошибка при получении списка ГЗУ. Ошибка: " + error
      );
    }
  }
);

const UpdateMeteringStation = createAsyncThunk<
  IMeteringStation,
  {
    metering_station_id: number;
    latitude: number;
    longitude: number;
  },
  { state: RootState }
>(
  "scheme/metering_station/update",
  async (
    { metering_station_id, latitude, longitude },
    { rejectWithValue, getState, dispatch }
  ) => {
    const state = getState();
    const meteringStations = state.scheme.meteringStations;
    const currentMeteringStation = meteringStations.find(
      (ms) => ms.metering_station_id === metering_station_id
    );

    try {
      if (currentMeteringStation) {
        const meteringStationForUpdate: IMeteringStation = {
          ...currentMeteringStation,
          longitude,
          latitude,
        };
        await meteringStationService.updateMeteringStation(
          meteringStationForUpdate
        );
        dispatch(GetPipes(state.scheme.selectedSchemeId!));
        return meteringStationForUpdate;
      } else {
        throw Error("Не найдена ГЗУ с такой metering_station_id");
      }
    } catch (error) {
      return rejectWithValue("Ошибка при обновлении ГЗУ. Ошибка: " + error);
    }
  }
);

const GetMeteringStationTypes = createAsyncThunk(
  "scheme/metering_station_types/get",
  async (_, thunkAPI) => {
    try {
      const response = await meteringStationService.getMeteringStationTypes();
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(
        "Ошибка при получении типов ГЗУ. Ошибка: " + error
      );
    }
  }
);

const GetCounterTypes = createAsyncThunk(
  "scheme/counter_types/get",
  async (_, thunkAPI) => {
    try {
      const response = await meteringStationService.getCounterTypes();
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(
        "Ошибка при получении типов cчетчиков. Ошибка: " + error
      );
    }
  }
);

//PumpinsStations
const CreatePumpingStation = createAsyncThunk(
  "scheme/pumping_stations/create",
  async (pumpingStation: IPumpingStation, { rejectWithValue }) => {
    try {
      const createdId = await pumpingStationsService.createPumpingStation(
        pumpingStation
      );
      pumpingStation.pumping_station_id = createdId;
      return pumpingStation;
    } catch (error) {
      return rejectWithValue("Ошибка при создании ГЗУ. Ошибка: " + error);
    }
  }
);

const GetPumpingStations = createAsyncThunk(
  "scheme/pumping_stations/get",
  async (scheme_id: number, thunkAPI) => {
    try {
      const response = await pumpingStationsService.getPumpingStations(
        scheme_id
      );
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(
        "Ошибка при получении списка ДНС. Ошибка: " + error
      );
    }
  }
);

const UpdatePumpingStation = createAsyncThunk<
  IPumpingStation,
  {
    pumping_station_id: number;
    latitude: number;
    longitude: number;
  },
  { state: RootState }
>(
  "scheme/pumping_station/update",
  async (
    { pumping_station_id, latitude, longitude },
    { rejectWithValue, getState, dispatch }
  ) => {
    const state = getState();
    const pumpingStations = state.scheme.pumpingStations;
    const currentPumpingStation = pumpingStations.find(
      (ps) => ps.pumping_station_id === pumping_station_id
    );

    try {
      if (currentPumpingStation) {
        const pumpingStationForUpdate: IPumpingStation = {
          ...currentPumpingStation,
          longitude,
          latitude,
        };
        await pumpingStationsService.updatePumpingStation(
          pumpingStationForUpdate
        );
        dispatch(GetPipes(state.scheme.selectedSchemeId!));
        return pumpingStationForUpdate;
      } else {
        throw Error("Не найдена ДНС с такой pumping_station_id");
      }
    } catch (error) {
      return rejectWithValue("Ошибка при обновлении ДНС. Ошибка: " + error);
    }
  }
);

//ProductParks
const CreateProductPark = createAsyncThunk(
  "scheme/product_parks/create",
  async (productPark: IStorageTank, { rejectWithValue }) => {
    try {
      const createdId = await storageTanksService.createStorageTank(
        productPark
      );
      productPark.storage_tank_id = createdId;
      return productPark;
    } catch (error) {
      return rejectWithValue("Ошибка при создании ГЗУ. Ошибка: " + error);
    }
  }
);

const GetProductParks = createAsyncThunk(
  "scheme/product_parks/get",
  async (scheme_id: number, thunkAPI) => {
    try {
      const response = await storageTanksService.getStorageTanks(scheme_id);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(
        "Ошибка при получении списка Товарных Парков. Ошибка: " + error
      );
    }
  }
);

const UpdateProductPark = createAsyncThunk<
  IStorageTank,
  {
    storage_tank_id: number;
    latitude: number;
    longitude: number;
  },
  { state: RootState }
>(
  "scheme/product_park/update",
  async (
    { storage_tank_id, latitude, longitude },
    { rejectWithValue, getState, dispatch }
  ) => {
    const state = getState();
    const storageTanks = state.scheme.productParks;
    const currentStorageTank = storageTanks.find(
      (st) => st.storage_tank_id === storage_tank_id
    );

    try {
      if (currentStorageTank) {
        const storageTankForUpdate: IStorageTank = {
          ...currentStorageTank,
          longitude,
          latitude,
        };
        await storageTanksService.updateStorageTank(storageTankForUpdate);
        dispatch(GetPipes(state.scheme.selectedSchemeId!));
        return storageTankForUpdate;
      } else {
        throw Error("Не найдена Товарный Парк с такой storage_tank_id");
      }
    } catch (error) {
      return rejectWithValue(
        "Ошибка при обновлении Товарного Парка. Ошибка: " + error
      );
    }
  }
);

//Pipes
const GetPipes = createAsyncThunk(
  "scheme/pipes/get",
  async (scheme_id: number, thunkAPI) => {
    try {
      const response = await pipesService.getPipes(scheme_id);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(
        "Ошибка при получении списка Труб. Ошибка: " + error
      );
    }
  }
);

interface SchemeState {
  map: Map;
  pipeSource: VectorSource;
  wellSource: VectorSource;
  meteringStationSource: VectorSource;
  pumpingStationSource: VectorSource;
  productParkSource: VectorSource;
  wells: IWell[];
  wellPumps: IWellPump[];
  wellTypes: IWellType[];
  meteringStations: IMeteringStation[];
  meteringStationTypes: IMeteringStationType[];
  counterTypes: ICounterType[];
  pumpingStations: IPumpingStation[];
  productParks: IStorageTank[];
  pipes: IPipe[];
  selectedSchemeId: number | null;
  pendingFeature: Feature | null;
}

const osmLayer = new TileLayer({ source: new OSM() });
const view = new View({
  center: fromLonLat([53.0422314905577, 54.84390266665241]),
  zoom: 13.5,
});

const initialState: SchemeState = {
  map: new Map({
    layers: [osmLayer],
    view: view,
  }),
  pipeSource: new VectorSource(),
  wellSource: new VectorSource(),
  meteringStationSource: new VectorSource(),
  pumpingStationSource: new VectorSource(),
  productParkSource: new VectorSource(),
  wells: [],
  wellPumps: [],
  wellTypes: [],
  meteringStations: [],
  meteringStationTypes: [],
  counterTypes: [],
  pumpingStations: [],
  productParks: [],
  pipes: [],
  selectedSchemeId: null,
  pendingFeature: null,
};

export const schemeSlice = createSlice({
  name: "scheme",
  initialState,
  reducers: {
    //initLayers(state) {},
    setMapTarget: (state, action: PayloadAction<string>) => {
      state.map.setTarget(action.payload);
    },
    setSelectedSchemeId: (state, action: PayloadAction<number | null>) => {
      state.selectedSchemeId = action.payload;
    },
    setPendingFeature: (state, action: PayloadAction<Feature | null>) => {
      state.pendingFeature = action.payload;
    },
    clearPipeSource: (state) => {
      state.pipeSource.clear();
    },
    clearSchemeData: (state) => {
      state.wells = [];
      state.meteringStations = [];
      state.pumpingStations = [];
      state.productParks = [];
      state.pipes = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(CreateWell.fulfilled, (state, action) => {
      state.wells.push(action.payload);
    });
    builder.addCase(GetWells.fulfilled, (state, action) => {
      state.wells = action.payload;
    });
    builder.addCase(UpdateWell.fulfilled, (state, action) => {
      state.wells = state.wells.map((well) =>
        well.well_id === action.payload.well_id ? action.payload : well
      );
    });
    builder.addCase(GetWellPumps.fulfilled, (state, action) => {
      state.wellPumps = action.payload;
    });
    builder.addCase(GetWellTypes.fulfilled, (state, action) => {
      state.wellTypes = action.payload;
    });
    builder.addCase(CreateMeteringStation.fulfilled, (state, action) => {
      state.meteringStations.push(action.payload);
    });
    builder.addCase(GetMeteringStations.fulfilled, (state, action) => {
      state.meteringStations = action.payload;
    });
    builder.addCase(UpdateMeteringStation.fulfilled, (state, action) => {
      state.meteringStations = state.meteringStations.map((ms) =>
        ms.metering_station_id === action.payload.metering_station_id
          ? action.payload
          : ms
      );
    });
    builder.addCase(GetMeteringStationTypes.fulfilled, (state, action) => {
      state.meteringStationTypes = action.payload;
    });
    builder.addCase(GetCounterTypes.fulfilled, (state, action) => {
      state.counterTypes = action.payload;
    });
    builder.addCase(CreatePumpingStation.fulfilled, (state, action) => {
      state.pumpingStations.push(action.payload);
    });
    builder.addCase(GetPumpingStations.fulfilled, (state, action) => {
      state.pumpingStations = action.payload;
    });
    builder.addCase(UpdatePumpingStation.fulfilled, (state, action) => {
      state.pumpingStations = state.pumpingStations.map((ps) =>
        ps.pumping_station_id === action.payload.pumping_station_id
          ? action.payload
          : ps
      );
    });
    builder.addCase(CreateProductPark.fulfilled, (state, action) => {
      state.productParks.push(action.payload);
    });
    builder.addCase(GetProductParks.fulfilled, (state, action) => {
      state.productParks = action.payload;
    });
    builder.addCase(UpdateProductPark.fulfilled, (state, action) => {
      state.productParks = state.productParks.map((st) =>
        st.storage_tank_id === action.payload.storage_tank_id
          ? action.payload
          : st
      );
    });
    builder.addCase(GetPipes.fulfilled, (state, action) => {
      state.pipes = action.payload;
    });
  },
});

export const {
  setMapTarget,
  setPendingFeature,
  setSelectedSchemeId,
  clearPipeSource,
  clearSchemeData,
} = schemeSlice.actions;
export {
  GetWells,
  CreateWell,
  UpdateWell,
  GetWellPumps,
  GetWellTypes,
  CreateMeteringStation,
  GetMeteringStations,
  UpdateMeteringStation,
  GetMeteringStationTypes,
  GetCounterTypes,
  CreatePumpingStation,
  GetPumpingStations,
  UpdatePumpingStation,
  CreateProductPark,
  GetProductParks,
  UpdateProductPark,
  GetPipes,
};

export default schemeSlice.reducer;
