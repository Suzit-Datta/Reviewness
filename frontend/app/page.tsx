import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CommunityReviews } from '@/components/home/CommunityReviews';
import { LoginCta } from '@/components/home/LoginCta';
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-base-100">
      <Navbar />
      <Hero />
      <HowItWorks />
      <CommunityReviews />
      <LoginCta />
      <Footer />
    </main>
  );
}