import { Star } from "lucide-react";
import React from "react";

const UStarTooltip = ({ trigger, content }) => {
  return (
    <div className="relative flex justify-center items-center">
      <button
        className="group relative flex items-center px-2 py-1 rounded-md bg-yellow-400 text-white font-medium shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none"
      >
        <Star className="h-4 w-4" />
        <span className="text-xs ml-1">{trigger}</span>

        {/* Tooltip */}
        <span
          className="absolute left-1/2 bottom-[110%] transform -translate-x-1/2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gradient-to-r bg-yellow-500/90 text-[10px] font-normal py-1 px-2 rounded shadow-lg"
        >
          {content}
        </span>
      </button>
    </div>
  );
};

export default UStarTooltip;
