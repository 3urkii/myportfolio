import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/inter";
import "./styles/globals.css";
import { Landing } from "@/components/Landing/Landing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Landing />
  </StrictMode>
);
