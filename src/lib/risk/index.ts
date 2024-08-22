"use server"
import { RiskService } from "./constructor"
import { DEFAULT_DATA_CONFIG } from "../constants";
import { RiskThresholds } from "./types";

let riskService = new RiskService(DEFAULT_DATA_CONFIG.riskThresholds);

export const getRiskService = async () => {
  if (typeof window !== "undefined"){
    throw new Error("getRiskService must be used server-side");
  }

  return riskService;
};

export const updateRiskServiceAction = (newConfig: RiskThresholds) => {
  riskService = new RiskService(newConfig);
};