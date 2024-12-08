import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "./custom-tooltip";

type Props = {
  data: any[];
};

export const AreaVariant = ({ data }: Props) => {
  return (
    <>
      <ResponsiveContainer width={"105%"} height={370} className={"mx-auto px-5 pt-8"}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray={"3 3"} />
          <defs>
            <linearGradient id="totalPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5F619D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6093A5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="totalSoldFood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5EC303" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#5EC303" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="totalSoldDrink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F70E19" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F70E19" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey={"createdAt"} />
          <YAxis />
          <CartesianGrid strokeDasharray={"3 3"} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="totalPrice" stroke="#5F619D" fillOpacity={1} fill="url(#totalPrice)" />
          <Area type="monotone" dataKey="totalSoldFood" stroke="#5EC303" fillOpacity={1} fill="url(#totalSoldFood)" />
          <Area type="monotone" dataKey="totalSoldDrink" stroke="#F70E19" fillOpacity={1} fill="url(#totalSoldDrink)" />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};
