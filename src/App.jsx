import React, { useState } from "react";
import { GigListingPage } from "./components/GigListingPage";
import { GigDetailsPage } from "./components/GigDetailsPage";
import { MyJobsPage } from "./components/MyJobsPage";

import "./index.css";

const gigs = [
  {
    id: "1",
    title: "GIG 1",
    description:
      "Create a console-based Task Management Application that allows users to manage their tasks efficiently. The application should support creating, updating, deleting, and viewing tasks. Each task will have attributes such as title, description, due date, and priority.",
    postedBy: "XYZ",
    uid: "xxxxx",
    role: "XYZ",
    teamsLink: "https://teams.microsoft.com/l/chat/",
    fullDescription: `
      Task: Implement a Java Program to Sort a List of Custom Objects using Comparator.
      Description:
      Your task is to implement a program that sorts a list of custom objects (e.g.,
      Employee) based on multiple criteria using the Comparator interface.
      Requirements:
      1. Create a class Employee with the following attributes:
         • id (Integer)
         • name (String)
         • age (Integer)
         • salary (Double)
      2. Implement a constructor to initialize these fields and provide getter methods for
         each attribute.
      3. Override the toString() method in the Employee class to return the Employee
         details in a readable format.
      4. Sort the list of employees based on:
         • First, by age in ascending order.
         • If two employees have the same age, then by salary in descending order.
      5. Implement a Comparator class that encapsulates this sorting logic.
      6. In your main method:
         • Create a list of Employee objects.
         • Sort the list using your comparator and print the sorted list.
    `,
  },
  {
    id: "2",
    title: "GIG 2",
    description:
      "Create a console-based Task Management Application that allows users to manage their tasks efficiently. The application should support creating, updating, deleting, and viewing tasks. Each task will have attributes such as title, description, due date, and priority.",
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

export default function App() {
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
    <div className="app-container">
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
