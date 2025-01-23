import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Header } from "./Header";
import appConfig from "../../AppConfig.json";
import { getUStarPoint } from "../../lib/utils"
import axios from "axios";
import { motion } from "framer-motion";


export function MyJobsPage({ onViewGig, onNavigate }) {

  const [interestedGigs, setinterestedGigs] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user_id = appConfig.hardCodedUserId;

  useEffect(() => {
    const fetchInterestedGigs = async (gig_id) => {
      try {
        setLoading(true);
        const response = await axios.get(appConfig.apiBaseUrl + '/intrested_gigs', {
          headers: {
            "user_id": user_id
          }
        });
        console.log(response.data);
        setinterestedGigs(response.data.gigs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    fetchInterestedGigs();
  }, []);

  useEffect(()=>{
    setinterestedGigs(interestedGigs.filter((gig) => gig.status !== 'revoked'));
  }, [interestedGigs])


  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        activePage="myJobs"
        onNavigate={onNavigate}
        onSearch={() => { }}
        onNotificationClick={() => { }}
      />
      <main className="container mx-auto px-4 py-8">
        {interestedGigs.length === 0 ? (
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
              <h2 className="text-3xl font-semibold text-teal-600 mb-4">No Gigs Selected</h2>
              <p className="text-gray-700 text-lg mb-6 text-center">
                You haven't shown interest in any gigs yet. Explore and find exciting opportunities!
              </p>
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full shadow-md transform transition-all duration-200 hover:scale-105"
                onClick={() => onNavigate("jobs")}
              >
                Browse Available Gigs
              </Button>
            </motion.div>
          </div>


        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interestedGigs.length>0 && interestedGigs.map((gig) => (
              <Card key={gig._id} className="bg-white flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle badge={gig.gig_engagement_status} className="text-xl font-bold">
                    {gig.topic}
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
                      {gig.description}
                    </p>
                  </div>
                  <Button
                    className={`w-full bg-teal-600 hover:bg-teal-700 mt-auto text-white`}
                    onClick={() => onViewGig(gig)}
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

MyJobsPage.propTypes = {
  interestedGigs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["pending", "approved"]),
    })
  ).isRequired,
  onViewGig: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
