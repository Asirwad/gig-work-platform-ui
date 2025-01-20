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
import { Star, Bell, Search } from "lucide-react";
import axios from "axios";
import appConfig from "../../AppConfig.json";
import { getUStarPoint } from "../../lib/utils";

export function GigListingPage({
  onViewGig,
  onNavigate,
  onNotificationClick,
  notifications,
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span
              className="text-xl font-semibold cursor-pointer text-blue-500"
              onClick={() => onNavigate("jobs")}
            >
              Jobs
            </span>
            <span
              className="text-xl font-semibold cursor-pointer text-gray-700"
              onClick={() => onNavigate("myJobs")}
            >
              My Jobs
            </span>
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
      
      <main className="container mx-auto px-4 py-8">
        { gigs.length === 0 && (
          <div className="text-center mt-6 text-2xl text-teal-600 font-semibold ">No gigs available.</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <Card key={gig.id} className="bg-white flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle badge={gig.status} className="text-xl font-bold">
                  {highlightText(gig.topic, searchTerm)}
                </CardTitle>
                <Button variant="ghost" size="icon" className="text-yellow-500">
                  <Star className="h-4 w-4" />
                  <span className="ml-1">{getUStarPoint.get(gig.ustar_category)}</span>
                </Button>
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
