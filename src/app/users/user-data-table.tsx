"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { getFullName, getInitials } from "@/lib/utils";
import { Chip, getChipLevel } from "@/components/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/table-pagination";
import { UserWithRiskMetrics } from "@/lib/db/types";
import { UserRiskMetrics } from "@/lib/risk/types";
import { prettyPercent } from "@/lib/utils";


type UserDataTableProps = {
  users: UserWithRiskMetrics[];
};

export const UserDataTable = ({ users }: UserDataTableProps) => {
  const columns: ColumnDef<UserWithRiskMetrics>[] = [
    {
      header: "User",
      accessorFn: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      header: "Email",
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

  const table = useReactTable<UserWithRiskMetrics>({
    data: users,
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
                return <UserRow key={row.id} user={row.original} />;
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DataTablePagination table={table} />
    </>
  );
};

const UserRow = ({ user }: { user: UserWithRiskMetrics }) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-row gap-2 items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarURL} alt="" />
            <AvatarFallback className="text-xs">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none pb-1">
              {getFullName(user.firstName, user.lastName)}
            </p>
            <p className="text-xs leading-none text-muted font-light">
              {user.IPAddress}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm text-muted">{user.email}</p>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
        {(user.riskMetrics as UserRiskMetrics).categories.map((category) => (
          <Chip key={category} level="base">
            {category}
          </Chip>
        ))}
        </div>
      </TableCell>
      <TableCell>
        <Chip
          level={getChipLevel(
            (user.riskMetrics as UserRiskMetrics).level
          )}
          fixedWidth
        >
          {prettyPercent((user.riskMetrics as UserRiskMetrics).score)}
        </Chip>
      </TableCell>
    </TableRow>
  );
};
