import DeliveryLoader from "./DeliveryLoader";

const Spinner = () => {
  return (
    <div className="flex justify-center px-4 py-16">
      <DeliveryLoader />
    </div>
  );
};

export default Spinner;