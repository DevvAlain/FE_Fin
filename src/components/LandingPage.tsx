import React, { useEffect } from "react";
import Header from "./Header";
import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import AIInsightSection from "./sections/AIInsightSection";
import PricingSection from "./sections/PricingSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import Footer from "./Footer";

const LandingPage: React.FC = () => {
  // Smooth scroll behavior for navigation links
  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute("href");

      if (href && href.startsWith("#")) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", handleSmoothScroll);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main className="overflow-hidden">
        {/* Hero Section - First impression with strong value proposition */}
        <HeroSection />

        {/* Features Section - Showcase key product capabilities */}
        <FeaturesSection />

        {/* AI Insight Section - Highlight AI-powered features */}
        <AIInsightSection />

        {/* Pricing Section - Clear pricing with value comparison */}
        <PricingSection />

        {/* Testimonials Section - Social proof and credibility */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
