"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { UserWithRiskMetrics, User } from "@/lib/db/types";
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
  transfomUserDateMapToRechartData,
  orderUsersByDate,
  aggregateUsersBySignupWeek,
} from "@/lib/analytics";

const chartConfig = {
  signupCount: {
    label: "Sign ups",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type UsersAreaChartProps = {
  users: UserWithRiskMetrics[];
  safe: User[];
  flagged: User[];
  blocked: User[];
};

export const UsersAreaChart = ({ users }: UsersAreaChartProps) => {
  const chartData = pipe(
    users,
    orderUsersByDate,
    aggregateUsersBySignupWeek,
    transfomUserDateMapToRechartData
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
  // this should also be dynamic
  const currentMonthName = monthNames[date.getMonth()];
  const fourMonthsAgo = monthNames[date.getMonth() - 4];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Signups</CardTitle>
        <CardDescription>
          Showing total number of user sign ups per week
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
              tickCount={5}
            />
            <XAxis
              dataKey="week"
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
              <linearGradient id="fillSignup" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-signupCount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-signupCount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="signupCount"
              type="natural"
              fill="url(#fillSignup)"
              fillOpacity={0.4}
              stroke="var(--color-signupCount)"
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
              {fourMonthsAgo} - {currentMonthName} 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
