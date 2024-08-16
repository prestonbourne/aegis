"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { DataConfig, Prompt, User } from "./data/types";
import { DEFAULT_CONFIG } from "./data";
import { generateData } from "./data/generate-data";

type MockDataContextValue = {
  config: DataConfig;
  setDataConfig: (value: React.SetStateAction<DataConfig>) => void;
  users: User[];
  prompts: Prompt[];
};

// Create the context
const MockDataContext = createContext<MockDataContextValue | null>(null);

// Create a custom hook to access the context
export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
};

type AppContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [dataConfig, setDataConfig] = useState<DataConfig>(DEFAULT_CONFIG);

  /* 
   weird ssr issue where i cant generate data on the server, and use the same data on the client without re-generating
   so i wrap the data generation in a useEffect to only run on the client
   */
  const [users, setUsers] = React.useState<User[]>([]);
  const [prompts, setPrompts] = React.useState<Prompt[]>([]);
  useEffect(() => {
    const { users, prompts } = generateData(dataConfig);
    setUsers(users);
    setPrompts(prompts);
  }, [dataConfig]);

  return (
    <MockDataContext.Provider
      value={{
        config: dataConfig,
        setDataConfig,
        users,
        prompts,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
};
