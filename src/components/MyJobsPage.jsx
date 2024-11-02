import React from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Header } from "./Header";

export function MyJobsPage({ interestedGigs, onViewGig, onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        activePage="myJobs"
        onNavigate={onNavigate}
        onSearch={() => {}}
        onNotificationClick={() => {}}
      />
      <main className="container mx-auto px-4 py-8">
        {interestedGigs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">No Gigs Selected</h2>
            <p className="text-gray-600 mb-6">
              You haven't shown interest in any gigs yet.
            </p>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => onNavigate("jobs")}
            >
              Browse Available Gigs
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interestedGigs.map((gig) => (
              <Card key={gig.id} className="bg-white flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">
                    {gig.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-yellow-500"
                  >
                    <Star className="h-4 w-4" />
                    <span className="sr-only">Star</span>
                  </Button>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {gig.description}
                    </p>
                    <p className="text-sm font-semibold mb-2">
                      {gig.status === "approved"
                        ? "Approved"
                        : "Yet to Approve"}
                    </p>
                  </div>
                  <Button
                    className={`w-full ${
                      gig.status === "approved"
                        ? "bg-teal-600 hover:bg-teal-700"
                        : "bg-gray-400"
                    } mt-auto`}
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
