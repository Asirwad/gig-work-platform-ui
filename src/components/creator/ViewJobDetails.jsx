import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import appConfig from "../../AppConfig.json";
// import { data } from "autoprefixer";
import axios from "axios";
import { string } from "prop-types";

// Dummy data for interested users
// const dummyUsers = [
//   {
//     id: 1,
//     name: "XYZ1",
//     uid: "XXXXXXXX1",
//     role: "XYZ",
//     status: "Completed",
//     teamsLink: "https://teams.microsoft.com/l/chat/0",
//   },
//   {
//     id: 2,
//     name: "XYZ2",
//     uid: "XXXXXXXX2",
//     role: "XYZ",
//     status: "Submitted",
//     teamsLink: "https://teams.microsoft.com/l/chat/1",
//   },
//   {
//     id: 3,
//     name: "XYZ3",
//     uid: "XXXXXXXX3",
//     role: "XYZ",
//     status: "Completed",
//     teamsLink: "https://teams.microsoft.com/l/chat/2",
//   },
// ];

// class users{
//     id: Number,
//     name: String,
//     uid: String,
//     role: String,
//     status: String,
//     teamsLink: String,
// }

export function ViewJobDetails({ job, onBack, onSave, onSubmit }) {
  const [editedJob, setEditedJob] = useState(job);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [listEmpty, setListEmpty] = useState(false);
  const isDraft = job.status === "draft";

  const user_id = appConfig.hardCodedUserId;

  const reversedUStarMapping = new Map();
  reversedUStarMapping.set("RisingStar", "1");
  reversedUStarMapping.set("ShiningStar", "2");
  reversedUStarMapping.set("SuperStar", "3");
  reversedUStarMapping.set("NovaStar", "4");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedJob);
  };

  const handleSubmit = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    onSubmit({ ...editedJob, status: "submitted" });
    setShowSubmitDialog(false);
  };

  const getStatusColor = (status) => {
    return status === "Completed" ? "text-yellow-500" : "text-blue-500";
  };


  useEffect(() => {
    // Fetch interested users from the API
    const fetchInterestedUsers = async () => {
      try {
        const response = await axios.get(
          `${appConfig.apiBaseUrl}/gig/${editedJob._id}/interested`, {
            headers: {
              'user_id': user_id
            }
          }
        );
        console.log(response.data.interestedUsers);
        setListEmpty(false);
        setInterestedUsers(response.data.interestedUsers);
      } catch (error) {
        console.error("Error fetching interested users:", error);
        setListEmpty(true);
        setMessage(error.response.data.message);
      }
    };

    fetchInterestedUsers();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#f5f3ef] p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {isDraft ? (
          // Edit form for draft jobs
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Label htmlFor="heading" className="text-sm font-medium">
                Heading
              </Label>
              <Input
                id="heading"
                name="heading"
                value={editedJob.heading}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editedJob.description}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Label htmlFor="task" className="text-sm font-medium">
                Task
              </Label>
              <Textarea
                id="task"
                name="task"
                value={editedJob.task}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Label htmlFor="ustarPoints" className="text-sm font-medium">
                USTAR Points
              </Label>
              <Input
                id="ustarPoints"
                name="ustarPoints"
                value={editedJob.ustarPoints}
                onChange={handleInputChange}
                className="mt-1"
                type="number"
                min="0"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleSave}
                className="bg-teal-600 text-white hover:bg-teal-700"
              >
                Save Changes
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </div>
        ) : (
          // View mode for submitted jobs
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold">{job.heading}</h1>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Status: {job.status}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  USTAR Points: {reversedUStarMapping.get(job.ustar_category)}
                </span>
              </div>
            </div>

            <Tabs defaultValue="users" className="p-6">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="task">Task</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-6">
                {!listEmpty ? (
                  <div className="space-y-4">
                    {interestedUsers.map((user) => (
                      <div key={user.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Name: {user.name}</p>
                            <p className="text-sm text-gray-500">
                              UID: {user.user_id}
                            </p>
                            <p className="text-sm text-gray-500">
                              Role: {user.role}  dummy role
                            </p>
                            <p className="text-sm">
                              Status:{" "}
                              <span className={getStatusColor(user.status)}>
                                {user.status}
                              </span>
                            </p>
                            <div className="mt-2">
                              Teams link:{" "}
                              <a
                                href={user.teamsLink}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {user.teamsLink} https://teams.microsoft.com/l/chat/1 (dummy link)
                              </a>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-teal-600 text-white hover:bg-teal-700"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {message}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="status" className="mt-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-4">Job Status</h3>
                  <p>{job.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="task" className="mt-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-4">Task Details</h3>
                  <p>{job.title}</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this job?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSubmit}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
