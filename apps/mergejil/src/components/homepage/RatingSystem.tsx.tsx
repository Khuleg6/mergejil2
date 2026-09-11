import Link from 'next/link';
import { TestCard } from './testCard';

export const RatingSystem = () => {
  return (
    <div className=" space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[#f5a623] text-[12px] font-semibold">
            ҮНЭЛГЭЭНИЙ СИСТЕМ
          </h1>
          <h1 className="text-[40px] font-bold text-white">
            3 модуль · 33 минут ·
          </h1>
          <h1 className="text-[#e2e8f066] text-[40px] font-bold">
            Бүрэн карьерийн профайл
          </h1>
        </div>
        <Link
          href="/career-assessment"
          className="flex text-[#f5a623] py-2 px-4 rounded-lg border border-[#f5a623] text-[12px] font-semibold justify-center items-center gap-2 hover:bg-[#f5a623]/10 transition-colors"
        >
          <p>Бүгдийг үзэх</p>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7H12M8 3L12 7L8 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Link>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-[65fr_35fr] gap-6">
          <TestCard
            variant="green"
            mode="grid"
            href="/career-assessment"
            badge="Модуль 01 · MBTI"
            title="Хувийн шинжийн үнэлгээ"
            description={`Myers-Briggs загварт тулгуурлан таны сэтгэлгээний хэв маяг,харилцааны онцлог, шийдвэр гаргах арга барилыг тодорхойлно. 16 төрлийн хувийн шинжийн аль нэгт хамаарахыг олж мэдэнэ.`}
            time="10"
            xp="120"
            size="text-[24px]"
            px="px-[40px]"
            py="py-[60px]"
          />
          <TestCard
            variant="amber"
            mode="grid"
            href="/iq-test"
            badge="Модуль 02 · IQ"
            title="Оюуны чадварын тест"
            description="Логик, тоон болон орон зайн сэтгэлгээний чадварыг хэмжинэ."
            time="15"
            xp="150"
            px="px-[40px]"
            py="py-[60px]"
            size="text-[24px]"
          />
        </div>
        <div className="grid grid-cols-[40fr_60fr] gap-6">
          <TestCard
            variant="purple"
            mode="grid"
            href="/iq-test"
            badge="Модуль 03 · Ур чадвар"
            title="Практик ур чадварын тест"
            description="Бодит даалгаврын тусламжтайгаар таны мэргэжлийн ур чадварыг үнэлнэ."
            time="8"
            xp="100"
            px="px-[40px]"
            py="py-[60px]"
            size="text-[24px]"
          />
        </div>
      </div>
    </div>
  );
};
