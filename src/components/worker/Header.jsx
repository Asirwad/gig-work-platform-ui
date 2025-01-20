import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search, UserCircle2 } from "lucide-react";

export function Header({
  activePage,
  onNavigate,
  onSearch,
  onNotificationClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <header className="bg-white p-4 border-b-2 border-gray-200">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4">
        {/* Left Section with Logo and Search */}
        <div className="flex items-center gap-4">
          <a href="/" className="text-lg font-semibold text-teal-600 uppercase">
            GIG WORKS
          </a>
          {activePage === "jobs" && (
            <div className="relative">
              <Menu className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search gigs..."
                className="py-2 pl-10 pr-4 text-sm border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          )}
        </div>

        {/* Right Section with Navigation, Notification, and Profile */}
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate("jobs")}
              className={`py-2 px-4 text-sm rounded border mr-0 ${
                activePage === "jobs"
                  ? "bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                  : "bg-gray-100 text-teal-600 border-gray-200"
              } transition-all duration-300`}
            >
              Jobs
            </button>
            <button
              onClick={() => onNavigate("myJobs")}
              className={`py-2 px-4 text-sm rounded border ml-0 ${
                activePage === "myJobs"
                  ? "bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                  : "bg-gray-100 text-teal-600 border-gray-200"
              } transition-all duration-300`}
            >
              My Jobs
            </button>
          </div>

          <div className="relative flex items-center gap-4">
            {/* Bell Icon (Notification) */}
            <Bell
              onClick={onNotificationClick}
              className="text-teal-600 text-xl cursor-pointer hover:text-teal-700 transition-colors"
            />
            {/* Profile and Logout */}
            <UserCircle2
              onClick={() => alert("Toggling logout")}
              className="text-teal-600 text-2xl cursor-pointer hover:text-teal-700 transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  activePage: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onNotificationClick: PropTypes.func.isRequired,
};
