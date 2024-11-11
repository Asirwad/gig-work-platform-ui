import React, { useState } from "react";
import { Header } from "./creator/Header";
import { JobForm } from "./creator/JobForm";
import { JobList } from "./creator/JobList";
import { SubmitDialog } from "./creator/SubmitDialog";

export function Creator() {
  const [activePage, setActivePage] = useState("addJobs");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    task: "",
    ustarPoints: "",
  });
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    if (validateForm()) {
      const newJob = {
        ...formData,
        id: Date.now(),
        status: "draft",
        createdAt: new Date().toISOString(),
      };
      setJobs((prev) => [...prev, newJob]);
      resetForm();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSubmitDialog(true);
    }
  };

  const confirmSubmit = () => {
    const newJob = {
      ...formData,
      id: Date.now(),
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [...prev, newJob]);
    resetForm();
    setShowSubmitDialog(false);
  };

  const resetForm = () => {
    setFormData({ heading: "", description: "", task: "", ustarPoints: "" });
    setErrors({});
  };

  const validateForm = () => {
    const requiredFields = ["heading", "description", "task", "ustarPoints"];
    const newErrors = requiredFields.reduce((acc, field) => {
      acc[field] = !formData[field].trim();
      return acc;
    }, {});
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <Header activePage={activePage} setActivePage={setActivePage} />

      <main className="container mx-auto px-4 py-8">
        {activePage === "addJobs" ? (
          <JobForm
            formData={formData}
            setFormData={setFormData}
            handleSave={handleSave}
            handleSubmit={handleSubmit}
            errors={errors}
            setErrors={setErrors}
          />
        ) : (
          <JobList jobs={jobs} />
        )}
      </main>

      <SubmitDialog
        show={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={confirmSubmit}
      />
    </div>
  );
}
