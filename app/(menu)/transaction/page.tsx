"use client";
// import { Loader2, Plus } from "lucide-react";
// import { useGetMenus } from "@/features/menu/api/use-get-menus";
// import useBuyDialog from "@/features/transaction/hooks/use-buy-dialog";
import { columns } from "@/app/(menu)/transaction/columns";
import { DataTable } from "@/app/(menu)/transaction/data-table";
import { DatePicker } from "@/components/date-picker";
import TransactionSkeleton from "@/components/transaction-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransaction } from "@/features/transaction/api/use-bulk-delete-transaction";
import { useGetTransactions } from "@/features/transaction/api/use-get-transactions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MenuPage() {
  const transactionQuery = useGetTransactions();
  const transactionData = transactionQuery.data || [];
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });

  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    setDateRange({ from, to });
  }, [searchParams]);

  const { from, to } = dateRange;

  useEffect(() => {
    transactionQuery.refetch();
  }, [searchParams, transactionQuery, from, to]);

  const bulkDeleteTransactionMutation = useBulkDeleteTransaction();

  const disabled = transactionQuery.isLoading || bulkDeleteTransactionMutation.isPending;

  if (transactionQuery.isLoading) {
    return <TransactionSkeleton />;
  }

  return (
    <div className="mx-auto max-w-screen-2xl w-full pb-10 -mt-24">
      <div>
        <DatePicker />
      </div>
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Transaction Page</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactionData}
            disabled={disabled}
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              bulkDeleteTransactionMutation.mutate(ids);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
