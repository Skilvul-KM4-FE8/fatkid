"use client";
import React from "react";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface DataItem {
  name: string;
  quantity: number;
}

interface PieChartProps {
  data: DataItem[];
  identity: { name: string };
  disabled: any;
}

export default function PieChartComponent({ data, identity }: PieChartProps) {
  // Urutkan data berdasarkan quantity secara menurun
  const sortedData = [...data].sort((a, b) => b.quantity - a.quantity);

  // Ambil total quantity
  const totalQuantity = sortedData.reduce((acc, item) => acc + item.quantity, 0);

  // Tambahkan warna untuk setiap kategori
  const chartData = sortedData.map((item, index) => ({
    ...item,
    fill: `hsl(${(index * 360) / sortedData.length}, 70%, 50%)`,
  }));

  // Konfigurasi chart
  const chartConfig: ChartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{identity.name}</CardTitle>
        <CardDescription>Product Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[500px] pb-0 [&_.recharts-pie-label-text]:fill-foreground">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="quantity" label nameKey="name" outerRadius={90} innerRadius={30} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total {totalQuantity} sold items <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Based on total quantity</div>
      </CardFooter>
    </Card>
  );
}
