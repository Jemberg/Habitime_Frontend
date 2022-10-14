import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Settings from "./components/settings";

import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/settings" element={<Settings />}></Route>
    </Routes>
  </BrowserRouter>
);
