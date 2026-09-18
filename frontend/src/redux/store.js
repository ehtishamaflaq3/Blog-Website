import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import themeSlice from "./themeSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storageModule from "redux-persist/lib/storage";

const storage = storageModule.default;

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
});

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export default store;