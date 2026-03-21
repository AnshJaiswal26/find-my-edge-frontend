import { Skeleton } from "@shared/components/ui";

const CardSkeleton = () => <Skeleton height="100px" width="100%" />;
const CartSkeleton = () => <Skeleton height="250px" width="100%" />;

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton height="150px" width="100%" />
      <div className="grid grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <CartSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
