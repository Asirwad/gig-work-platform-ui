import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ViewJobDetails } from "./ViewJobDetails";

export function JobList({ jobs, onUpdateJob, onSubmitJob }) {
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleBackFromJobDetails = () => {
    setSelectedJob(null);
  };

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

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{job.heading}</h3>
              <span className="text-sm text-gray-500">
                Status:{" "}
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">USTAR</span>
              <div className="h-6 w-6 rounded-full border flex items-center justify-center">
                {job.ustarPoints}
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
            >
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-red-600 border-red-600 hover:bg-red-50"
            >
              Revoke
            </Button>
          </div>
        </div>
      ))}
      {jobs.length === 0 && (
        <p className="text-center text-gray-500">No jobs posted yet.</p>
      )}
    </div>
  );
}
