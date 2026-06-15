import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { OnAirNow } from "@/components/sections/OnAirNow";
import { Partners } from "@/components/sections/Partners";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { SolutionsTeaser } from "@/components/sections/SolutionsTeaser";
import { StationsTeaser } from "@/components/sections/StationsTeaser";
import { CTA } from "@/components/sections/CTA";

export function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <OnAirNow />
      <AboutTeaser />
      <SolutionsTeaser />
      <StationsTeaser />
      <Partners />
      <CTA />
    </>
  );
}
