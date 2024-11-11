import React from "react";
import { Bell } from "lucide-react";

export function Header({ activePage, setActivePage }) {
  return (
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
                activePage === "postedJobs" ? "text-blue-600" : "text-gray-600"
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
  );
}
