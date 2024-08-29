import { StatsCard } from "@/components/stats-card";
import { getDB } from "@/lib/db";
import {
  getPromptPercentageChangeByMonth,
  mapPromptsByMonth,
} from "@/lib/analytics";
import { getRiskService } from "@/lib/risk";

export const PromptsCards = async () => {
  const db = await getDB();

  const riskService = await getRiskService();
  const { flagged, blocked, safe, riskMetrics } =
    riskService.assessAndFilterPrompts(db.prompts);
  db.addRisMetricsSet(riskMetrics);

  // 1st Card Stats
  const currentMonth = new Date().getMonth();
  const totalPrompts = db.prompts.length;
  const promptsByMonth = mapPromptsByMonth(db.prompts);
  const totalPercentDiff =
    getPromptPercentageChangeByMonth(promptsByMonth)[currentMonth] ?? 0;

  // 2nd Card Stats
  const safePrompts = safe
    .map((rm) => db.getPromptById(rm.id))
    .filter((p) => p !== undefined);
  const safeByMonth = mapPromptsByMonth(safePrompts);
  const safePercentDiff =
    getPromptPercentageChangeByMonth(safeByMonth)[currentMonth] ?? 0;

  // 3rd Card Stats
  const flaggedPrompts = flagged
    .map((rm) => db.getPromptById(rm.id))
    .filter((p) => p !== undefined);
  const flaggedByMonth = mapPromptsByMonth(flaggedPrompts);
  const flaggedPercentDiff =
    getPromptPercentageChangeByMonth(flaggedByMonth)[currentMonth] ?? 0;

  // 4th Card Stats
  const blockedPrompts = blocked
    .map((rm) => db.getPromptById(rm.id))
    .filter((p) => p !== undefined);
  const blockedByMonth = mapPromptsByMonth(blockedPrompts);
  const blockedPercentDiff =
    getPromptPercentageChangeByMonth(blockedByMonth)[currentMonth] ?? 0;

  return (
    <>
      <StatsCard
        title="Total Prompts"
        value={totalPrompts.toLocaleString()}
        change={makeChangeString(totalPercentDiff)}
      />
      <StatsCard
        title="Safe Prompts"
        value={safe.length.toLocaleString()}
        change={makeChangeString(safePercentDiff)}
      />
      <StatsCard
        title="Flagged Prompts"
        value={flagged.length.toLocaleString()}
        change={makeChangeString(flaggedPercentDiff)}
      />
      <StatsCard
        title="Blocked Prompts"
        value={blocked.length.toLocaleString()}
        change={makeChangeString(blockedPercentDiff)}
      />
    </>
  );
};

const makeChangeString = (
  percentDiff: number
): `${string}% from last month` => {
  const prefix = percentDiff > 0 ? "+" : "";
  return `${prefix}${percentDiff.toFixed(2)}% from last month`;
};
