import { combineReducers, configureStore } from "@reduxjs/toolkit";
import scheme from "./reducers/SchemeSlice";

const rootReducer = combineReducers({
  scheme: scheme,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
