'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Flame,
  Gift,
  Sparkles,
} from 'lucide-react';
import { AvatarPreview } from './AvatarPreview';
import { CustomizationItem } from './CustomizationItem';
import {
  avatarItems,
  categories,
  initialSelection,
  randomSelection,
  student,
  type Category,
} from './avatar-data';

export const AvatarCustomizer = () => {
  const [category, setCategory] = useState<Category>('hair');
  const [selection, setSelection] = useState(initialSelection);
  const [saved, setSaved] = useState(false);
  return (
    <main lang="en" className="app-page px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="mb-7 flex items-center justify-between">
            <Link
              href="/student"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to learning
            </Link>
            <span className="rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold text-indigo-600">
              Avatar studio · Preview
            </span>
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
            Made of little milestones
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your effort. Your style<span className="text-indigo-500">.</span>
          </h1>
          <p className="mt-3 text-slate-500">
            Build your streak, unlock new looks, and make this space your own.
          </p>
        </header>
        <div className="grid items-start gap-6 lg:grid-cols-[350px_1fr]">
          <AvatarPreview
            selection={selection}
            saved={saved}
            onRandomize={() => {
              setSelection(randomSelection(student.streak));
              setSaved(false);
            }}
            onSave={() => setSaved(true)}
          />
          <section
            aria-label="Customize your avatar"
            className="surface overflow-hidden rounded-3xl"
          >
            <div className="border-b border-slate-100 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Make it yours</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Small details. Big personality.
                  </p>
                </div>
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600">
                  15 / 30 unlocked
                </span>
              </div>
              <div
                role="tablist"
                aria-label="Customization categories"
                className="mt-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1"
              >
                {categories.map((tab, index) => (
                  <button
                    key={tab}
                    id={`tab-${tab}`}
                    role="tab"
                    aria-selected={category === tab}
                    aria-controls="customization-panel"
                    tabIndex={category === tab ? 0 : -1}
                    onClick={() => setCategory(tab)}
                    onKeyDown={(event) => {
                      const nextIndex =
                        event.key === 'ArrowRight'
                          ? (index + 1) % categories.length
                          : event.key === 'ArrowLeft'
                            ? (index + categories.length - 1) %
                              categories.length
                            : event.key === 'Home'
                              ? 0
                              : event.key === 'End'
                                ? categories.length - 1
                                : null;
                      if (nextIndex !== null) {
                        event.preventDefault();
                        setCategory(categories[nextIndex]);
                        document
                          .getElementById(`tab-${categories[nextIndex]}`)
                          ?.focus();
                      }
                    }}
                    className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold capitalize ${category === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div
              id="customization-panel"
              role="tabpanel"
              aria-labelledby={`tab-${category}`}
              tabIndex={0}
              className="p-5 sm:p-7"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold capitalize">{category} collection</h3>
                <span className="text-xs text-slate-500">
                  3 unlocked · 3 to discover
                </span>
              </div>
              <div
                key={category}
                className="grid grid-cols-2 gap-3 motion-safe:animate-[enter_240ms_ease-out] sm:grid-cols-3"
              >
                {avatarItems[category].map((item) => (
                  <CustomizationItem
                    key={item.id}
                    item={item}
                    selection={{ ...selection, [category]: item.id }}
                    selected={selection[category] === item.id}
                    onSelect={() => {
                      setSelection({ ...selection, [category]: item.id });
                      setSaved(false);
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mx-5 mb-5 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-4 sm:mx-7 sm:mb-7">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-500 shadow-sm">
                  <Gift size={23} />
                </span>
                <div>
                  <p className="text-sm font-bold">
                    Your next look is just 2 days away
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Reach a 14-day streak to unlock 5 new items. Keep showing
                    up!
                  </p>
                </div>
              </div>
              <progress
                aria-label="Streak toward next reward"
                value={student.streak}
                max={14}
                className="mt-4 h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-indigo-100 [&::-webkit-progress-value]:bg-indigo-400 [&::-moz-progress-bar]:bg-indigo-400"
              />
              <div className="mt-1 flex justify-between text-xs font-medium text-indigo-600">
                <span>12 days strong</span>
                <span>14-day reward</span>
              </div>
            </div>
          </section>
        </div>
        <footer className="mt-8 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-500 sm:gap-5">
            {[
              { icon: BookOpen, label: 'Study a little' },
              { icon: Flame, label: 'Build your streak' },
              { icon: Gift, label: 'Unlock rewards' },
              { icon: Sparkles, label: 'Make it yours' },
            ].map(({ icon: Icon, label }, index) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <Icon size={15} className="text-indigo-400" />
                  {label}
                </span>
                {index < 3 && (
                  <ArrowRight size={13} className="text-slate-300" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">
            Then keep learning. Your next favorite look is ahead.
          </p>
          <p className="mt-5 text-center text-xs text-slate-400">
            Avatars by{' '}
            <a
              href="https://www.dicebear.com/styles/avataaars/"
              className="underline hover:text-indigo-600"
            >
              DiceBear / Avataaars
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
};
