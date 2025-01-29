import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Star, Bell, Search, UserCircle2 } from "lucide-react";
import axios from "axios";
import appConfig from "../../AppConfig.json";
import { getUStarPoint } from "../../lib/utils";
import { motion } from "framer-motion";
import UStarTooltip from "../../utils/UStarTooltip/UStarTooltip";

export function GigListingPage({
  onViewGig,
  onNavigate,
  onNotificationClick,
  notifications,
  activePage
}) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user_id = appConfig.hardCodedUserId;

  const handleViewClick = (gig) => {
    setSelectedGig(gig);
    setIsDisclaimerOpen(true);
  };

  const handleDisclaimerClose = () => {
    setIsDisclaimerOpen(false);
    setSelectedGig(null);
  };

  const handleDisclaimerAccept = () => {
    setIsDisclaimerOpen(false);
    if (selectedGig) {
      onViewGig(selectedGig);
    }
  };

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(appConfig.apiBaseUrl + "/gigs", {
          headers: {
            "user_id": user_id
          }
        });
        //console.log(response.data);
        setGigs(response.data.gigs.filter((gig)=> gig.status !== 'revoked' && gig.status !== 'awaiting_admin_approval'));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
    setFilteredGigs(gigs);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = gigs.filter(
      (gig) =>
        gig.title.toLowerCase().includes(term.toLowerCase()) ||
        gig.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGigs(filtered);
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return <div className="text-center mt-6">Loading gigs...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
          <a href="/" className="text-lg font-semibold text-teal-600 uppercase">
            GIG WORKS
          </a>
          <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search gigs..."
                className="pl-10 pr-4 w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
          </div>            
          </div>
          <div className="flex items-center space-x-4">
              <button
                  className={`py-2 px-4 text-sm rounded border mr-0  bg-teal-600 text-white border-teal-600 hover:bg-teal-700 transition-all duration-300`}
                  onClick={() => onNavigate("jobs")}
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
                <div className="relative flex items-center gap-4">
                  <Bell 
                    onClick={onNotificationClick}
                    className="text-teal-600 text-xl cursor-pointer hover:text-teal-700 transition-colors"
                  />
                  <UserCircle2
                    onClick={() => alert("Toggling logout")}
                    className="text-teal-600 text-2xl cursor-pointer hover:text-teal-700 transition-colors"
                  />
                    </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        { gigs.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[81vh] bg-gray-100 p-6 rounded-lg shadow-lg">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center"
            >
              <img
                src="/assets/empty_box.png"
                alt="No Gigs Selected"
                className="w-32 h-32 mb-4 animate-pulse"
              />
              <h2 className="text-3xl font-semibold text-teal-600 mb-4">No gigs available</h2>
              <p className="text-gray-700 text-lg mb-6 text-center">
                There are currently no gigs available. Please check back later.
              </p>
            </motion.div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig, index) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0 ,
                transition: { duration: 0.5, delay: 0.1 * index }
              }}
              whileTap={{ 
                scale: 0.95, 
                transition: { duration: 0.5 }
              }}
            >
                <Card key={gig.id} className="bg-white flex flex-col h-full shadow-md transition duration-300 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">
                    {highlightText(gig.topic, searchTerm)}
                  </CardTitle>
                  <button
                      class="text-white bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-sm shadow-teal-500/50 dark:shadow-sm dark:shadow-teal-800/80 font-medium rounded-md text-xs mr-0 p-1 hover:translate-y-1 transition duration-300"
                      type="button"
                    >
                      {gig.ustar_category}
                  </button>
                  
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {highlightText(gig.description, searchTerm)}
                    </p>
                  </div>
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 mt-auto text-white"
                    onClick={() => handleViewClick(gig)}
                  >
                    View
                    <span className="ml-2">→</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
          ))}
        </div>
      </main>
      <Dialog open={isDisclaimerOpen} onOpenChange={setIsDisclaimerOpen}>
        <DialogContent className="bg-gray-100 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-teal-600 text-xl">
              Disclaimer
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-700 text-center">
            By engaging in any work opportunities through this portal, you
            acknowledge and agree that your participation is entirely voluntary
            and will not interfere with your regular duties or obligations at
            your current place of employment. It is your sole responsibility to
            ensure that your involvement in these projects does not conflict
            with any employment agreements, company policies, or contractual
            obligations. The portal and its administrators assume no
            responsibility for any consequences arising from your work
            commitments outside of your primary job.
          </DialogDescription>
          <DialogFooter>
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleDisclaimerAccept}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

GigListingPage.propTypes = {
  gigs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onViewGig: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onNotificationClick: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
};
