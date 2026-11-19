import HeroSection from "@/components/home/HeroSection";
import FeaturedProductSection from "@/components/home/FeaturedProductSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import ComingSoonSection from "@/components/home/ComingSoonSection";
import BrandStory from "@/components/home/BrandStory";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturedProductSection />
      <CategoryShowcase />
      <ComingSoonSection />
      <BrandStory />
    </div>
  );
}
