import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { clearSession, getSession } from "./services/sessionService.ts";

// An expired or revoked session makes every request 401: go back to the login page instead of showing empty pages.
axios.interceptors.response.use(undefined, (error) => {
  if (error.response?.status === 401 && getSession()) {
    clearSession();
    window.location.assign("/login");
  }
  return Promise.reject(error);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
