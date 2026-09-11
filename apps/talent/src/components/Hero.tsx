import Link from 'next/link';

export const Hero = () => (
  <section className="border-b border-[#dedfd5] bg-[#f7f6ef]">
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2 lg:gap-20">
      <div>
        <p className="mb-6 text-sm font-semibold tracking-wide text-[#42634b]">МОНГОЛ ХЭЛ • ҮГ, ӨГҮҮЛБЭР</p>
        <h1 className="text-4xl font-semibold leading-[1.2] tracking-tight text-[#243c2d] md:text-5xl lg:text-6xl">
          Үгээ ойлгоё.<br />Өгүүлбэр бүтээе.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
          Зураг харж, шинэ үг сурч, сурсан үгээрээ өгүүлбэр зохиоё. Багшийнхаа бэлтгэсэн хичээлийг өөрийн хурдаар давтаарай.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/login" className="rounded-lg bg-[#31563d] px-6 py-3.5 font-semibold text-white hover:bg-[#24412e]">Хичээлдээ орох <span aria-hidden="true">→</span></Link>
          <a href="#how-it-works" className="rounded-lg px-3 py-3.5 font-medium text-[#31563d] underline decoration-[#a2b2a2] underline-offset-4 hover:bg-[#e9ecdf]">Хэрхэн сурах вэ?</a>
        </div>
        <p className="mt-8 max-w-md text-sm leading-6 text-slate-500">Сонсголын болон хэл ярианы бэрхшээлтэй хүүхдүүдийн монгол хэлний сургалтад зориулсан.</p>
      </div>
      <div className="rounded-xl border border-[#d9ddcf] bg-white p-5 shadow-sm sm:p-8">
        <div className="flex items-center justify-between border-b border-[#e8e9e1] pb-4 text-sm">
          <span className="font-semibold text-[#31563d]">Хамтдаа суръя</span>
          <span className="text-slate-500">Хичээлийн жишээ</span>
        </div>
        <div className="my-5 flex items-center gap-6 rounded-lg bg-[#f4f1e6] px-6 py-8">
          <span role="img" aria-label="Нээлттэй ном" className="text-7xl sm:text-8xl">📖</span>
          <div><p className="text-sm text-slate-500">Энэ юу вэ?</p><p className="mt-1 text-4xl font-semibold text-[#243c2d]">Ном</p><p className="mt-2 text-sm text-slate-600">Юу? гэсэн асуултад хариулна.</p></div>
        </div>
        <p className="text-sm font-medium text-slate-500">Үгээрээ өгүүлбэр бүтээе</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xl font-medium">
          <span className="rounded-md bg-[#edf2e9] px-4 py-3 text-[#31563d]">Би</span>
          <span className="rounded-md bg-[#f6eddb] px-4 py-3 text-[#775925]">ном</span>
          <span className="rounded-md bg-[#edf0f4] px-4 py-3 text-[#405573]">уншиж байна.</span>
        </div>
        <p className="mt-5 border-t border-[#e8e9e1] pt-4 text-sm leading-6 text-slate-600">Чи ямар ном унших дуртай вэ? Багштайгаа ярилцаарай.</p>
      </div>
    </div>
  </section>
);
