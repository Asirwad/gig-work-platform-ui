import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ViewJobDetails } from "./ViewJobDetails";
import axios from "axios";
import appConfig from "../../AppConfig.json";
import { motion } from "framer-motion";
import { getUStarPoint } from "../../lib/utils";
import { toast, ToastContainer } from "react-toastify";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

export function JobList({ jobs, setJobs, onUpdateJob, onSubmitJob }) {
  const [selectedJob, setSelectedJob] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    confirmText: "",
    cancelText: "",
  });
  const [gigIdForRevoke, setGigIdForRevoke] = useState(null);

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
        toast.success('Status updated successfully');
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
  // const handleRevoke = (gigId) => updateGigStatus(gigId, "revoked");
  const handleRevoke = (gigId) => {
    setDialogContent({
      title: "Revoke Gig",
      description: "Are you sure you want to revoke this gig?",
      confirmText: "Revoke",
      cancelText: "Cancel",
    });
    setDialogOpen(true);
    setGigIdForRevoke(gigId);
  }

  const handleRevokeConfirm = () => updateGigStatus(gigIdForRevoke, "revoked");
  const handleRevokeCancel = () => setDialogOpen(false);


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {jobs.filter(job => job.status !== 'revoked').map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.15 }}
        >
          <div className="relative bg-gradient-to-r from-white to-gray-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Top Section */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                  {job.topic}
                </h3>
                <span
                  className={`inline-block text-xs font-medium mt-1 px-2 py-1 rounded-full transition-all duration-300 ${
                    job.status === "approved"
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : job.status === "paused"
                      ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-600">USTAR</span>
                <div className="h-8 w-8 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center shadow-lg">
                  {getUStarPoint.get(job.ustar_category)}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed">{job.description}</p>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50 transition-transform transform hover:scale-105"
                onClick={() => handleJobSelect(job)}
              >
                {job.status === "approved" ? "Edit" : "View"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50 transition-transform transform hover:scale-105"
                onClick={() =>
                  handlePause(
                    job._id,
                    job.status === "paused" ? "approved" : "paused"
                  )
                }
              >
                {job.status === "paused" ? "Open" : "Pause"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-teal-600 border-teal-600 hover:bg-red-500 hover:text-white transition-transform transform hover:scale-105"
                onClick={() => handleRevoke(job._id)}
              >
                Revoke
              </Button>
            </div>

            {/* Decorative Overlay */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent via-transparent to-teal-100 opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </motion.div>
      ))}
      {/* Fallback Message */}
      {jobs.length === 0 && (
        <p className="text-center text-gray-500">No jobs posted yet.</p>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <p>{dialogContent.description}</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleRevokeCancel}>
              {dialogContent.cancelText}
            </Button>
            <Button variant="destructive" className="bg-red-600 text-white hover:bg-red-500 transition-colors" onClick={handleRevokeConfirm}>
              {dialogContent.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer position="bottom-left" />
    </div>

  );
}
