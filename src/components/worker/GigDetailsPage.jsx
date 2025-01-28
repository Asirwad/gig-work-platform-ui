import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { Header } from "./Header";
import appconfig from "../../AppConfig.json";
import axios from "axios";
import { motion } from "framer-motion";
import MarkdownPreview from '@uiw/react-markdown-preview';

export function GigDetailsPage({
  gig,
  onBack,
  onShowInterest,
  onWithdrawInterest,
  onNavigate,
}) {
  const [isInterestPopupOpen, setIsInterestPopupOpen] = useState(false);
  const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false);
  const [engagementStatus, setEngagementStatus] = useState(null);

  useEffect(() => {
    axios
      .get(appconfig.apiBaseUrl + `/gigs/${gig._id}/engagement_status`, {
        headers: {
          user_id: appconfig.hardCodedUserId,
        },
      })
      .then((response) => {
        setEngagementStatus(response.data.status);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [gig._id]);

  const handleShowInterest = () => {
    setIsInterestPopupOpen(true);
  };

  const handleInterestConfirm = () => {
    axios
      .post(
        appconfig.apiBaseUrl + "/express_interest",
        { gig_id: gig._id },
        {
          headers: {
            user_id: appconfig.hardCodedUserId,
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    setIsInterestPopupOpen(false);
    onShowInterest(gig);
    setEngagementStatus("interested");
  };

  const handleWithdrawInterest = () => {
    setIsWithdrawPopupOpen(true);
  };

  const handleWithdrawConfirm = () => {
    axios
      .delete(appconfig.apiBaseUrl + "/withdraw_interest", {
        data: { gig_id: gig._id },
        headers: {
          user_id: appconfig.hardCodedUserId,
        },
      })
      .then((response) => {
        console.log(response);
        setIsWithdrawPopupOpen(false);
        onWithdrawInterest(gig);
        setEngagementStatus(null);
        onNavigate("myJobs");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header activePage="jobs" onNavigate={onNavigate} />

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12 w-full min-w-[1200px] sm:w-3/4 md:w-2/3 lg:w-1/2"
      >
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-teal-600"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 text-right">{gig.topic}</h1>
          </div>

          {/* Content Section (Two Columns Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Gig Description & Creator Info) */}
            <div className="lg:col-span-1 flex flex-col justify-between space-y-4">
              <div className="flex-grow bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg mt-6 border-green-300 border-2">
                <h2 className="text-xl text-gray-800 font-medium">Description</h2>
                <h3 className="text-sm mt-2">{gig.description}</h3>
              </div>
              { /* Creator info section */}
              <div className="mt-auto">
                <div className="flex items-center space-x-4">
                  <img
                    src="/assets/manager.png"
                    alt="Manager"
                    className="w-12 h-12 rounded-full border-2 border-teal-600"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Posted By: {gig.manager.name}</p>
                    <p className="text-sm text-gray-600">UID: {gig.manager._id}</p>
                    <p className="text-sm text-gray-600">Role: {gig.manager.role}</p>
                    <a
                      href={gig.teamsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-600 hover:underline"
                    >
                      Teams link (click to chat)
                    </a>
                  </div>
                </div>
              </div>
            </div>


            {/* Right Column (Task Description) */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Task Description</h2>
              <MarkdownPreview
                source={gig.title}
                style={{
                  padding: 16,
                  backgroundColor: 'whitesmoke',
                  color: '#2d2d2d',
                  borderRadius: 8,
                  overflow: 'auto',
                  maxHeight: '400px',
                  fontSize: '0.875rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #86efac',
                }}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="text-right">
            {engagementStatus === null ? (
              <Button
                className="bg-teal-600 text-white hover:bg-teal-700 transition-all"
                onClick={handleShowInterest}
              >
                Show Interest
              </Button>
            ) : (
              <Button
                className="bg-red-600 text-white hover:bg-red-700 transition-all"
                onClick={handleWithdrawInterest}
              >
                Withdraw Interest
              </Button>
            )}
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={isInterestPopupOpen} onOpenChange={setIsInterestPopupOpen}>
          <DialogContent className="text-center bg-white rounded-xl shadow-md p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-teal-600">
                Interest Confirmation
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-700 my-4">
              You have successfully shown interest in this gig! The manager has been
              notified and will review your request shortly.
            </p>
            <DialogFooter>
              <Button className="bg-teal-600 text-white" onClick={handleInterestConfirm}>
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isWithdrawPopupOpen} onOpenChange={setIsWithdrawPopupOpen}>
          <DialogContent className="text-center bg-white rounded-xl shadow-md p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-red-600">
                Withdraw Interest
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-700 my-4">
              Are you sure you want to withdraw your interest? This action cannot be
              undone.
            </p>
            <DialogFooter>
              <Button
                className="bg-gray-400 text-white"
                onClick={() => setIsWithdrawPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={handleWithdrawConfirm}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

GigDetailsPage.propTypes = {
  gig: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    manager: PropTypes.shape({
      name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }).isRequired,
    teamsLink: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onShowInterest: PropTypes.func.isRequired,
  onWithdrawInterest: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
