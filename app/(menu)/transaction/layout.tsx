import TransactionSkeleton from "@/components/transaction-skeleton";
import { Suspense } from "react";

type TransactionLayoutProps = {
  children: React.ReactNode;
};

const TransactionLayout = ({ children }: TransactionLayoutProps) => {
  return (
    <>
      <Suspense fallback={<TransactionSkeleton />}>{children}</Suspense>
    </>
  );
};

export default TransactionLayout;
