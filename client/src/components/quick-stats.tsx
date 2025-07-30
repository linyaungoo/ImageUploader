interface QuickStatsProps {
  totalDraws: number;
  lastUpdateTime: string;
}

export default function QuickStats({ totalDraws, lastUpdateTime }: QuickStatsProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
      <h4 className="font-semibold text-gray-dark mb-3" data-testid="text-stats-title">
        Today's Summary
      </h4>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-light rounded-lg p-3">
          <p className="text-2xl font-bold text-success" data-testid="text-total-draws">
            {totalDraws}
          </p>
          <p className="text-xs text-gray-medium">Total Draws</p>
        </div>
        <div className="bg-gray-light rounded-lg p-3">
          <p className="text-2xl font-bold text-coral" data-testid="text-last-update">
            {lastUpdateTime.replace(' PM', '').replace(' AM', '')}
          </p>
          <p className="text-xs text-gray-medium">Last Update</p>
        </div>
      </div>
    </div>
  );
}
