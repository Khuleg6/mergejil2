import { StartTestLink } from '../StartTestLink';
import { TestCardStack } from './TestCardStack';

export const Content = () => {
  return (
    <div className="mx-auto grid w-full grid-cols-1 items-center gap-16 px-6 py-16 md:px-12 lg:grid-cols-2 lg:px-28 lg:py-24">
      <div className="max-w-2xl space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/50 bg-white/10 px-4 py-1.5 text-sm text-[#F59E0B] backdrop-blur-sm">
          <span className="text-[#F59E0B]">★</span>
          <span className="text-[#F59E0B] font-medium">
            Монголын #1 Карьер чиглүүлгийн платформаар
          </span>
        </div>

        <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-extrabold text-white leading-tight">
          Таны нуугдмал <span className="text-[#F59E0B]">чадварыг</span> <br />
          илрүүлье
        </h1>

        <p className="text-white/70 text-[18px]">
          <span>
            MBTI хувь хүний онцлог, IQ танин мэдэхүйн чадвар, практик ур
          </span>
          <br />
          <span>чадварыг нэгтгэн таны хамгийн тохиромжтой мэргэжлийг </span>
          <br />
          тодорхойлно.
        </p>

        <div className="flex items-center gap-4">
          <StartTestLink>
            <div className="px-5 py-3 bg-[#F59E0B] flex rounded-lg justify-center items-center gap-2  font-semibold hover:opacity-90 transition-all duration-150 cursor-pointer">
              <p>Үнэлгээ эхлэх</p>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8H13M9 4L13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </StartTestLink>
        </div>

        <div className="text-white flex flex-wrap items-center gap-5">
          <div className="flex justify-center flex-col">
            <p className="text-[24px] font-semibold">12,400+</p>
            <p className="text-[12px] font-normal text-white/50">Оролцогчид</p>
          </div>
          <div className="flex justify-center flex-col">
            <p className="text-[24px] font-semibold">98%</p>
            <p className="text-[12px] font-normal text-white/50">
              Сэтгэл ханамж
            </p>
          </div>
          <div className="flex justify-center flex-col">
            <p className="text-[24px] font-semibold">33 мин</p>
            <p className="text-[12px] font-normal text-white/50">
              Нийт хугацаа
            </p>
          </div>
          <div className="flex justify-center flex-col">
            <p className="text-[24px] font-semibold">200+</p>
            <p className="text-[12px] font-normal text-white/50">
              Мэргэжлийн чиглэл
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md justify-self-center lg:justify-self-end">
        <TestCardStack
          intervalMs={3000}
          items={[
            {
              variant: 'green',
              badge: 'Хувийн шинж',
              title: 'MBTI Тест',
              description:
                'Таны хувийн шинж, зан чанарыг 16 төрлийн загварт тулгуурлан тодорхойлно',
              time: '10',
              xp: '120',
              px: 'px-[20px]',
              py: 'py-[20px]',
            },
            {
              variant: 'amber',
              badge: 'Оюуны чадвар',
              title: 'IQ Тест',
              description:
                'Логик сэтгэлгээ, тоон болон орон зайн чадварыг хэмжинэ',
              time: '15',
              xp: '150',
              px: 'px-[20px]',
              py: 'py-[20px]',
            },
            {
              variant: 'purple',
              badge: 'Практик чадвар',
              title: 'Ур чадвар',
              description:
                'Практик болон мэргэжлийн ур чадварыг бодит даалгаврын тусламжтай үнэлнэ',
              time: '8',
              xp: '100',
              px: 'px-[20px]',
              py: 'py-[20px]',
            },
          ]}
        />
      </div>
    </div>
  );
};
