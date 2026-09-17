import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "./index.css";

import { PrimeReactProvider } from "primereact/api";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { StrictMode } from "react";

import { ThemeProvider } from "./context/ThemeContext.tsx";
import { QueryProvider } from "./components";
import App from "./App.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <PrimeReactProvider>
          <Toaster containerClassName="z-999999" />
          <App />
        </PrimeReactProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
