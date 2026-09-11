'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthButton } from './AuthButton';
import { Logo } from '../Logo';
import { useAuth } from '@/lib/auth';
import { ASSESSMENT_PATH, buildLoginHref } from '@/lib/navigation';

const NAV_ITEMS: { label: string; id: string }[] = [
  { label: 'Үнэлгээ', id: 'rating' },
  { label: 'Үр дүн', id: 'result' },
  { label: 'Сэтгэгдэл', id: 'comment' },
  { label: 'Мэргэжил шалгах', id: 'career' },
];

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, ready } = useAuth();
  const [activeBtn, setActiveBtn] = useState<'Нэвтрэх' | 'Эхлэх' | null>(null);

  const handleAuthClick = (value: 'Нэвтрэх' | 'Эхлэх') => {
    setActiveBtn(value);
    if (value === 'Нэвтрэх') {
      router.push(buildLoginHref(ASSESSMENT_PATH, 'login'));
      return;
    }
    // Тест эхлэхийн өмнө бүртгэл шаардлагатай — нэвтрээгүй бол
    // бүртгүүлэх хуудас руу, дараа нь тест рүү буцаана.
    router.push(user ? ASSESSMENT_PATH : buildLoginHref());
  };

  const scrollToSection = (id: string) => {
    if (pathname !== '/') {
      // Өөр хуудаснаас home руу орж, дараа нь scroll хийх
      router.push(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full fixed top-0 left-0 z-50 flex justify-between items-center py-3 px-6 bg-black">
      <div className="flex items-center space-x-2">
        <Logo />
        <div className="text-[14px] font-semibold text-white">
          Мэргэжил<span className="text-[#F59e0b]">.мн</span>
        </div>
      </div>
      <div className="text-[12px] text-[#64748b] flex gap-5">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => scrollToSection(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <AuthButton
        activeBtn={activeBtn}
        setActiveBtn={handleAuthClick}
        loading={!ready}
        user={Boolean(user)}
      />
    </div>
  );
};
