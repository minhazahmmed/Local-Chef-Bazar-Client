import DeliveryLoader from "./DeliveryLoader";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 px-4">
      <DeliveryLoader label="Getting things ready..." />
    </div>
  );
};

export default Loading;