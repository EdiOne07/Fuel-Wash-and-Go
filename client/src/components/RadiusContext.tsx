import React, { createContext, useState, useContext } from "react";

interface RadiusContextType {
  radius: number;
  setRadius: (value: number) => void;
}

const RadiusContext = createContext<RadiusContextType | undefined>(undefined);

export const RadiusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [radius, setRadius] = useState<number>(10); // Default radius value
  return (
    <RadiusContext.Provider value={{ radius, setRadius }}>
      {children}
    </RadiusContext.Provider>
  );
};

export const useRadius = (): RadiusContextType => {
  const context = useContext(RadiusContext);
  if (!context) {
    throw new Error("useRadius must be used within a RadiusProvider");
  }
  return context;
};
 