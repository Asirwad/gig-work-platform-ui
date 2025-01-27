import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const  getUStarPoint = new Map();
getUStarPoint.set("RisingStar", "1");
getUStarPoint.set("ShiningStar", "2");
getUStarPoint.set("SuperStar", "3");
getUStarPoint.set("NovaStar", "4");


export const getUStarName = new Map();
getUStarName.set("1", "RisingStar");
getUStarName.set("2", "ShiningStar");
getUStarName.set("3", "SuperStar");
getUStarName.set("4", "NovaStar");


export const getGigStatusBadgeColor = (status) => {
  switch (status) {
    case 'awaiting_admin_approval':
      return 'text-blue-700 bg-blue-50 ring-blue-700/20';
    case 'revoked':
      return 'text-red-700 bg-red-50 ring-red-700/20';
    case 'approved':
      return 'text-green-700 bg-green-50 ring-green-700/20';
    case 'paused':
      return 'text-yellow-700 bg-yellow-50 ring-yellow-700/20';
    default:
      return 'text-gray-700 bg-gray-50 ring-gray-700/20';
  }
};