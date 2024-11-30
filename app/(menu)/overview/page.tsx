"use client";
import { useEffect, useState, useMemo } from "react";
import { SummaryCard } from "@/components/summary-card";
import { Chart } from "@/components/chart";

import { useGetOverview } from "@/features/overview/api/use-get-overview";
import { format } from "date-fns";
import { DatePicker } from "@/components/date-picker";
import { useSearchParams } from "next/navigation";

export default function MenuPage() {
  const transactions = useGetOverview();
  const searchParams = useSearchParams()
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  // Use useMemo to memoize transactionData
  const transactionData = useMemo(() => transactions.data || [], [transactions.data]);
  // console.log(transactionData);

  const [soldMenu, setSoldMenu] = useState(0);

  const totalSale = transactionData.length > 0 ? transactionData?.reduce((acc: any, item: any) => acc + item.totalPrice, 0) : 0;
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
    <>
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
    </div>
    </>
  );
}
