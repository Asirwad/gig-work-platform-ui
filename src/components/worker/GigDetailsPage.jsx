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
import appconfig from '../../AppConfig.json'
import axios from "axios";
import { motion } from "framer-motion";

export function GigDetailsPage({
  gig,
  onBack,
  onShowInterest,
  onWithdrawInterest,
  onNavigate,
  isInterested,
}) {
  const [isInterestPopupOpen, setIsInterestPopupOpen] = useState(false);
  const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false);
  const [engagementStatus, setEngagementStatus] = useState(null);

  useEffect(() => {
    const getUserEngagementStatus = async () => {
      try {
        const response = await axios.get(appconfig.apiBaseUrl + `/gig/${gig._id}/interested_user`, {
          headers: {
            'user_id': appconfig.hardCodedUserId
          }
        });
        if(response.data.message === 'User not found who showed interest in this gig.') return 'not_interested'
        return response.data.status;
        
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    };

    const fetchEngagementStatus = async () => {
      const status = await getUserEngagementStatus();
      setEngagementStatus(status);
    }
  
    fetchEngagementStatus();
    console.log(engagementStatus);
  });
  

  const handleShowInterest = () => {
    setIsInterestPopupOpen(true);
  };

  const handleInterestConfirm = () => {
    axios.post(appconfig.apiBaseUrl + '/express_interest', 
      {
      'gig_id': gig._id,},
      {
        headers: {
        'user_id': appconfig.hardCodedUserId
        }
     }
    )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    setIsInterestPopupOpen(false);
    onShowInterest(gig);
  };

  isInterested = (engagementStatus === 'interested') ? true : false;

  const handleWithdrawInterest = () => {
    setIsWithdrawPopupOpen(true);
  };

  const handleWithdrawConfirm = () => {
    // TODO: with
    setIsWithdrawPopupOpen(false);
    onWithdrawInterest(gig);
    onNavigate("myJobs");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <Header
        activePage="jobs"
        onNavigate={onNavigate}
        onSearch={() => {}}
        onNotificationClick={() => {}}
      />

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
      >
        <main>
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* Gig Title Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                <ArrowLeft className="h-6 w-6 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-semibold text-gray-800">{gig.topic}</h1>
            </div>

            {/* Creator details */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src='/assets/manager.png'
                    alt="Manager Icon"
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-600"
                  />
                  <div className="text-left">
                    <p className="text-gray-600">Posted By: {gig.manager.name}</p>
                    <p className="text-gray-600">UID: {gig.manager._id}</p>
                    <p className="text-gray-600">Role: {gig.manager.role}</p>
                    <a
                      href={gig.teamsLink}
                      className="text-teal-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Teams link (click to chat)
                    </a>
                  </div>
                </div>
              </div>


            {/* Gig Task Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Description</h2>
              <p className="text-gray-700 text-lg whitespace-pre-line">{gig.title}</p>
            </div>

            {/* Interest Button */}
            <div className="text-right">
              {isInterested ? (
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition-all duration-300"
                  onClick={handleWithdrawInterest}
                >
                  Withdraw Interest
                </Button>
              ) : (
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md transition-all duration-300"
                  onClick={handleShowInterest}
                >
                  Show Interest
                </Button>
              )}
            </div>

            {/* Interest Confirmation Dialog */}
            <Dialog open={isInterestPopupOpen} onOpenChange={setIsInterestPopupOpen}>
              <DialogContent className="bg-gray-100 sm:max-w-[425px] flex flex-col items-center justify-center p-6">
                <DialogHeader>
                  <DialogTitle className="text-teal-600 text-2xl font-semibold">
                    Interest Confirmation
                  </DialogTitle>
                </DialogHeader>
                <div className="text-center space-y-4">
                  <p className="text-teal-600 font-semibold">
                    You have successfully shown interest in this gig!
                  </p>
                  <p className="text-gray-700 text-lg">
                    The manager has been notified, and your request is now pending
                    approval. You will be notified once the manager reviews and approves
                    your participation.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={handleInterestConfirm}
                  >
                    OK
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Withdraw Interest Confirmation Dialog */}
            <Dialog open={isWithdrawPopupOpen} onOpenChange={setIsWithdrawPopupOpen}>
              <DialogContent className="bg-gray-100 sm:max-w-[425px] flex flex-col items-center justify-center p-6">
                <DialogHeader>
                  <DialogTitle className="text-red-600 text-2xl font-semibold">
                    Withdraw Interest
                  </DialogTitle>
                </DialogHeader>
                <div className="text-center space-y-4">
                  <p className="text-gray-700 text-lg">
                    Are you sure you want to withdraw your interest in this gig?
                  </p>
                  <p className="text-gray-700 text-lg">
                    This action cannot be undone, and you'll need to show interest
                    again if you change your mind.
                  </p>
                </div>
                <DialogFooter className="flex justify-between w-full">
                  <Button
                    className="bg-gray-400 hover:bg-gray-500 text-white"
                    onClick={() => setIsWithdrawPopupOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleWithdrawConfirm}
                  >
                    Confirm Withdraw
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </motion.div>
    </div>

  );
}

GigDetailsPage.propTypes = {
  gig: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    postedBy: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    teamsLink: PropTypes.string.isRequired,
    fullDescription: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onShowInterest: PropTypes.func.isRequired,
  onWithdrawInterest: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  isInterested: PropTypes.bool.isRequired,
};
