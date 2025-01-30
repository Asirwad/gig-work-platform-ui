import React from "react";
import { Bell, UserCircle2 } from "lucide-react";
import { JobList } from "./JobList";

export function Header({ activePage, setActivePage }) {
  const handleNotification = () => {
    alert("Notification clicked!");
  };

  const handleLogout = () => {
    alert("Logging out...");
  };

  const toggleLogout = () => {
    alert("Toggling logout");
  };


  return (
    <header className="bg-white p-4 border-b-2 border-gray-200">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4">
        {/* Left Section with Logo and Search */}
        <div className="flex items-center gap-4">
          <a href="/" className="text-lg font-semibold text-teal-600 uppercase">
            GIG WORKS
          </a>
          <input
            type="text"
            placeholder="Search Jobs..."
            className={`py-2 px-4 text-sm border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 ${activePage === 'addJobs' && 'hidden'}`}
            
          />
        </div>

        {/* Right Section with Navigation, Notification, and Profile */}
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActivePage("addJobs")}
              className={`py-2 px-4 text-sm rounded border mr-0 ${
                activePage === "addJobs"
                  ? "bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                  : "bg-gray-100 text-teal-600 border-gray-200"
              } transition-all duration-300`}
            >
              Add Jobs
            </button>
            <button
              onClick={() => setActivePage("postedJobs")}
              className={`py-2 px-4 text-sm rounded border ml-0 ${
                activePage === "postedJobs"
                  ? "bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                  : "bg-gray-100 text-teal-600 border-gray-200"
              } transition-all duration-300`}
            >
              My Posted Jobs
            </button>
          </div>

          <div className="relative flex items-center gap-4">
            {/* Bell Icon (Notification) */}
            <Bell
              onClick={handleNotification}
              className="text-teal-600 text-xl cursor-pointer hover:text-teal-700 transition-colors"
            />
            {/* Profile and Logout */}
            <UserCircle2
              onClick={toggleLogout}
              className="text-teal-600 text-2xl cursor-pointer hover:text-teal-700 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* If the logout menu is active, show it */}
      {/* You can add your logout component or modal here */}

      {/* Content Rendering Based on Active Page */}
      {activePage === "addJobs" && (
        <div> {/* Your AddJobs Component goes here */} </div>
      )}
      {activePage === "postedJobs" && (
        <div> {/* Your PostedJobs Component goes here */} </div>
      )}
    </header>
  );
}
