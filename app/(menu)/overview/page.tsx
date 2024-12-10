"use client";
import { useEffect, useState, useMemo } from "react";
import { SummaryCard } from "@/components/summary-card";
import { DatePicker } from "@/components/date-picker";
import { Chart } from "@/components/chart";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useGetOverview } from "@/features/overview/api/use-get-overview";
import PieChart from "@/components/piechart";

export default function MenuPage() {
  const transactions = useGetOverview();
  const searchParams = useSearchParams();

  // Local state to store 'from' and 'to' query params
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });

  // Update state when searchParams changes
  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    setDateRange({ from, to });
  }, [searchParams]);

  const { from, to } = dateRange;

  // Memoize the transaction data to avoid unnecessary recalculations
  const transactionData = useMemo(() => transactions.data?.data || [], [transactions.data]);

  const overviewFood = useMemo(() => transactions.data?.food || [], [transactions.data]);

  const overviewDrink = useMemo(() => transactions.data?.drink || [], [transactions.data]);

  const overviewAllItems = useMemo(() => transactions.data?.allitems || [], [transactions.data]);

  const [soldMenu, setSoldMenu] = useState(0);

  const totalSale = transactionData.length > 0 ? transactionData.reduce((acc: any, item: any) => acc + item.totalPrice, 0) : 0;
  const totalTransaction = transactionData.length;

  useEffect(() => {
    transactions.refetch();
  }, [searchParams, transactions, from, to]);

  const fixedData =
    transactionData.length > 0
      ? transactionData.map((item: any) => ({
          ...item,
          createdAt: format(new Date(item.createdAt), "dd MMMM yyyy"),
          totalPrice: item.totalPrice,
        }))
      : [];

  useEffect(() => {
    if (transactionData.length > 0) {
      const totalMenuSold = transactionData.reduce((total: number, transaction: any) => {
        if (transaction.items && Array.isArray(transaction.items)) {
          const quantityPerTransaction = transaction.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
          return total + quantityPerTransaction;
        }
        return total;
      }, 0);
      setSoldMenu(totalMenuSold);
    }
  }, [transactionData]);

  return (
    <div className="mx-auto max-w-screen-2xl w-full pb-10 -mt-24">
      <div>
        <DatePicker />
      </div>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 w-full gap-8">
        <SummaryCard disabled={transactions.isLoading} data={totalSale} title="Total Sale" tipe="" from={from} to={to} />
        <SummaryCard disabled={transactions.isLoading} data={totalTransaction} title="Total Transaction" tipe="Transactions" from={from} to={to} />
        <SummaryCard disabled={transactions.isLoading} data={soldMenu} title="Total Menu Sold" tipe="Menus" from={from} to={to} />
      </div>
      <div className="mt-10">
        <Chart data={fixedData} disabled={transactions.isLoading} />
      </div>

      <div className="grid md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 mt-4  rounded-md ">
        <div className="flex justify-center">
          <PieChart disabled={transactions.isLoading} data={overviewFood} identity={{ name: "Food Sold" }} />
        </div>
        <div className="flex justify-center">
          <PieChart disabled={transactions.isLoading} data={overviewDrink} identity={{ name: "Drink Sold" }} />
        </div>
        <div className="flex justify-center">
          <PieChart disabled={transactions.isLoading} data={overviewAllItems} identity={{ name: "All Items Sold" }} />
        </div>
      </div>
    </div>
  );
}
