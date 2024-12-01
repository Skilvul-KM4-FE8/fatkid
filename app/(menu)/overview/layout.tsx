import TransactionSkeleton from "@/components/transaction-skeleton";
import { Suspense } from "react";

type OverviewLayoutProps = {
  children: React.ReactNode;
};

const OverviewLayout = ({ children }: OverviewLayoutProps) => {
  return (
    <>
      <Suspense fallback={<TransactionSkeleton />}>{children}</Suspense>
    </>
  );
};

export default OverviewLayout;
