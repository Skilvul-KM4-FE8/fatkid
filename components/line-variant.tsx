import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "./custom-tooltip";

type Props = {
  data: any[];
};

export const LineVariant = ({ data }: Props) => {
  return (
    <>
      <ResponsiveContainer width={"105%"} height={370} className={"mx-auto px-5 pt-8"}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray={"3 3"} />
          <defs>
          <linearGradient id="totalPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F60002" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F60002" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="totalSoldFood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffff00" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffff00" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="totalSoldDrink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#43EA46" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#43EA46" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey={"createdAt"} />
          <YAxis />
          <CartesianGrid strokeDasharray={"3 3"} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="totalSoldFood" stroke="#ffff00" fillOpacity={1} fill="url(#totalSoldFood)" />
          <Line type="monotone" dataKey="totalSoldDrink" stroke="#43EA46" fillOpacity={1} fill="url(#totalSoldDrink)" />
          <Line type="monotone" dataKey="totalPrice" stroke="#F60002" fillOpacity={1} fill="url(#totalPrice)" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};
