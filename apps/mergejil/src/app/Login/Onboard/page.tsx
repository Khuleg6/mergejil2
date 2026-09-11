'use client';

import React from 'react';
import { Star, ArrowUpRight } from 'lucide-react';

export const Onboard = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0c10] text-slate-200 antialiased flex flex-col justify-center p-8 md:p-16 lg:p-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 max-w-2xl flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5b836]">
            <ArrowUpRight
              className="h-6 w-6 text-slate-900"
              strokeWidth={2.5}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Мэргэжил.мн</h1>
            <p className="text-sm text-slate-400">Career Guidance Platform</p>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f5b836]/30 bg-[#f5b836]/10 px-3.5 py-1.5">
            <Star className="h-3 w-3 fill-[#f5b836] text-[#f5b836]" />
            <span className="text-xs font-semibold text-[#f5b836]">
              Монголын #1 Карьер удирдамжийн платформ
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-[1.2]">
            <span className="text-white">Таны нуугдмал</span>
            <br />
            <span className="text-[#f5b836]">чадварыг илрүүлье</span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-md leading-relaxed">
            MBTI хувь хүний онцлог, IQ танин мэдэхүйн чадвар, практик ур
            чадварыг нэгтгэн таны хамгийн тохиромжтой мэргэжлийг тодорхойлно.
          </p>
        </div>

        <div className="flex gap-10">
          <div className="flex flex-col gap-0.5">
            <p className="text-2xl font-bold text-white">12,400+</p>
            <p className="text-xs text-slate-400">Оролцогчид</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-2xl font-bold text-white">98%</p>
            <p className="text-xs text-slate-400">Хэрэглэгчийн сэтгэл ханамж</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-2xl font-bold text-white">33 мин</p>
            <p className="text-xs text-slate-400">Нийт хугацаа</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            3 үнэлгээний модуль
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl">
                  🧠
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white">
                    <span className="mr-2 font-normal text-slate-500">01</span>
                    MBTI Хувийн шинж
                  </h3>
                  <p className="text-xs text-slate-400 ml-6">
                    16 хувийн онцлогийн төрөл
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="h-1.5 w-1.5 rounded-full bg-[#a855f7]"></div>
                10 мин
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#2563eb]/20 p-4 transition-all hover:bg-[#2563eb]/30">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563eb]/20 text-2xl">
                  ⚡
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white">
                    <span className="mr-2 font-normal text-slate-500">02</span>
                    IQ Танин мэдэхүй
                  </h3>
                  <p className="text-xs text-slate-400 ml-6">
                    Логик, орон зай, хэл, бүтээлч
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]"></div>
                15 мин
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl">
                  🎯
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white">
                    <span className="mr-2 font-normal text-slate-500">03</span>
                    Практик Ур чадвар
                  </h3>
                  <p className="text-xs text-slate-400 ml-6">
                    Техник, нийгмийн, бүтээлч, удирдлага
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="h-1.5 w-1.5 rounded-full bg-[#eab308]"></div>8
                мин
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-8">
          <p className="text-[13px] italic text-slate-400">
            “Боловсролын зөв сонголт бол амьдралын хамгийн чухал шийдвэрүүдийн
            нэг.”
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
              Б
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-white">Батболд Д.</h4>
              <p className="text-xs text-slate-400">
                МУИС, Мэдээллийн технологи — INTJ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
