import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  consumed_gb: {
    label: "Consumed (GB)",
    color: "#0088FE",
  },
};

interface Consumer {
  id: number;
  full_name: string;
  plan_name: string;
  quota_gb: number;
  consumed_gb: string;
  percentage: string;
}

export default function ConsumersChart({
  topConsumers,
}: {
  topConsumers: Consumer[];
}) {
  const data = topConsumers.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Consumers</CardTitle>
        <CardDescription>This month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="full_name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v} GB`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent formatter={(value) => `${value} GB`} />
              }
            />
            <Bar
              dataKey="consumed_gb"
              fill="var(--color-consumed_gb)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
