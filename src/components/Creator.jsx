import React, { useState, useEffect } from "react";
import { Header } from "./creator/Header";
import { JobForm } from "./creator/JobForm";
import { JobList } from "./creator/JobList";
import { SubmitDialog } from "./creator/SubmitDialog";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import appConfig from "../AppConfig.json";
// import gig from "../../../Gigworks/models/gig";

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        //setLoading(true);
        const response = await axios.get(appConfig.apiBaseUrl + "/gigs", {
          headers: {
            "user_id": appConfig.hardCodedUserId
          }
        });
        setJobs(response.data.gigs);
      } catch (err) {
        console.log(err);
      } finally {
        //setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const uStarPointsMapping = new Map();
  uStarPointsMapping.set("1", "RisingStar");
  uStarPointsMapping.set("2", "ShiningStar");
  uStarPointsMapping.set("3", "SuperStar");
  uStarPointsMapping.set("4", "NovaStar");

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
      toast({
        title: "Job Saved",
        description: "Your job has been saved as a draft.",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSubmitDialog(true);
    }
  };

  const confirmSubmit = async () => {
    console.log(formData);
    const newJob = {
      ...formData,
      id: Date.now(),
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [...prev, newJob]);
    resetForm();
    setShowSubmitDialog(false);

    try {
      const payload = {
        "topic": formData.heading,
        "description": formData.description,
        "title": formData.task,
        "ustar_category": uStarPointsMapping.get(formData.ustarPoints),
        "email": appConfig.hardCodedUserId+"@email.com",
      };
      console.log(payload);
      await axios.post(appConfig.apiBaseUrl +"/create_gig", payload, 
        {
        headers:{
          "Content-Type": "application/json",
          user_id: appConfig.hardCodedUserId
        }
      })
      toast({
        title: "Job Submitted",
        description: "Your job has been submitted successfully.",
      });
      setActivePage("postedJobs");
    } catch (error) {
      console.log(error);
      toast({
        title: "Job Not Submitted",
        description: "Internal Error🤷‍♂️",
      });
    }
  };

  const resetForm = () => {
    setFormData({ heading: "", description: "", task: "", ustarPoints: "" });
    setErrors({});
  };

  const validateForm = () => {
    const requiredFields = ["heading", "description", "task", "ustarPoints"];
    const newErrors = requiredFields.reduce((acc, field) => {
      if (field === "ustarPoints") {
        acc[field] =
          !formData[field].trim() ||
          !/^[0-9]+$/.test(formData[field]) ||
          parseInt(formData[field], 10) < 0;
      } else {
        acc[field] = !formData[field].trim();
      }
      return acc;
    }, {});
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast({
        title: "Validation Error",
        description:
          "Please fill in all required fields with valid values. USTAR Points must be a non-negative integer.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleUpdateJob = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
    toast({
      title: "Job Updated",
      description: "Your job has been updated successfully.",
    });
  };

  const handleSubmitJob = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
    toast({
      title: "Job Submitted",
      description: "Your job has been submitted successfully.",
    });
    setActivePage("postedJobs");
  };

  // const isInterested = () => {
  //   if (activePage === "postedJobs") {
  //     return jobs.some((job) => job.status === "interested");
  //   }
  // }

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
          <JobList
            jobs={jobs}
            onUpdateJob={handleUpdateJob}
            onSubmitJob={handleSubmitJob}
          />
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
