import { useContext } from "react";
import { ChaletContext } from "./chalet-context";

// Custom hook for using Chalet Context
export const useChaletContext = () => {
  const context = useContext(ChaletContext);
  if (context === undefined) {
    throw new Error("useChaletContext must be used within a ChaletProvider");
  }
  return context;
};
