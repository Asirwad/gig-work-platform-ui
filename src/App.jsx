import React, { useState } from "react";
import Workers from "./components/Workers";
import "./index.css";
import { Creator } from "./components/Creator";
import appConfig from "./AppConfig.json"

export default function App() {
  const [userRole, setUserRole] = useState(appConfig.currentUserRole);

  return (
    <div className="app-container">
      {userRole === "creator" ? (
        <Creator />
      ) : userRole === "worker" ? (
        <Workers />
      ) : null}
    </div>
  );
}
