import {
  combineReducers,
  configureStore,
  createReducer,
} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  geoScheme: createReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
