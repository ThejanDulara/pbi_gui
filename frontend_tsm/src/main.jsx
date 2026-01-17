// src/main.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { checkAuth } from "./authCheck"; // 🔒 authorization check

// 🧠 Immediately show white screen + small message
document.body.style.margin = "0";
document.body.innerHTML = `
  <div id="pre-auth-screen"
    style="
      display:flex;
      align-items:center;
      justify-content:center;
      height:100vh;
      background:white;
      color:#3bb9af;
      font-family:Arial, sans-serif;
      font-size:18px;
      letter-spacing:0.5px;
    ">
    Authorization Processing...
  </div>
`;

async function startApp() {
  const result = await checkAuth();
  if (!result) return; // redirect handled inside checkAuth

  let authPayload = {};

  // Support both old (boolean) and new (object) styles
  if (typeof result === "object") {
    const {
      authorized,
      userId,
      firstName,
      lastName,
      isAdmin,
      canUpdateData,
    } = result;

    if (authorized === false) return;

    authPayload = {
      userId: userId || "",
      firstName: firstName || "",
      lastName: lastName || "",
      isAdmin: !!isAdmin,
      canUpdateData: !!canUpdateData,
    };
  }

  // 🌍 Make auth globally available
  window.__AUTH__ = authPayload;

  // 🧹 Clear pre-auth screen and mount React
  document.body.innerHTML = `<div id="root"></div>`;

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

// 🚀 Start application
startApp();
