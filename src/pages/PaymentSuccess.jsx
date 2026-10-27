import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineCheckCircle } from "react-icons/md";
import useTitle from "../hooks/useTitle";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Spinner from "../components/shared/Spinner";

const PaymentSuccess = () => {
  useTitle("Payment Success");
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();

  const { isLoading, isError } = useQuery({
    queryKey: ["confirmPayment", sessionId],
    enabled: !!sessionId,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    queryFn: async () => {
      const res = await axiosSecure.post("/payments/confirm", { sessionId });
      return res.data;
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md rounded-box border border-base-300 bg-base-100 p-8 text-center">
        {isError || !sessionId ? (
          <>
            <h1 className="text-2xl font-bold">Could not verify payment</h1>
            <p className="mt-2 text-base-content/70">
              If money was deducted, it will show up in your orders shortly.
            </p>
          </>
        ) : (
          <>
            <MdOutlineCheckCircle size={64} className="mx-auto text-success" />
            <h1 className="mt-3 text-2xl font-bold">Payment successful</h1>
            <p className="mt-2 text-base-content/70">
              Thank you. Your chef has been notified and your order is on its way.
            </p>
          </>
        )}
        <Link to="/dashboard/my-orders" className="btn btn-primary mt-6">
          Go to My Orders
        </Link>
      </div>
    </section>
  );
};

export default PaymentSuccess;