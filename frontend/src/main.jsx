import { Toaster } from "@/components/ui/toast";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import store from "./redux/store.js";
import ThemeProvider from "./components/ThemeProvider.jsx";

import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

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