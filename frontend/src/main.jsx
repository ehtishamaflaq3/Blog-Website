import { Toaster } from "@/components/ui/toast";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";

import App from "./App.jsx";
import store from "./pages/redux/store.js";
import ThemeProvider from "./components/ThemeProvider.jsx";

import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:3000/api/v1";
axios.defaults.withCredentials = true;

const persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
          <Toaster />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);