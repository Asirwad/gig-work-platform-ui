import { ToastContainer } from 'react-toastify';
import React, { useEffect, useState } from "react";
import { ArrowLeft, PlusCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'react-toastify';
import { getGigStatusBadgeColor, getUStarName, getUStarPoint } from '../../lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import appConfig from "../../AppConfig.json";
import axios from "axios";

export function ViewJobDetails({ job, onBack, onSave, onSubmit }) {
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskDetails, setTaskDetails] = useState("");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [listEmpty, setListEmpty] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    confirmText: "",
    cancelText: "",
  });
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [formData, setFormData] = useState({
    collaborator_id: '',
  })
  const isDraft = job.status === "draft";
  const [currentTab, setCurrentTab] = useState('users');

  // console.log(`job: `, job)

  const user_id = appConfig.hardCodedUserId;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(taskDetails);
  };

  const handleSubmit = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    onSubmit({ ...taskDetails, status: "submitted" });
    setShowSubmitDialog(false);
  };

  const getStatusColor = (status) => {
    return status === "Completed" ? "text-yellow-500" : "text-blue-500";
  };

  const updateGigEngagementStatus = (job_id, user_id, status) => {
    const payload = {
      gig_id: job_id,
      user_id: user_id,
      status: status
    }
    console.log(payload);
    axios.patch(appConfig.apiBaseUrl + `/update_gig_engagement`, payload)
      .then((response) => {
        console.log(response.data);
        toast.success("Status updated successfully");
        setInterestedUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === user_id ? { ...user, status: status } : user
          )
        );
      }).catch((error) => {
        toast.error("Failed to update status");
      });
  }

  const handleTaskEdit = () => {
    setIsEditingTask(true);
  };

  const handleTaskSave = () => {
    const updatedJob = { ...job, title: taskDetails };
    console.log(updatedJob);
    axios.patch(appConfig.apiBaseUrl + `/gigs/${job._id}`, updatedJob)
      .then((response) => {
        console.log(response.data);
        setIsEditingTask(false);
        setTaskDetails(taskDetails);
        toast.success("Task updated successfully");
      })
      .catch((error) => {
        toast.error("Failed to update task");
      })
  };

  const handleTaskCancel = () => {
    setTaskDetails(job.task);
    setIsEditingTask(false);
  };

  const handleCollaboratorRemoveClick = (collaborator) => {
    setDialogContent({
      title: "Remove Collaborator",
      description: `Are you sure you want to remove ${collaborator.name} from the collaborators list?`,
      confirmText: "Yes, Remove",
      cancelText: "Cancel",
    });
    setSelectedCollaborator(collaborator);
    setDialogOpen(true);
  };

  const handleConfirmCollaboratorRemove = async () => {
    if (selectedCollaborator) {
      try {
        const response = await axios.delete(appConfig.apiBaseUrl + `/gigs/${job._id}/collaborators/${selectedCollaborator._id}`);
        console.log(response);
        if (response.status === 200) {
          toast.success("Collaborator removed successfully");
          job.collaborators = response.data.gig.collaborators;
        } else {
          toast.error("Failed to remove collaborator");
        }
      } catch (error) {
        toast.error("Failed to remove collaborator");
      }
    }
    setDialogOpen(false);
    setDialogContent([]);
  };

  const handleCancelCollaboratorRemove = () => {
    setSelectedCollaborator(null);
    setDialogOpen(false);
    setDialogContent([]);
  };

  const resetForm = () => {
    setFormData({ collaborator_id: '' });
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(appConfig.apiBaseUrl + `/gigs/${job._id}/collaborators`, {
        "collaborator_id": formData.collaborator_id
      });
      job.collaborators = response.data.gig.collaborators;
      toast.success('Collaborator added successfully');
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error('Failed to add collaborator');
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  useEffect(() => {
    // Fetch interested users from the API
    const fetchInterestedUsers = async () => {
      try {
        const response = await axios.get(
          `${appConfig.apiBaseUrl}/gig/${job._id}/interested`, {
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

  useState(() => {
    setTaskDetails(job.title);
  }, [job]);

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
                value={job.heading}
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
                value={job.description}
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
                value={job.title}
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
                value={job.ustarPoints}
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}

          >
            <div className="relative bg-gradient-to-r from-white to-gray-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{job.topic}</h1>
                    <h6 className="text-1xl">{job.description}</h6>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getGigStatusBadgeColor(job.status)}`}>{job.status}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">USTAR Points: {getUStarPoint.get(job.ustar_category)} ({job.ustar_category})</span>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="users" className="p-6">
                <TabsList className="gap-2">
                  <TabsTrigger
                    value="users"
                    onClick={() => setCurrentTab('users')}
                    className={`${
                      currentTab === 'users' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-600'
                    } ${currentTab !== 'users' && 'hover:bg-teal-100 hover:text-teal-800'} transition-colors duration-300 ease-in-out px-4 py-2 rounded-md`}
                  >
                    User Status
                  </TabsTrigger>
                  <TabsTrigger
                    value="task"
                    onClick={() => setCurrentTab('task')}
                    className={`${
                      currentTab === 'task' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-600'
                    } ${currentTab !== 'task' && 'hover:bg-teal-100 hover:text-teal-800'} transition-colors duration-300 ease-in-out px-4 py-2 rounded-md`}
                  >
                    Task
                  </TabsTrigger>
                  <TabsTrigger
                    value="collaborators"
                    onClick={() => setCurrentTab('collaborators')}
                    className={`${
                      currentTab === 'collaborators' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-600'
                    } ${currentTab !== 'collaborators' && 'hover:bg-teal-100 hover:text-teal-800'} transition-colors duration-300 ease-in-out px-4 py-2 rounded-md`}
                  >
                    Collaborators
                  </TabsTrigger>
                  <TabsTrigger
                    value="addCollaborator"
                    onClick={() => setCurrentTab('addCollaborator')}
                    className={`${
                      currentTab === 'addCollaborator' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-teal-600'
                    } ${currentTab !== 'addCollaborator' && 'hover:bg-teal-100 hover:text-teal-800'} transition-colors duration-300 ease-in-out px-4 py-2 rounded-md`}
                  >
                    Add Collaborator
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="mt-6">
                  {interestedUsers.length > 0 ? (
                    <div className="space-y-4">
                      {interestedUsers.map((user, index) => (
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.2 * (index + 1) }}
                          viewport={{ amount: 0.3, once: true }}
                        >
                          <div key={user.id} className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Name: {user.name}</p>
                                <p className="text-sm text-gray-500">Email: {user.email}</p>
                                <p className="text-sm text-gray-500">ID: {user.user_id}</p>
                                {user.role && (<p className="text-sm text-gray-500">Role: {user.role}</p>)}
                                <p className="text-sm">Status: <span className={getStatusColor(user.status) + " font-semibold"}>{user.status}</span></p>
                                <div className="mt-2">
                                  Teams link: <a href={user.teamsLink || 'https://teams.microsoft.com/l/chat/2'} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{user.teamsLink || 'https://teams.microsoft.com/l/chat/'}</a>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {user.status === 'interested' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-teal-600 hover:bg-teal-400 text-white text-sm px-4 py-1 rounded transition-colors"
                                      onClick={() => updateGigEngagementStatus(job._id, user.user_id, "approved")}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="bg-red-50 border-red-600 text-red-700 hover:bg-red-600 hover:text-white hover:border-collapse transition-colors"
                                      onClick={() => updateGigEngagementStatus(job._id, user.user_id, "rejected")}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No one has shown interest in this job yet.</p>
                  )}
                </TabsContent>

                {/* <TabsContent value="task" className="mt-6">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-4">Task Details</h3>
                    <p>{job.title}</p>
                  </div>
                </TabsContent> */}
                <TabsContent value="task" className="mt-6">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    viewport={{ amount: 0.3, once: true }}
                    className="prose max-w-none"
                  >
                    <h3 className="text-lg font-semibold mb-4">Task Details </h3>
                    {isEditingTask ? (
                      <div>
                        <Label htmlFor="task-details">Task Details</Label>
                        <Input
                          id="task-details"
                          value={taskDetails}
                          onChange={(e) => setTaskDetails(e.target.value)}
                          className="mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleTaskCancel}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleTaskSave}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative pb-6">
                        <p className="whitespace-pre-line">{taskDetails}</p>
                        <button
                          onClick={handleTaskEdit}
                          className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-400 text-white text-sm px-4 py-1.5 rounded"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
                <TabsContent value="collaborators" className="mt-6">
                  {job.collaborators.length > 0 ? (
                    <>
                      <h2 className='mb-4 ml-5'>Total Collaborators: {job.collaborators.length}</h2>
                      <div className="space-y-4">
                        {job.collaborators.map((user, index) => (
                          <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.2 * (index + 1) }}
                            viewport={{ amount: 0.3, once: true }}
                          >
                            <div key={user._id} className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Name: {user.name}</p>
                                  <p className="text-sm text-gray-500">Email: {user.email}</p>
                                  {user.role && (<p className="text-sm text-gray-500">Role: {user.role}</p>)}
                                  <div className="mt-2">
                                    Teams link: <a href={user.teamsLink || 'https://teams.microsoft.com/l/chat/2'} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{user.teamsLink || 'https://teams.microsoft.com/l/chat/'}</a>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    className="flex items-center bg-teal-600 hover:bg-teal-400 text-white text-sm px-4 py-1 rounded transition-colors"
                                    onClick={() => handleCollaboratorRemoveClick(user)}
                                  >
                                    Remove
                                    <Trash className='ml-2' size={16} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No collaborator in this job yet.</p>
                  )}
                </TabsContent>

                <TabsContent value="addCollaborator" className="mt-6">
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    viewport={{ amount: 0.3, once: true }}
                    className="w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
                  >
                    <h2 className="text-xl font-semibold text-teal-800 mb-3">Add Collaborator</h2>
                    <form onSubmit={handleAddCollaborator} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          type="text"
                          id="collaborator_id"
                          name="collaborator_id"
                          required
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Enter Collaborator ID"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="flex items-center bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        Add
                        <PlusCircle className="ml-2" size={18} />
                      </Button>
                    </form>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
          
        )}
        <ToastContainer position='bottom-right' />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <p>{dialogContent.description}</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCollaboratorRemove}>
              {dialogContent.cancelText}
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-500 transition-colors" onClick={handleConfirmCollaboratorRemove}>
              {dialogContent.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
