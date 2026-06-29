"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Customer = {
  id: number;
  full_name: string;
  plan_name: string;
  quota_gb: number;
  consumed_gb: string;
  percentage: string;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
  },
  {
    accessorKey: "full_name",
    header: "Client",
  },
  {
    accessorKey: "plan_name",
    header: "Plan",
  },
  {
    accessorKey: "quota_gb",
    header: "Quota (GB)",
  },
  {
    accessorKey: "consumed_gb",
    header: "Consumed (GB)",
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
  },
];
