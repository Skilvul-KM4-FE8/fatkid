export const CustomTooltip = ({ active, payload }: any) => {
  if (!active) return null;

  const createdAt = payload[0].payload.createdAt;
  const totalPrice = payload[0].payload.totalPrice;
  const totalFood = payload[0].payload.totalSoldFood;
  const totalDrink = payload[0].payload.totalSoldDrink;

  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="p-3">
        <p className="text-sm text-muted-foreground">{createdAt}</p>
        <div className="flex items-center">
          <span className="rounded-full w-4 h-4 bg-red-500 mr-2"></span>
          <p>Total:</p>
        </div>
        <p className="text-lg font-bold">
          {Intl.NumberFormat("id-ID", {
            currency: "IDR",
            style: "currency",
            maximumFractionDigits: 0,
          }).format(totalPrice)}
        </p>
        <div className="flex items-center">
          <span className="rounded-full w-4 h-4 bg-yellow-500 mr-2"></span>
          <p>Food:</p>
        </div>
        <p className="font-semibold">
          {Intl.NumberFormat("id-ID", {
            currency: "IDR",
            style: "currency",
            maximumFractionDigits: 0,
          }).format(totalFood)}
        </p>
        <div className="flex items-center">
          <span className="rounded-full w-4 h-4 bg-green-500 mr-2"></span>
          <p>Drink:</p>
        </div>
        <p className="font-semibold">
          {Intl.NumberFormat("id-ID", {
            currency: "IDR",
            style: "currency",
            maximumFractionDigits: 0,
          }).format(totalDrink)}
        </p>
      </div>
    </div>
  );
};
