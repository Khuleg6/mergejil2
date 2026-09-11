import React from 'react';

export const MbtiCard = () => {
  return (
    <div className="bg-gradient-to-t from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-extrabold">ISTJ</h1>
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium">
          Strategy
        </span>
      </div>

      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
        🧠
      </div>
      <p className="text-sm text-blue-100 mb-6 max-w-xl">
        Системчилсэн үйл ажиллагааг эрхэмлэдэг, хариуцлагатай, зорилгодоо үнэнч
        нэгэн.
      </p>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Introvert 78%</span>
            <span>Extravert 22%</span>
          </div>
          <div className="w-full bg-blue-900/40 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full"
              style={{ width: '78%' }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Observing 62%</span>
            <span>Intuitive 38%</span>
          </div>
          <div className="w-full bg-blue-900/40 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full"
              style={{ width: '62%' }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Thinking 81%</span>
            <span>Feeling 19%</span>
          </div>
          <div className="w-full bg-blue-900/40 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full"
              style={{ width: '81%' }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Judging 75%</span>
            <span>Porspecting 25%</span>
          </div>
          <div className="w-full bg-blue-900/40 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
