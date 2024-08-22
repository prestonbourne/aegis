import { StatsCard } from "@/components/stats-card";
import { getDB } from "@/lib/db";
import {
  getUserPercentageChangeByMonth,
  mapUsersByMonth,
} from "@/lib/analytics";
import { getRiskService } from "@/lib/risk";

export const UserStatsCards = async () => {
  const db = await getDB();
  const { users } = db;

  const riskService = await getRiskService();
  const { flagged, blocked, safe, riskMetrics } =
    riskService.assessAndFilterPrompts(db.prompts);
  db.addRisMetricsSet(riskMetrics);

  // 1st Card Stats
  const currentMonth = new Date().getMonth();
  const totalPrompts = db.prompts.length;
  const usersByMonth = mapUsersByMonth(db.users);
  const totalPercentDiff =
    getUserPercentageChangeByMonth(usersByMonth)[currentMonth] ?? 0;

  // // 2nd Card Stats
  // const safePrompts = safe
  //   .map((rm) => db.getPromptById(rm.id))
  //   .filter((p) => p !== undefined);
  // const safeByMonth = mapPromptsByMonth(safePrompts);
  // const safePercentDiff =
  //   getPromptPercentageChangeByMonth(safeByMonth)[currentMonth] ?? 0;

  // // 3rd Card Stats
  // const flaggedPrompts = flagged
  //   .map((rm) => db.getPromptById(rm.id))
  //   .filter((p) => p !== undefined);
  // const flaggedByMonth = mapPromptsByMonth(flaggedPrompts);
  // const flaggedPercentDiff =
  //   getPromptPercentageChangeByMonth(flaggedByMonth)[currentMonth] ?? 0;

  // // 4th Card Stats
  // const blockedPrompts = blocked
  //   .map((rm) => db.getPromptById(rm.id))
  //   .filter((p) => p !== undefined);
  // const blockedByMonth = mapPromptsByMonth(blockedPrompts);
  // const blockedPercentDiff =
  //   getPromptPercentageChangeByMonth(blockedByMonth)[currentMonth] ?? 0;

  return (
    <>
      <StatsCard
        title="Total Prompts"
        value={users.length.toLocaleString()}
        change={makeChangeString(totalPercentDiff)}
      />
      <StatsCard
        title="Total Prompts"
        value={users.length.toLocaleString()}
        change={makeChangeString(totalPercentDiff)}
      />
      <StatsCard
        title="Total Prompts"
        value={users.length.toLocaleString()}
        change={makeChangeString(totalPercentDiff)}
      />
      <StatsCard
        title="Total Prompts"
        value={users.length.toLocaleString()}
        change={makeChangeString(totalPercentDiff)}
      />
      {/* <StatsCard
        title="Total Prompts"
        value={total.toLocaleString()}
        change={makeChangeString(percentDiff)}
      />
      <StatsCard
        title="Flagged Prompts"
        value={thisMonthsFlagged.length.toLocaleString()}
        change={makeChangeString(flaggedPercentDiff)}
      />
      <StatsCard
        title="Blocked Prompts"
        value={high.length.toLocaleString()}
        change={makeChangeString(blockedPercentDiff)}
      /> */}
    </>
  );
};

const makeChangeString = (
  percentDiff: number
): `${string}% from last month` => {
  const prefix = percentDiff > 0 ? "+" : "";
  return `${prefix}${percentDiff.toFixed(2)}% from last month`;
};
