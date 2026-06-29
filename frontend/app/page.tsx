"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import ConsumersChart from "@/components/ConsumersChart";
import DistributionChart from "@/components/DistributionChart";
import { DataTable } from "@/components/customerRanking/data-table";
import { columns } from "@/components/customerRanking/columns";

interface Stats {
  total_clients: number;
  active_clients: number;
  active_pppoe: number;
  total_plans: number;
}

interface TopConsumer {
  id: number;
  full_name: string;
  plan_name: string;
  quota_gb: number;
  consumed_gb: string;
  percentage: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topConsumers, setTopConsumers] = useState<TopConsumer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, consumersRes] = await Promise.all([
          fetch("/api/dashboard/stats").then((res) => res.json()),
          fetch("/api/dashboard/top-consumers").then((res) => res.json()),
        ]);
        setStats(statsRes);
        setTopConsumers(consumersRes);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  const planDistribution = topConsumers.reduce(
    (acc, consumer) => {
      const existing = acc.find((item) => item.name === consumer.plan_name);
      if (existing) {
        existing.value += parseFloat(consumer.consumed_gb);
      } else {
        acc.push({
          name: consumer.plan_name,
          value: parseFloat(consumer.consumed_gb),
        });
      }
      return acc;
    },
    [] as { name: string; value: number }[],
  );

  return (
    <div className="container mx-auto min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          ISP Management Platform
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time client monitoring and traffic accounting
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value={stats?.total_clients || 0}
          color="blue"
        />
        <StatCard
          title="Active Clients"
          value={stats?.active_clients || 0}
          color="green"
        />
        <StatCard
          title="Active PPPoE"
          value={stats?.active_pppoe || 0}
          color="purple"
        />
        <StatCard
          title="Plans"
          value={stats?.total_plans || 0}
          color="orange"
        />
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Consumers Chart */}
        <ConsumersChart topConsumers={topConsumers} />

        {/* Plan Distribution */}
        <DistributionChart planDistribution={planDistribution} />
      </div>

      {/* Top Consumers Table */}
      <div className="container mx-auto py-10">
        <DataTable data={topConsumers} columns={columns} />
      </div>
    </div>
  );
}
