import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";

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
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span
            className={`text-xl font-semibold cursor-pointer ${
              activePage === "jobs" ? "text-blue-500" : "text-gray-700"
            }`}
            onClick={() => onNavigate("jobs")}
          >
            Jobs
          </span>
          <span
            className={`text-xl font-semibold cursor-pointer ${
              activePage === "myJobs" ? "text-blue-500" : "text-gray-700"
            }`}
            onClick={() => onNavigate("myJobs")}
          >
            My Jobs
          </span>
          {activePage === "jobs" && (
            <div className="relative">
              <Menu className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search gigs..."
                className="pl-10 pr-10 w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Bell
            className="text-gray-600 cursor-pointer"
            onClick={onNotificationClick}
          />
          <div className="flex items-center space-x-2">
            <span>My profile</span>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white">
              AB
            </div>
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
