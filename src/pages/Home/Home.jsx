import AboutSection from "./AboutSection";
import CategoriesSection from "./CategoriesSection";
import FeaturedSection from "./FeaturedSection";
import HeroSlider from "./HeroSection";
import PromoBanner from "./PromoBanner";
import ReviewsSection from "./ReviewsSection";

export default function Home() {
  return (
    <>
      <HeroSlider />

      <CategoriesSection />

      <FeaturedSection />

      <PromoBanner />

      <ReviewsSection />

      <AboutSection />
    </>
  );
}
