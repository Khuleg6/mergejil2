'use client';
import { useEffect, useState } from 'react';
import { TestCard } from './testCard';

type StackItem = {
  variant: 'green' | 'amber' | 'purple';
  badge: string;
  title: string;
  description: string;
  time: string;
  xp: string;
  px: string;
  py: string;
};

type TestCardStackProps = {
  items: StackItem[];
  intervalMs?: number; // 0 бол автомат эргэлт унтардаг
};

export const TestCardStack = ({
  items,
  intervalMs = 3000,
}: TestCardStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!intervalMs) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, items.length]);

  return (
    <div className="relative w-full max-w-md" style={{ height: 240 }}>
      {items.map((item, i) => {
        // offset = 0 бол идэвхтэй (хамгийн урд), 1 = дараагийнх, 2 = хамгийн ард
        const offset = (i - activeIndex + items.length) % items.length;

        const translateY = offset * 14; // ард талын карт бага зэрэг доошоо
        const scale = 1 - offset * 0.04; // ард талын карт бага зэрэг жижигхэн
        const opacity = offset === 0 ? 1 : offset === 1 ? 0.55 : 0.28;
        const zIndex = items.length - offset;
        const blur = offset === 0 ? 'blur-0' : 'blur-[1px]';

        return (
          <div
            key={item.title}
            className={`absolute inset-x-0 top-0 transition-all duration-700 ease-out ${blur}`}
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity,
              zIndex,
              pointerEvents: offset === 0 ? 'auto' : 'none',
            }}
          >
            <TestCard mode="stack" {...item} />
          </div>
        );
      })}
    </div>
  );
};
