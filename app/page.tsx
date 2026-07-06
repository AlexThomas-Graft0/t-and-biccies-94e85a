import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FamilyStory } from "@/components/FamilyStory";
import { OfferingsGrid } from "@/components/OfferingsGrid";
import { MenuPackages } from "@/components/MenuPackages";
import { BookingForm } from "@/components/BookingForm";
import { ProductCatalog } from "@/components/ProductCatalog";
import { Testimonials } from "@/components/Testimonials";
import { ContactAndEnquiries } from "@/components/ContactAndEnquiries";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"t and biccies\",\"description\":\"we are a small family run cafe that offers afternoon tea\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"caerphilly, wales\"},\"url\":\"https://t-and-biccies-94e85a.duckbyte.co\"}" }} />
      <Navbar />
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <FamilyStory />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <OfferingsGrid />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <MenuPackages />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <BookingForm />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <ProductCatalog />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <ContactAndEnquiries />
      </Suspense>
      <Footer />
    </main>
  );
}
