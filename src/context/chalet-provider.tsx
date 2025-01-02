import { ReactNode, useState } from "react";
import { ChaletListingData } from "./chalet-context-types";
import { ChaletContext, initialChaletData } from "./chalet-context";

export const ChaletProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [chaletData, setChaletData] =
      useState<Partial<ChaletListingData>>(initialChaletData);
  
    const updateChaletData = <K extends keyof ChaletListingData>(
      key: K,
      value: ChaletListingData[K]
    ) => {
      setChaletData((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
  
    const resetChaletData = () => {
      setChaletData(initialChaletData);
    };
  
    return (
      <ChaletContext.Provider
        value={{
          chaletData,
          updateChaletData,
          resetChaletData,
        }}
      >
        {children}
      </ChaletContext.Provider>
    );
  };
  