"use client"
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chip, getChipLevel } from "@/components/chip";
import { DataTablePagination } from "@/components/table-pagination";
import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
//utils
import { PromptWithUserAndRiskMetrics, PromptWithUserDetails } from "@/lib/db/types";
import { getFullName } from "@/lib/users";
import { prettyPercent } from "@/lib/utils";


type PromptsTableProps = {
  prompts: PromptWithUserAndRiskMetrics[];
}

export function PromptsTable({ prompts }: PromptsTableProps) {

  const columns: ColumnDef<PromptWithUserAndRiskMetrics>[] = [
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

  const table = useReactTable<PromptWithUserAndRiskMetrics>({
    data: prompts,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <Card className="col-span-3">
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader className="px-12">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getPaginationRowModel().rows.map((row) => {
                return <PromptRow key={row.id} prompt={row.original} />;
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DataTablePagination table={table} />
    </>
  );
}

function PromptRow({ prompt }: { prompt: PromptWithUserAndRiskMetrics }) {

  const { riskMetrics } = prompt;

  return (
    <TableRow>
      <TableCell className="font-medium w-7/12">{prompt.content}</TableCell>
      <TableCell>{getFullName(prompt.user)}</TableCell>
      <TableCell>
        <Chip level="base">{prompt.category}</Chip>
      </TableCell>
      <TableCell>
        <Chip level={getChipLevel(riskMetrics.level)} fixedWidth>
          {prettyPercent(riskMetrics.score)}
        </Chip>
      </TableCell>
    </TableRow>
  );
}


