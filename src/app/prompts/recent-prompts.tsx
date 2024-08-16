"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip } from "@/components/chip";
import { Prompt, RiskLevel } from "@/data/types";
import { getFullName } from "@/lib/utils";
import { prettyPercent } from "@/lib/number-utils";
import { DataTablePagination } from "@/components/table-pagination";
import { useMockData } from "@/app-context";
import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

type RecentPromptsProps = {
  prompts: Prompt[];
};

export function RecentPrompts(props: RecentPromptsProps) {
  const { prompts } = useMockData();

  const columns: ColumnDef<Prompt>[] = [
    {
      header: "Content",
      accessorKey: "content",
    },
    {
      header: "User",
      accessorKey: "user",
    },
    {
      header: "Category",
      accessorKey: "categories",
    },
    {
      header: "Risk",
      accessorKey: "risk",
    },
  ];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable<Prompt>({
    data: prompts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card className="col-span-3">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Recent Prompts</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="px-12">
              <TableRow>
                <TableHead>Prompt</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.map((prompt, i) => (
                <PromptRow key={i} prompt={prompt} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p>Total Prompts: {prompts.length}</p>
    </>
  );
}

function PromptRow({ prompt }: { prompt: Prompt }) {
  const fullName = getFullName(prompt.user.firstName, prompt.user.lastName);
  const score = prettyPercent(prompt.risk.score);

  return (
    <TableRow>
      <TableCell className="font-medium">{prompt.content}</TableCell>
      <TableCell>{fullName}</TableCell>
      <TableCell>
        {prompt.categories.map((p, i) => (
          <Chip key={i} level="base">
            {p}
          </Chip>
        ))}
      </TableCell>
      <TableCell className="text-right">
        <Chip level={getChipLevel(prompt.risk.level)} fixedWidth>
          {score}
        </Chip>
      </TableCell>
    </TableRow>
  );
}

const getChipLevel = (level: string | RiskLevel) => {
  switch (level) {
    case "low":
      return "warning";
    case "medium":
      return "warning";
    case "high":
      return "danger";
    default:
    case "safe":
      return "info";
  }
};

{
  /* <div className="space-y-8">
<div className="flex items-center">
  <Avatar className="h-9 w-9">
    <AvatarImage src="/avatars/01.png" alt="Avatar" />
    <AvatarFallback>OM</AvatarFallback>
  </Avatar>
  <div className="ml-4 space-y-1">
    <p className="text-sm font-medium leading-none">
      Olivia Martin
    </p>
    <p className="text-sm text-muted">
      olivia.martin@email.com
    </p>
  </div>
  <div className="ml-auto font-medium">+$1,999.00</div>
</div>
<div className="flex items-center">
  <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
    <AvatarImage src="/avatars/02.png" alt="Avatar" />
    <AvatarFallback>JL</AvatarFallback>
  </Avatar>
  <div className="ml-4 space-y-1">
    <p className="text-sm font-medium leading-none">Jackson Lee</p>
    <p className="text-sm text-muted-foreground">
      jackson.lee@email.com
    </p>
  </div>
  <div className="ml-auto font-medium">+$39.00</div>
</div>
<div className="flex items-center">
  <Avatar className="h-9 w-9">
    <AvatarImage src="/avatars/03.png" alt="Avatar" />
    <AvatarFallback>IN</AvatarFallback>
  </Avatar>
  <div className="ml-4 space-y-1">
    <p className="text-sm font-medium leading-none">
      Isabella Nguyen
    </p>
    <p className="text-sm text-muted-foreground">
      isabella.nguyen@email.com
    </p>
  </div>
  <div className="ml-auto font-medium">+$299.00</div>
</div>
<div className="flex items-center">
  <Avatar className="h-9 w-9">
    <AvatarImage src="/avatars/04.png" alt="Avatar" />
    <AvatarFallback>WK</AvatarFallback>
  </Avatar>
  <div className="ml-4 space-y-1">
    <p className="text-sm font-medium leading-none">William Kim</p>
    <p className="text-sm text-muted-foreground">will@email.com</p>
  </div>
  <div className="ml-auto font-medium">+$99.00</div>
</div>
<div className="flex items-center">
  <Avatar className="h-9 w-9">
    <AvatarImage src="/avatars/05.png" alt="Avatar" />
    <AvatarFallback>SD</AvatarFallback>
  </Avatar>
  <div className="ml-4 space-y-1">
    <p className="text-sm font-medium leading-none">Sofia Davis</p>
    <p className="text-sm text-muted-foreground">
      sofia.davis@email.com
    </p>
  </div>
  <div className="ml-auto font-medium">+$39.00</div>
</div>
</div> */
}
