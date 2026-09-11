import { CareerCard } from './CareerCard';

export const Career = () => {
  return (
    <div className="flex items-center justify-between ">
      <div>
        <div className=" space-y-8">
          <li className="inline-flex w-fit items-center gap-x-2 rounded-full border px-3 py-1 text-[12px] font-semibold bg-emerald-500/10 border-emerald-500/40 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Шинэ функц
          </li>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-extrabold text-white leading-tight">
            Сонирхсон мэргэжлээ <br />
            <span className="text-[#6ee7b7]">баталгаажуул</span>
          </h1>
          <p className="text-[#e2e8f073] text-[14px] whitespace-pre-line">
            Аль мэргэжлийг сонирхож байгаагаа сонгоод, тусгайлан <br />
            боловсруулсан 5 асуултын тестийг өгнө үү. Тест нь тухайн мэргэжил
            <br /> танд үнэхээр тохирч байгаа эсэхийг тодорхойлж, итгэлтэй
            байхад <br /> тусална.
          </p>
          <div className="space-y-4">
            <p className="text-[#e2e8f073] text-[14px] whitespace-pre-line">
              🎯 8 мэргэжлийн чиглэлээс сонгох боломжтой
            </p>
            <p className="text-[#e2e8f073] text-[14px] whitespace-pre-line">
              ⚡ 5 асуулт — 3 минутад дуусна
            </p>
            <p className="text-[#e2e8f073] text-[14px] whitespace-pre-line">
              📊 Тохирлын хувь болон чадварын дүн шинжилгээ
            </p>
          </div>
          <button className="flex justify-center items-center gap-3 py-3 px-4 rounded-lg bg-[#6ee7b7]">
            <p className="text-[14px] font-semibold">Мэргэжил шалгах</p>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7H12M8 3L12 7L8 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-3 ">
        <CareerCard
          variant="green"
          career="Програм хангамжийн инженер"
          per="94"
        />
        <CareerCard variant="amber" career="Бүтээгдэхүүний менежер" per="78" />
        <CareerCard variant="purple" career="UX Дизайнер" per="85" />
        <CareerCard variant="yellow" career="Өгөгдлийн шинжээч" per="71" />
      </div>
    </div>
  );
};
