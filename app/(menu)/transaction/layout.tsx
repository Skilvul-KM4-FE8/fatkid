import { Suspense } from "react";

type TransactionLayoutProps = {
  children: React.ReactNode;
};

const TransactionLayout = ({ children }: TransactionLayoutProps) => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </>
  );
};

export default TransactionLayout;
