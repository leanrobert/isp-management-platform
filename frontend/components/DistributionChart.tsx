import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./ui/chart";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

interface PlanDistribution {
  name: string;
  value: number;
}

export default function DistributionChart({
  planDistribution,
}: {
  planDistribution: PlanDistribution[];
}) {
  const chartConfig = Object.fromEntries(
    planDistribution.map((entry, index) => [
      entry.name,
      { label: entry.name, color: COLORS[index % COLORS.length] },
    ])
  );

  const data = planDistribution.map((entry, index) => ({
    ...entry,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Consumption by Plan</CardTitle>
        <CardDescription>This month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-75"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => `${Number(value).toFixed(2)} GB`}
                  nameKey="name"
                />
              }
            />
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
