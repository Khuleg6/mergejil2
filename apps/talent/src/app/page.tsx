import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f7f6ef]">
      <Navbar />
      <main>
        <Hero />
        <About />
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-7 text-sm text-slate-500">
        <span className="font-semibold text-[#31563d]">ҮгНэм</span>
        <span>Монгол хэлээ хамтдаа суръя.</span>
      </footer>
    </div>
  );
}
