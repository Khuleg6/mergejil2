'use client';
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  placeholder?: string;
}

export const MBTISelect = ({
  options,
  placeholder = 'Сонгоно уу',
  className = '',
  ...props
}: NativeSelectProps) => {
  return (
    <div className="relative inline-block w-full">
      <select
        className={`w-full appearance-none rounded-xl border outline-none border-gray-300 bg-white px-4 py-2 pr-8 text-sm text-gray-700 shadow-sm focus:border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`}
        {...props}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* OS-ийн сумны икон (Custom arrow icon) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};
