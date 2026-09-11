'use client';
import Image from 'next/image';
import { useState } from 'react';
import { peepsUrl, type PeepsSelection } from './options';

export const PeepsImage = ({
  selection,
  alt,
  size = 240,
}: {
  selection: PeepsSelection;
  alt: string;
  size?: number;
}) => {
  const src = peepsUrl(selection);
  const [failed, setFailed] = useState('');
  return failed === src ? (
    <div role="status" className="peeps-error">
      <p>Дүрийг ачаалж чадсангүй. Интернэт холболтоо шалгаарай.</p>
      <button
        type="button"
        className="btn outline"
        onClick={() => setFailed('')}
      >
        Дахин ачаалах
      </button>
    </div>
  ) : (
    <Image
      unoptimized
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(src)}
      className="peeps-image"
    />
  );
};
