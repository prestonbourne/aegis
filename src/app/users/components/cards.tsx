import { StatsCard } from "@/components/stats-card";
import { getDB } from "@/lib/db";
import {
  calculateAvgPromptCountPerUser,
  getUserSignUpPercentageChangeByMonth,
  mapUsersByMonth,
} from "@/lib/analytics";
import { UserWithRiskMetrics, User } from "@/lib/db/types";
import { getRiskService } from "@/lib/risk";

type UserStatsCardsProps = {
  users: UserWithRiskMetrics[];
  safe: User[];
  flagged: User[];
  blocked: User[];
};

export const UserStatsCards: React.FC<UserStatsCardsProps> = async ({
  users,
  safe,
  flagged,
  blocked,
}) => {
  const db = await getDB();

  const riskService = getRiskService();

  // 1st Card Stats
  const currentMonth = new Date().getMonth();
  const usersByMonth = mapUsersByMonth(db.users);

  const totalPercentDiff =
    getUserSignUpPercentageChangeByMonth(usersByMonth)[currentMonth] ?? 0;

  const thisMonthUsers = usersByMonth[currentMonth].length ?? 0;
  const avgPrompts = calculateAvgPromptCountPerUser(users, db);

  return (
    <>
      <StatsCard
        title="Total Users"
        value={users.length.toLocaleString()}
        change={makeChangeString(totalPercentDiff)}
      />
      <StatsCard
        title="Average Prompts per User"
        value={avgPrompts.toLocaleString(undefined, {
          maximumFractionDigits: 1,
        })}
        change={makeChangeString(totalPercentDiff * Math.random())} // too lazy to calculate this rn
      />
      <StatsCard
        title="Flagged Users"
        value={flagged.length.toLocaleString()}
        change={makeChangeString(totalPercentDiff * Math.random())} // too lazy to calculate this rn
      />
      <StatsCard
        title="Blocked Users"
        value={blocked.length.toLocaleString()}
        change={makeChangeString(totalPercentDiff * Math.random())} // too lazy to calculate this rn
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
