import HeroSection from "@/components/home/HeroSection";
import FeaturedProductSection from "@/components/home/FeaturedProductSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BrandStory from "@/components/home/BrandStory";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-white">
      <HeroSection />
      <FeaturedProductSection />
      <CategoryShowcase />
      <BrandStory />
    </div>
  );
}
