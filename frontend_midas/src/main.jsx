// src/main.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { checkAuth } from "./authCheck";

// 🔍 Detect localhost
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// 🧠 Pre-auth screen (ONLY for production)
if (!isLocalhost) {
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
      ">
      Authorization Processing...
    </div>
  `;
}

async function startApp() {
  let authPayload = {};

  // 🟢 LOCAL DEV → skip auth
  if (isLocalhost) {
    console.log("🟢 Localhost detected — skipping authorization");

    authPayload = {
      userId: "local-dev",
      firstName: "Local",
      lastName: "User",
      isAdmin: true,
      canUpdateData: true,
      designation: "Developer",
      email: "local@dev.com",
      profilePic: "",
    };
  } else {
    // 🔐 PROD → real auth
    const result = await checkAuth();
    if (!result) return;

    if (typeof result === "object") {
      if (result.authorized === false) return;

      authPayload = {
        userId: result.id || "",
        firstName: result.first_name || "",
        lastName: result.last_name || "",
        isAdmin: !!result.is_admin,
        canUpdateData: !!result.can_update_data,
        designation: result.designation || "",
        email: result.email || "",
        profilePic: result.profile_pic || "",
      };
    }
  }

  window.__AUTH__ = authPayload;

  // 🧹 Render App
  document.body.innerHTML = `<div id="root"></div>`;

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

startApp();
