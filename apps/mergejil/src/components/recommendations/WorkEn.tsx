const IqScoreCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          IQ Танин мэдэхүйн оноо
        </h2>
        <p className="text-xs text-gray-400">Стандартчилсан хэмжүүрээр</p>
      </div>
      <div className="text-right">
        <span className="text-3xl font-black text-gray-800">124</span>
        <span className="block text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded mt-1">
          Өндөр
        </span>
      </div>
    </div>
    <div className="mt-8">
      <div className="h-32 flex items-end justify-between gap-4 pt-4 border-b border-gray-200">
        <div className="w-1/4 bg-blue-500 rounded-t-lg h-[80%] relative group">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">
            80
          </span>
        </div>
        <div className="w-1/4 bg-purple-500 rounded-t-lg h-[65%] relative group">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">
            65
          </span>
        </div>
        <div className="w-1/4 bg-emerald-500 rounded-t-lg h-[90%] relative group">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">
            90
          </span>
        </div>
        <div className="w-1/4 bg-amber-500 rounded-t-lg h-[50%] relative group">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">
            50
          </span>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Хэл зүй</span>
        <span>Орон зай</span>
        <span>Логик</span>
        <span>Бусад</span>
      </div>
    </div>
  </div>
);
