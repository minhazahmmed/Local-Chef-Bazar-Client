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
    { label: "Total Payment", value: `$${totalPayment}` },
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
      <h1 className="text-2xl font-bold">Platform Statistics</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-box border border-base-300 bg-base-100 p-5"
          >
            <p className="text-sm text-base-content/60">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-primary">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-box border border-base-300 bg-base-100 p-5">
          <h2 className="font-semibold">Users and Orders</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#c8461a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-box border border-base-300 bg-base-100 p-5">
          <h2 className="font-semibold">Order Status</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {pieData.map((item, index) => (
                    <Cell key={item.name} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStatistics;