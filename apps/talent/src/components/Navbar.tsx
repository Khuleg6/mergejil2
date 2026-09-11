import Link from 'next/link';

export const Navbar = () => (
  <header className="border-b border-[#dedfd5] bg-[#f7f6ef]">
    <nav aria-label="Үндсэн цэс" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
      <Link href="/" className="flex items-center gap-3 text-xl font-bold text-[#243c2d]">
        <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg bg-[#31563d] text-lg text-white">Ү</span>ҮгНэм
      </Link>
      <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
        <a href="#about" className="hover:text-[#31563d]">Сургалтын тухай</a>
        <a href="#how-it-works" className="hover:text-[#31563d]">Хэрхэн сурах вэ?</a>
      </div>
      <Link href="/login" className="rounded-lg border border-[#b9c3b5] px-5 py-2.5 text-sm font-semibold text-[#31563d] hover:bg-[#e9ecdf]">Нэвтрэх</Link>
    </nav>
  </header>
);
