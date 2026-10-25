import useTitle from "../hooks/useTitle";
import Banner from "../components/Home/Banner";
import DailyMeals from "../components/Home/DailyMeals";
import ExtraSection from "../components/Home/ExtraSection";
import CustomerReviews from "../components/Home/CustomerReviews";

const Home = () => {
  useTitle("Home");

  return (
    <div>
      <Banner />
      <DailyMeals />
      <ExtraSection />
      <CustomerReviews />
    </div>
  );
};

export default Home;