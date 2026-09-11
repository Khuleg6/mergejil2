'use client';

import Image from 'next/image';
import { useState } from 'react';
import { avatarUrl, type Selection } from './avatar-data';

export const AvatarImage = ({
  selection,
  size = 160,
  alt = '',
}: {
  selection: Selection;
  size?: number;
  alt?: string;
}) => {
  const [failedUrl, setFailedUrl] = useState('');
  const src = avatarUrl(selection);
  if (failedUrl === src)
    return (
      <div
        className="flex aspect-square items-center justify-center rounded-2xl bg-indigo-50 p-4 text-center text-xs text-slate-500"
        role="img"
        aria-label={alt || 'Avatar preview unavailable'}
      >
        Preview unavailable.
        <br />
        Check your connection.
      </div>
    );
  return (
    <Image
      unoptimized
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailedUrl(src)}
      className="h-full w-full object-contain"
    />
  );
};
