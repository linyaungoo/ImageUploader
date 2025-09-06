interface QuickStatsProps {
  firstDraw: string;
  secondDraw: string;
  lastFetchTime: string;
}

export default function QuickStats({ firstDraw, secondDraw, lastFetchTime }: QuickStatsProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
      <h4 className="font-semibold text-gray-dark mb-3" data-testid="text-stats-title">
        Today's Summary
      </h4>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-light rounded-lg p-3">
          <p className="text-2xl font-bold text-success" data-testid="text-first-draw">
            {firstDraw || "--"}
          </p>
          <p className="text-xs text-gray-medium">1st Draw</p>
        </div>
        <div className="bg-gray-light rounded-lg p-3">
          <p className="text-2xl font-bold text-coral" data-testid="text-second-draw">
            {secondDraw || "--"}
          </p>
          <p className="text-xs text-gray-medium">2nd Draw</p>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-medium">
          Last fetch: {lastFetchTime}
        </p>
      </div>
    </div>
  );
}
