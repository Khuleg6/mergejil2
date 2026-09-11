'use client';
import { useState } from 'react';
import { MBTISelect } from './mbtiSelect';
import { MBTI_TYPES, MBTI_TYPE_LIST, isMbtiType, type MbtiType } from '@/lib/mbti';

interface MBTIModuleProps {
  onStartTest: () => void;
  onSubmitKnownMbti: (type: MbtiType) => void;
  questionCount: number;
}

const mbtiOptions = MBTI_TYPE_LIST.map((type) => ({
  value: type,
  label: `${type} — ${MBTI_TYPES[type].name}`,
}));

export default function MBTIModule({
  onStartTest,
  onSubmitKnownMbti,
  questionCount,
}: MBTIModuleProps) {
  const [selectedMbti, setSelectedMbti] = useState('');

  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center ">
      <div className="flex p-8 py-11 rounded-3xl gap-7 flex-col items-center justify-center bg-[linear-gradient(135deg,#1b3a6b_0%,#2d5aa0_60%,#3b6fd4_100%)] w-full max-w-xl">
        <div className="flex gap-4 w-full">
          <span className="text-3xl bg-gray-600 rounded-2xl p-3">🧬</span>
          <div className="flex flex-col">
            <span className=" font-normal text-[14px] text-gray-200  leading-7">
              МОДУЛЬ 1
            </span>
            <span className="text-white font-medium text-2xl leading-7">
              MBTI Хувийн шинж
            </span>
          </div>
        </div>
        <div>
          <span className="text-gray-200 font-thin">
            16 хувийн шинжийн загвараас өөрийнхөө төрлийг олоорой. <br />
            Сэтгэхүйн функцэд суурилсан тул асуултуудад үнэнчээр <br />
            хариулснаар таны карьерийн зам тодорхой болно.
          </span>
        </div>
        <div className="flex justify-between w-full ">
          <div className="bg-[#FFFFFF1A] flex flex-col items-center py-4 px-11 rounded-xl">
            <span className="text-lg">❓</span>
            <span className="text-white">{questionCount} асуулт</span>
          </div>
          <div className="bg-[#FFFFFF1A] flex flex-col items-center py-4 px-11 rounded-xl">
            <span className="text-lg">⏱️</span>
            <span className="text-white">~15 минут</span>
          </div>
          <div className="bg-[#FFFFFF1A] flex flex-col items-center py-4 px-11 rounded-xl">
            <span className="text-lg">🎯</span>
            <span className="text-white">16 төрөл</span>
          </div>
        </div>
        <div className="w-full">
          <button
            className="flex justify-center bg-[#f5a623] py-3.5 rounded-2xl font-bold w-full"
            onClick={onStartTest}
            type="button"
          >
            Тест эхлэх
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-move-right-icon lucide-move-right"
            >
              <path d="M18 8L22 12L18 16" />
              <path d="M2 12H22" />
            </svg>
          </button>
        </div>
      </div>
      <div className="bg-white p-5 w-full max-w-xl rounded-2xl flex gap-2 flex-col">
        <span className="font-medium">
          Та өөрийнхөө MBTI-г аль хэдийн мэдэх үү?
        </span>
        <span className="font-extralight text-xs text-[#1b3a6b]">
          Хэрэв та өөрийн MBTI төрлийг мэдэж байвал оруулж болно.
        </span>
        <div className="flex  gap-3">
          <MBTISelect
            options={mbtiOptions}
            placeholder="MBTI төрлөө сонгоно уу"
            onChange={(event) => setSelectedMbti(event.target.value)}
            value={selectedMbti}
          />
          <button
            className="bg-[#1b3a6b] text-white p-1.5 px-3 rounded-xl disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isMbtiType(selectedMbti)}
            onClick={() => {
              if (isMbtiType(selectedMbti)) onSubmitKnownMbti(selectedMbti);
            }}
            type="button"
          >
            Оруулах
          </button>
        </div>
      </div>
    </div>
  );
}
