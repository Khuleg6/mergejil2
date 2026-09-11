'use client';
import Footer from '@/components/homepage/Footer';
import { useScrollToHash } from '@/components/homepage/Hash';
import { Header } from '@/components/homepage/Header';
import Hero from '@/components/homepage/Hero';

export default function home() {
  useScrollToHash();
  return (
    <div className="relative">
      <div className="w-full px-28">
        <Header />
      </div>
      <Hero />
      <Footer />
    </div>
  );
}
