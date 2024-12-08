"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart as RechartsPieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface DataItem {
  name: string;
  quantity: number;
}

interface PieChartProps {
  data: DataItem[];
  identity: { name: string };
}

export default function PieChartComponent({ data, identity }: PieChartProps) {
  // Urutkan data berdasarkan quantity secara menurun
  const sortedData = [...data].sort((a, b) => b.quantity - a.quantity);

  // Ambil 3 item teratas dan gabungkan sisanya ke kategori "Other"
  const topData = sortedData.slice(0, 3);
  const otherQuantity = sortedData.slice(3).reduce((acc, item) => acc + item.quantity, 0);

  // Jika ada data lain, tambahkan kategori "Other"
  const displayedData = otherQuantity > 0 ? [...topData, { name: "Other", quantity: otherQuantity }] : topData;

  // Tambahkan properti warna untuk setiap item
  const chartData = displayedData.map((item, index) => ({
    ...item,
    fill: `hsl(${(index * 360) / displayedData.length}, 70%, 50%)`,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{identity.name}</CardTitle>
        <CardDescription>Product Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[250px]"
          config={
            {
              /* your config here */
            }
          }
        >
          <RechartsPieChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="quantity" nameKey="name" innerRadius={60} strokeWidth={5} activeIndex={0} activeShape={(props: PieSectorDataItem) => <Sector {...props} outerRadius={(props.outerRadius ?? 0) + 10} />} />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Showing distribution of items <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Based on total quantity</div>
      </CardFooter>
    </Card>
  );
}
