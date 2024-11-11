import React, { useState } from "react";
import Workers from "./components/Workers";
import "./index.css";
import { Creator } from "./components/Creator";

export default function App() {
  const [userRole, setUserRole] = useState("creator");

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
