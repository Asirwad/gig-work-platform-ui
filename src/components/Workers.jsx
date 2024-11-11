import React, { useState } from "react";
import { GigListingPage } from "./worker/GigListingPage";
import { GigDetailsPage } from "./worker/GigDetailsPage";
import { MyJobsPage } from "./worker/MyJobsPage";

const gigs = [
  {
    id: "1",
    title: "GIG 1",
    description:
      "Create a console-based Task Management Application that allows users to manage their tasks efficiently.",
    postedBy: "XYZ",
    uid: "xxxxx",
    role: "XYZ",
    teamsLink: "https://teams.microsoft.com/l/chat/",
    fullDescription: "Full description for GIG 1...",
  },
  {
    id: "2",
    title: "GIG 2",
    description: "Create a console-based Task Management Application.",
    postedBy: "ABC",
    uid: "yyyyy",
    role: "Backend Developer",
    teamsLink: "https://teams.microsoft.com/l/chat/",
    fullDescription: "Full description for GIG 2...",
  },
  {
    id: "3",
    title: "GIG 3",
    description: "Develop a React Native mobile app.",
    postedBy: "DEF",
    uid: "zzzzz",
    role: "Mobile Developer",
    teamsLink: "https://teams.microsoft.com/l/chat/",
    fullDescription: "Full description for GIG 3...",
  },
];

export default function Workers() {
  const [currentPage, setCurrentPage] = useState("jobs");
  const [currentGig, setCurrentGig] = useState(null);
  const [interestedGigs, setInterestedGigs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleViewGig = (gig) => {
    setCurrentGig(gig);
    setCurrentPage("gigDetails");
  };

  const handleBackToListing = () => {
    setCurrentGig(null);
    setCurrentPage("jobs");
  };

  const handleShowInterest = (gig) => {
    const updatedGig = { ...gig, status: "pending" };
    setInterestedGigs([...interestedGigs, updatedGig]);
    addNotification(`You have shown interest in ${gig.title}`);
    setCurrentPage("myJobs");
  };

  const handleWithdrawInterest = (gig) => {
    setInterestedGigs(interestedGigs.filter((g) => g.id !== gig.id));
    addNotification(`You have withdrawn interest from ${gig.title}`);
    setCurrentPage("myJobs");
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setCurrentGig(null);
  };

  const addNotification = (message) => {
    setNotifications([...notifications, { id: Date.now(), message }]);
  };

  const handleNotificationClick = () => {
    alert(
      `You have ${notifications.length} notifications:\n\n${notifications
        .map((n) => n.message)
        .join("\n")}`
    );
  };

  const isInterestedInGig = (gig) => {
    return interestedGigs.some((g) => g.id === gig.id);
  };

  return (
    <div>
      {currentPage === "gigDetails" && currentGig ? (
        <GigDetailsPage
          gig={currentGig}
          onBack={handleBackToListing}
          onShowInterest={handleShowInterest}
          onWithdrawInterest={handleWithdrawInterest}
          onNavigate={handleNavigate}
          isInterested={isInterestedInGig(currentGig)}
        />
      ) : currentPage === "myJobs" ? (
        <MyJobsPage
          interestedGigs={interestedGigs}
          onViewGig={handleViewGig}
          onNavigate={handleNavigate}
        />
      ) : (
        <GigListingPage
          gigs={gigs}
          onViewGig={handleViewGig}
          onNavigate={handleNavigate}
          onNotificationClick={handleNotificationClick}
          notifications={notifications}
        />
      )}
    </div>
  );
}
