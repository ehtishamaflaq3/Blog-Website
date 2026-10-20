import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeSlice from "./themeSlice";
import blogSlice from './blogSlice'
import {
  createMigrate,
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
const migrations = {
  2: (state) => {
    if (!state) return state;
    return {
      ...state,
      blog: { loading: false, blog: [] },
    };
  },
};

const persistConfig = {
  key: "root",
  version: 2,
  storage,
  blacklist: ["blog"],
  migrate: createMigrate(migrations),
};
const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  blog:blogSlice
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