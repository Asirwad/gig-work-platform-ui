import React, { useState } from "react";
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

  isInterested = gig.status === 'interested' || 'Open'? true : false;
  console.log(gig.status)

  const handleWithdrawInterest = () => {
    setIsWithdrawPopupOpen(true);
  };

  const handleWithdrawConfirm = () => {
    setIsWithdrawPopupOpen(false);
    onWithdrawInterest(gig);
    onNavigate("myJobs");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        activePage="jobs"
        onNavigate={onNavigate}
        onSearch={() => {}}
        onNotificationClick={() => {}}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={onBack} className="text-gray-600">
              <ArrowLeft className="h-6 w-6 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">GIG</h1>
            <div className="text-right">
              <p>Posted By: {gig.postedBy}Kilas Natty</p>
              <p>UID: {gig.uid} 285571</p>
              <p>Role: {gig.role} Software Architect</p>
              <a href={gig.teamsLink} className="text-blue-500 hover:underline hover:cursor-pointer">
                Teams link (click this link to chat with the Job Owner)
              </a>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Task: {gig.title}</h2>
            <p className="whitespace-pre-line">{gig.fullDescription}</p>
          </div>
          <div className="text-right">
            {isInterested ? (
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleWithdrawInterest}
              >
                Withdraw Interest
              </Button>
            ) : (
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={handleShowInterest}
              >
                Show Interest
              </Button>
            )}
          </div>
          <Dialog
            open={isInterestPopupOpen}
            onOpenChange={setIsInterestPopupOpen}
          >
            <DialogContent className="bg-gray-100 sm:max-w-[425px] flex flex-col items-center justify-center">
              <DialogHeader>
                <DialogTitle className="text-teal-600 text-xl">
                  Interest Confirmation
                </DialogTitle>
              </DialogHeader>
              <div className="text-center">
                <p className="text-teal-600 font-semibold mb-2">
                  You have successfully shown interest in this gig!
                </p>
                <p className="text-gray-700">
                  The manager has been notified, and your request is now pending
                  for approval. You will be notified once the manager reviews
                  and approves your participation.
                </p>
              </div>
              <DialogFooter>
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  onClick={handleInterestConfirm}
                >
                  OK
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog
            open={isWithdrawPopupOpen}
            onOpenChange={setIsWithdrawPopupOpen}
          >
            <DialogContent className="bg-gray-100 sm:max-w-[425px] flex flex-col items-center justify-center">
              <DialogHeader>
                <DialogTitle className="text-red-600 text-xl">
                  Withdraw Interest
                </DialogTitle>
              </DialogHeader>
              <div className="text-center">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to withdraw your interest in this gig?
                </p>
                <p className="text-gray-700">
                  This action cannot be undone, and you'll need to show interest
                  again if you change your mind.
                </p>
              </div>
              <DialogFooter className="flex justify-between w-full">
                <Button
                  className="bg-gray-400 hover:bg-gray-500"
                  onClick={() => setIsWithdrawPopupOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleWithdrawConfirm}
                >
                  Confirm Withdraw
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
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
