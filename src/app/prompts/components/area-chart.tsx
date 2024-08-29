"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { PromptWithRiskMetrics } from "@/lib/db/types";
import { pipe } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  transformPromptDateMapToRechartsData,
  orderPromptsByDate,
  aggregatePromptsRiskedByWeek,
} from "@/lib/analytics";

const chartConfig = {
  safe: {
    label: "Safe",
    color: "hsl(var(--chart-2))", // green
  },
  malicious: {
    label: "Malicious",
    color: "hsl(var(--chart-1))", // red
  },

} satisfies ChartConfig;

type PromptsMaliciousComparisonChartProps = {
  prompts: PromptWithRiskMetrics[];
};

export function PromptsAreaChart({
  prompts,
}: PromptsMaliciousComparisonChartProps) {
  const chartData = pipe(
    prompts,
    orderPromptsByDate,
    aggregatePromptsRiskedByWeek,
    transformPromptDateMapToRechartsData
  );

  const date = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthName = monthNames[date.getMonth()];
  const threeMonthsAgo = monthNames[date.getMonth() - 3];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Prompts</CardTitle>
        <CardDescription>
          Showing total number of safe and malicious prompts per week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={24}
              tickCount={10}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillMalicious" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-malicious)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-malicious)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSafe" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-safe)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-safe)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="safe"
              type="natural"
              fill="url(#fillSafe)"
              fillOpacity={0.4}
              stroke="var(--color-safe)"
              stackId="a"
            />
            <Area
              dataKey="malicious"
              type="natural"
              fill="url(#fillMalicious)"
              fillOpacity={0.9}
              stroke="var(--color-malicious)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {threeMonthsAgo} - {currentMonthName} 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
