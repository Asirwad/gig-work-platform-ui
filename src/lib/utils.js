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