// src/main.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { checkAuth } from "./authCheck";

// 🧠 Pre-auth screen
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

async function startApp() {
  const result = await checkAuth();
  if (!result) return;

  let authPayload = {};

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

  window.__AUTH__ = authPayload;

  // 🧹 Clear pre-auth screen
  document.body.innerHTML = `<div id="root"></div>`;

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

startApp();
