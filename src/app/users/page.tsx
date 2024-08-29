import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { UserStatsCards } from "./components/cards";
import { UserDataTable } from "./components/table";
import { getDB } from "@/lib/db";
import { getRiskService } from "@/lib/risk";
import { DownloadButton } from "@/components/download-button";
import { UsersAreaChart } from "./components/area-chart";

export const metadata: Metadata = {
  title: "Aegis Dashboard | Users",
  description: "LLM Safety and Analytics Dashboard",
};

// const safePrompts = safe
// .map((rm) => db.getPromptById(rm.id))
// .filter((p) => p !== undefined);
// const safeByMonth = mapPromptsByMonth(safePrompts);
// const safePercentDiff =
// getPromptPercentageChangeByMonth(safeByMonth)[currentMonth] ?? 0;

export default async function UsersPage() {
  const db = await getDB();
  const users = db.users;
  const userPrompts = users.map((user) => db.getPromptsByUserId(user.id));

  const riskService = await getRiskService();
  const { riskMetrics, blocked, flagged, safe } =
    riskService.assessAndFilterUsers(db.users, userPrompts);

  const flaggedUsers = flagged
    .map((rm) => db.getUserById(rm.id))
    .filter((user) => user !== undefined);

  const safeUsers = safe
    .map((rm) => db.getUserById(rm.id))
    .filter((user) => user !== undefined);

  const blockedUsers = blocked
    .map((rm) => db.getUserById(rm.id))
    .filter((user) => user !== undefined);
  
  

  db.addRisMetricsSet(riskMetrics);
  const usersWithRisk = db.getUsersWithRiskMetrics();

  return (
    <div className="flex-col md:flex max-w-screen-xl mx-auto">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <DownloadButton toDownload={usersWithRisk} filename="users">
              Download
            </DownloadButton>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
            <UserStatsCards users={usersWithRisk} blocked={blockedUsers} flagged={flaggedUsers} safe={safeUsers} />
          </div>
          <TabsContent value="overview" className="space-y-4">
            <UserDataTable users={usersWithRisk} />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <UsersAreaChart users={usersWithRisk} blocked={blockedUsers} flagged={flaggedUsers} safe={safeUsers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
