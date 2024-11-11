"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function CreateJobPage({ userRole = "creator" }) {
  const [activePage, setActivePage] = useState("addJobs");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [jobs, setJobs] = useState([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    task: "",
    ustarPoints: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (Object.values(formData).some((value) => value === "")) {
      toast({
        title: "Warning",
        description: "Please fill in all fields before saving.",
        variant: "destructive",
      });
      return;
    }

    const newJob = {
      ...formData,
      id: Date.now(),
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [...prev, newJob]);
    setFormData({
      heading: "",
      description: "",
      task: "",
      ustarPoints: "",
    });
    toast({
      title: "Job Saved",
      description: "Your job has been saved as a draft.",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => value === "")) {
      toast({
        title: "Warning",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    const newJob = {
      ...formData,
      id: Date.now(),
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [...prev, newJob]);
    setFormData({
      heading: "",
      description: "",
      task: "",
      ustarPoints: "",
    });
    setShowSubmitDialog(false);
    toast({
      title: "Success",
      description: "Your job has been submitted successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <header className="bg-[#f5f3ef] border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex space-x-6">
              <button
                onClick={() => setActivePage("addJobs")}
                className={`text-lg font-medium ${
                  activePage === "addJobs" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Add Jobs
              </button>
              <button
                onClick={() => setActivePage("postedJobs")}
                className={`text-lg font-medium ${
                  activePage === "postedJobs"
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                My Posted Jobs
              </button>
            </nav>
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-600" />
              <div className="flex items-center space-x-2">
                <span className="text-sm">My profile</span>
                <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  AB
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activePage === "addJobs" ? (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Label htmlFor="heading" className="text-sm font-medium">
                Heading
              </Label>
              <Input
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Label htmlFor="task" className="text-sm font-medium">
                Task
              </Label>
              <Textarea
                id="task"
                name="task"
                value={formData.task}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Label htmlFor="ustarPoints" className="text-sm font-medium">
                USTAR Points
              </Label>
              <Input
                id="ustarPoints"
                name="ustarPoints"
                value={formData.ustarPoints}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={handleSave}
                variant="outline"
                className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50"
              >
                Save
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 text-white hover:bg-teal-700"
              >
                Submit
              </Button>
            </div>
          </form>
        ) : (
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
                  >
                    View
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
        )}
      </main>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this job? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
              className="bg-white text-teal-600 border-teal-600 hover:bg-teal-50"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSubmit}
              className="bg-teal-600 text-white hover:bg-teal-700"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
