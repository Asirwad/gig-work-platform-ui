import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ViewJobDetails } from "./ViewJobDetails";
import axios from "axios";
import appConfig from "../../AppConfig.json";
import { motion } from "framer-motion";

export function JobList({ jobs, onUpdateJob, onSubmitJob }) {
  const [selectedJob, setSelectedJob] = useState(null);

  const reversedUStarMapping = new Map();
  reversedUStarMapping.set("RisingStar", "1");
  reversedUStarMapping.set("ShiningStar", "2");
  reversedUStarMapping.set("SuperStar", "3");
  reversedUStarMapping.set("NovaStar", "4");

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleBackFromJobDetails = () => {
    setSelectedJob(null);
  };

  const updateGigStatus = async (gigId, newStatus) => {
    const payload = {"gig_id": gigId,"status": newStatus}
    console.log(payload);
    try{
        await axios.patch(
          appConfig.apiBaseUrl + "/update_gig", 
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        );
        console.log("Updated!")
        // to be replaced by appropriate method
        window.location.reload();
    }catch(err){
      console.log("Failed to update gig Status\n", err);
    }
  }

  const handleSaveJobDetails = (updatedJob) => {
    // Update the job in the list
    // This would typically involve updating the state in the parent component
    console.log("Saving updated job:", updatedJob);
    setSelectedJob(null);
  };

  if (selectedJob) {
    return (
      <ViewJobDetails
        job={selectedJob}
        onBack={handleBackFromJobDetails}
        onSave={handleSaveJobDetails}
        onSubmit={onSubmitJob}
      />
    );
  }

  const handlePause = (gigId, status) => updateGigStatus(gigId, status);
  const handleRevoke = (gigId) => updateGigStatus(gigId, "revoked");

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {jobs.filter(job => job.status !== 'revoked' && job.status !== 'awaiting_admin_approval').map((job, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.15 }}
        
        >
        <div key={job.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{job.topic}</h3>
              <span className="text-sm text-gray-500">
                Status:{" "}
                {job.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">USTAR</span>
              <div className="h-6 w-6 rounded-full border flex items-center justify-center">
                {reversedUStarMapping.get(job.ustar_category)}
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-4">{job.description}</p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50"
              onClick={() => handleJobSelect(job)}
            >
              {job.status === "draft" ? "Edit" : "View"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50"
              onClick={()=> handlePause(job._id, job.status === "paused" ? "Open" : "paused")}
            >
              {job.status === "paused" ? "Open" : "Pause"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-red-600 border-red-600 hover:bg-red-50"
              onClick={()=> handleRevoke(job._id)}
              // disabled={job.status === "revoked"}
            >
              Revoke
            </Button>
          </div>
        </div>
        </motion.div>
      ))}
      {jobs.length === 0 && (
        <p className="text-center text-gray-500">No jobs posted yet.</p>
      )}
    </div>
  );
}
