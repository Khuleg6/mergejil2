import React from 'react';
import { ArrowRight, Rocket } from 'lucide-react'; // lucide-react эсвэл өөрийн икон ашиглаарай
import { StartTestLink } from '../StartTestLink';

interface BadgeProps {
  text: string;
}

const Badge: React.FC<BadgeProps> = ({ text }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400 backdrop-blur-sm">
      <Rocket className="h-3.5 w-3.5 text-amber-400" />
      <span>{text}</span>
    </div>
  );
};

export const HeroSection: React.FC = () => {
  return (
    <section className="relative flex min-h-[80vh] w-full flex-col items-center justify-center bg-[#090b10] px-4 text-center text-white overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <Badge text="Үнэгүй • Бүртгүүлээд шууд эхлээрэй" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Өнөөдөр карьерын <br />
          <span className="text-amber-400">замаа тодорхойл</span>
        </h1>
        <p className="max-w-xl text-sm sm:text-base text-gray-400 leading-relaxed font-normal">
          33 минут зарцуулаад таны ирээдүйн карьерын бүрэн зураглалыг авна уу.
        </p>
        <button
          type="button"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-amber-400 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
        >
          <StartTestLink>
            <span>Үнэлгээ эхлэх</span>
          </StartTestLink>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
