import { Career } from './Career';
import { Comment } from './Comment';
import { Content } from './Content';
import HeroSection from './HeroSection';
import { RatingSystem } from './RatingSystem.tsx';
import { CareerProfile } from './result';

export default function Hero() {
  return (
    <div className="bg-[#0a0d14] space-y-15">
      <div className="relative min-h-screen overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 90%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 90%)',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        <div className="relative z-10">
          <Content />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#0a0d14]" />
      </div>

      <div id="rating" className="px-28 scroll-mt-20">
        <RatingSystem />
      </div>
      <div id="result" className="scroll-mt-4">
        <CareerProfile />
      </div>
      <div className="px-28 space-y-40">
        <div id="comment" className="scroll-mt-20">
          <Comment />
        </div>
        <div id="career" className="scroll-mt-40">
          <Career />
        </div>
        <HeroSection />
      </div>
    </div>
  );
}
