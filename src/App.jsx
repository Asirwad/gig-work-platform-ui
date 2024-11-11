import React, { useState } from "react";
import Workers from "./components/Workers";
import { CreateJobPage } from "./components/CreateJobPage";
import "./index.css";

export default function App() {
  const [userRole, setUserRole] = useState("creator");

  return (
    <div className="app-container">
      {userRole === "creator" ? (
        <CreateJobPage />
      ) : userRole === "worker" ? (
        <Workers />
      ) : null}
    </div>
  );
}
