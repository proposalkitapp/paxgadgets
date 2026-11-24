import HeroSection from "@/components/home/HeroSection";
import FeaturedProductSection from "@/components/home/FeaturedProductSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import ComingSoonSection from "@/components/home/ComingSoonSection";
import BrandStory from "@/components/home/BrandStory";
import AIAdvisorBanner from "@/components/ai/AIAdvisorBanner";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturedProductSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mb-10 mt-12">
        <AIAdvisorBanner />
      </div>
      <CategoryShowcase />
      <ComingSoonSection />
      <BrandStory />
    </div>
  );
}
