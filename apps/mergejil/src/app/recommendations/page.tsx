import React from 'react';

export const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-8 font-sans">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">
            +Mergejil.mn
          </div>
        </div>
        <nav className="flex space-x-2 bg-gray-100 p-1 rounded-xl text-sm font-medium">
          <button className="text-gray-600 hover:bg-white px-4 py-2 rounded-lg transition">
            profile
          </button>
          <button className="text-gray-600 hover:bg-white px-4 py-2 rounded-lg transition">
            mergejluud
          </button>
          <button className="text-gray-600 hover:bg-white px-4 py-2 rounded-lg transition">
            bolovsrol
          </button>
          <button className="text-gray-600 hover:bg-white px-5 py-2 rounded-lg transition">
            roadmap
          </button>
        </nav>
        <div className="flex items-center space-x-3 text-sm">
          <span className="bg-amber-100 text-amber-700 font-semibold px-3 py-1.5 rounded-full">
            370xp
          </span>
          <button className="text-gray-500 hover:text-gray-700">
            huwaaltsah
          </button>
          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
            {' '}
            tuluw
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-extrabold">ISTJ</h1>
                <span className="">Strategy</span>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                brain
              </div>
            </div>
            <p className="text-xm text-blue-100 mb-6 max-w-xl">
              Системчилсэн үйл ажиллагааг эрхэмлэдэг, хариуцлагатай, зорилгодоо
              үнэнч нэгэн.
            </p>
            <div className="space-y-4"></div>
            <div className="flex justify-between text-xs mb-1">
              <span>introver -785</span>
              <span>extrover -444</span>
            </div>
            <div className="w-full bg-blue-900/40 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: '78%' }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span>observing 62</span>
            <span>intutive 38</span>
          </div>
          <div className="w-full bg-blue-900/40 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full"
              style={{ width: '62%' }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span>thining 81</span>
          <span>feeling 19</span>
        </div>
        <div className="w-full bg-blue-900/40 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full"
            style={{ width: '81%' }}
          ></div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>judging 25</span>
            <span>prospecting 75</span>
          </div>
          <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
