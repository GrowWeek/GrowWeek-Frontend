import { Suspense } from "react";
import {
  LandingNav,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
  Footer,
  PageViewTracker,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <LandingNav />
      <main>
        <Suspense fallback={null}>
          <HeroSection />
        </Suspense>
        <FeaturesSection />
        <HowItWorksSection />
        <Suspense fallback={null}>
          <CTASection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
