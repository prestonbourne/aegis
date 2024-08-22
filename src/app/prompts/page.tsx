import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { getDB } from "@/lib/db";
import { PromptsTable } from "./prompts-table";
import { PromptsCards } from "./prompts-cards";
import { DownloadButton } from "@/components/download-button";

import { getRiskService } from "@/lib/risk";

export const metadata: Metadata = {
  title: "Aegis Dashboard | Prompts",
  description: "LLM Safety and Analytics Dashboard",
};

export default async function PromptsPage() {
  const db = await getDB();

  const riskService = await getRiskService();
  const { riskMetrics } =
    riskService.assessAndFilterPrompts(db.prompts);
  db.addRisMetricsSet(riskMetrics);

  const prompts = db.getPromptsWithUserAndRiskMetrics();

  return (
    <div className="flex-col md:flex max-w-screen-xl mx-auto">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Prompts</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <DownloadButton toDownload={prompts} filename="prompts" >Download</DownloadButton>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
              <PromptsCards />
            </div>
            <PromptsTable prompts={prompts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
