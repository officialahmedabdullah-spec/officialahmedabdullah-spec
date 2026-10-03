import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import ChatProcess from "@/components/sections/ChatProcess";
import FeaturedWork from "@/components/sections/FeaturedWork";
import Hero from "@/components/sections/Hero";
import History from "@/components/sections/History";
import LogoBuild from "@/components/sections/LogoBuild";
import Pricing from "@/components/sections/Pricing";
import ServicesPan from "@/components/sections/ServicesPan";
import Skills from "@/components/sections/Skills";
import Statement from "@/components/sections/Statement";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import Ticker from "@/components/sections/Ticker";

export default function HomePage() {
  useDocumentTitle();

  return (
    <>
      <Hero />
      <Ticker />
      <Statement />
      <ServicesPan />
      <FeaturedWork />
      <LogoBuild />
      <Skills />
      <History />
      <ChatProcess />
      <ReviewsSection />
      <Pricing />
    </>
  );
}
