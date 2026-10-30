import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import useTitle from "../../../hooks/useTitle";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../shared/Spinner";
import { formatPrice } from "../../../utils/formatPrice";

const axisTick = { fontSize: 14, fill: "#3d3d3d" };
const tooltipStyle = { fontSize: 15, color: "#1f1f1f" };

const PlatformStatistics = () => {
  useTitle("Platform Statistics");
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stats");
      return res.data;
    },
  });

  if (isLoading) return <Spinner />;

  const totalPayment = stats.totalPayment || 0;
  const totalUsers = stats.totalUsers || 0;
  const ordersPending = stats.ordersPending || 0;
  const ordersDelivered = stats.ordersDelivered || 0;

  const cards = [
    { label: "Total Payment", value: formatPrice(totalPayment) },
    { label: "Total Users", value: totalUsers },
    { label: "Orders Pending", value: ordersPending },
    { label: "Orders Delivered", value: ordersDelivered },
  ];

  const barData = [
    { name: "Users", value: totalUsers },
    { name: "Pending", value: ordersPending },
    { name: "Delivered", value: ordersDelivered },
  ];

  const pieData = [
    { name: "Pending", value: ordersPending },
    { name: "Delivered", value: ordersDelivered },
  ];

  const pieColors = ["#e9a23b", "#4a6b3d"];

  return (
    <div>
      <h1 className="text-3xl font-bold">Platform Statistics</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-box border border-base-300 bg-base-100 p-5"
          >
            <p className="text-base font-medium text-base-content/80">{card.label}</p>
            <p className="mt-2 text-4xl font-bold text-primary">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-box border border-base-300 bg-base-100 p-5">
          <h2 className="text-lg font-semibold">Users and Orders</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={axisTick} />
                <YAxis allowDecimals={false} tick={axisTick} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#c8461a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-box border border-base-300 bg-base-100 p-5">
          <h2 className="text-lg font-semibold">Order Status</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label={{ fontSize: 15, fill: "#1f1f1f" }}
                >
                  {pieData.map((item, index) => (
                    <Cell key={item.name} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 15, color: "#1f1f1f" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStatistics;