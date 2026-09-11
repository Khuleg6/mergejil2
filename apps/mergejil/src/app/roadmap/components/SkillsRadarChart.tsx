'use client';

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { subject: string } }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-xs">
        <p className="font-semibold text-slate-900">
          {payload[0].payload.subject}
        </p>
        <p className="text-slate-500">
          Оноо:{' '}
          <span className="font-bold text-slate-900 tabular-nums">
            {payload[0].value}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const SkillsRadarChart = ({
  data,
}: {
  data: { subject: string; value: number; fullMark: number }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        data={data}
        margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
      >
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{
            fontSize: 12,
            fill: '#64748b',
            fontWeight: 500,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          name="Ур чадвар"
          dataKey="value"
          stroke="#f5a623"
          fill="#f5a623"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
