interface QuickStatsProps {
  firstDraw: string;
  secondDraw: string;
  lastFetchTime: string;
}

export default function QuickStats({
  firstDraw,
  secondDraw,
  lastFetchTime,
}: QuickStatsProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border border-blue-100">
      <h4
        className="font-bold text-gray-800 mb-4 text-center text-lg"
        data-testid="text-stats-title"
      >
        Summary
      </h4>
      <div className="grid grid-cols-2 gap-6 text-center">
        <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl p-4 text-white shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105">
          <p className="text-3xl font-bold mb-1" data-testid="text-first-draw">
            {firstDraw || "--"}
          </p>
          <p className="text-sm font-medium opacity-90">12:01 PM</p>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-4 text-white shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105">
          <p className="text-3xl font-bold mb-1" data-testid="text-second-draw">
            {secondDraw || "--"}
          </p>
          <p className="text-sm font-medium opacity-90">4:30 PM</p>
        </div>
      </div>
      <div className="mt-4 text-center bg-white bg-opacity-60 rounded-lg p-2">
        <p className="text-sm text-gray-600 font-medium">
          🕒 Last updated: {lastFetchTime}
        </p>
      </div>
    </div>
  );
}
