import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const TransactionSkeleton = () => {
  return (
    <div className="max-w-screen-2xl w-full pb-10 -mt-24 flex justify-center items-center mx-auto">
      <Card className="w-full border-none drop-shadow-sm">
        <CardHeader className="flex gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            <Skeleton className="h-10 w-28 lg:w-48" />
          </CardTitle>
          <Skeleton className="h-10 w-full lg:w-36" />
        </CardHeader>
        <CardContent className="grid gap-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-2/5" />
            <Skeleton className="h-10 w-full lg:w-28" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSkeleton;
