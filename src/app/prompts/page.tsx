import { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { RecentPrompts } from "./recent-prompts";
import { StatsCard } from "@/components/stats-card";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function PromptsPage() {
  return (
    <div className="flex-col md:flex max-w-screen-xl mx-auto">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Prompts</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Prompts"
                value="12,041"
                change="+16.09 from last month"
              />
              <StatsCard
                title="Flagged Prompts"
                value="12,041"
                change="+16.09 from last month"
              />
              <StatsCard
                title="Blocked Prompts"
                value="12,041"
                change="+16.09 from last month"
              />
              <StatsCard
                title="Blocked & Flagged Prompt Ratio"
                value="12,041"
                change="+16.09 from last month"
              />
            </div>
            <RecentPrompts prompts={[]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
