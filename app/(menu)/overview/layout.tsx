import { Header } from "@/components/header";
import { Suspense } from "react";

type OverviewLayoutProps = {
  children: React.ReactNode;
};

const OverviewLayout = ({ children }: OverviewLayoutProps) => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </>
  );
};

export default OverviewLayout;
