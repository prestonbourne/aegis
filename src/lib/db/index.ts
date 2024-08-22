"use server";
import { DB } from "./constructor";
import { DEFAULT_DATA_CONFIG } from "../constants";
import { DataConfig } from "./types";
import { revalidatePath } from "next/cache";
import { updateRiskServiceAction } from "../risk";

let db = new DB(DEFAULT_DATA_CONFIG);
export const getDB = async () => {
  if (typeof window !== "undefined"){
    throw new Error("getDB must be used server-side");
  }

  return db;
};

export const updateDBAction = (newConfig: Partial<DataConfig>) => {
  "use server";
  db = new DB({ ...db.config, ...newConfig });
  updateRiskServiceAction(db.config.riskThresholds);
  revalidatePath("/");
};
