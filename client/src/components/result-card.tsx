import type { LotteryResult } from "@shared/schema";

interface ResultCardProps {
  result: LotteryResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const hasTraditionalData = result.set || result.value || result.result2D;
  const hasModernData = result.modern || result.internet || result.tw;

  return (
    <div 
      className="bg-coral rounded-xl p-4 text-white shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
      data-testid={`card-result-${result.id}`}
    >
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold" data-testid={`text-time-${result.id}`}>
          {result.drawTime}
        </h3>
      </div>
      
      {hasTraditionalData && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs opacity-80 mb-1">SET</p>
            <p 
              className={`font-semibold text-sm ${result.isLoading ? 'text-golden animate-pulse' : ''}`}
              data-testid={`text-set-${result.id}`}
            >
              {result.set || "--"}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Value</p>
            <p 
              className={`font-semibold text-sm ${result.isLoading ? 'text-golden animate-pulse' : ''}`}
              data-testid={`text-value-${result.id}`}
            >
              {result.value || "--"}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">2D</p>
            <p 
              className={`font-bold text-lg ${result.isLoading ? 'text-golden animate-pulse' : 'text-golden'}`}
              data-testid={`text-2d-${result.id}`}
            >
              {result.result2D || "--"}
            </p>
          </div>
        </div>
      )}

      {hasModernData && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs opacity-80 mb-1">Modern</p>
            <p 
              className={`font-bold text-lg ${result.isLoading ? 'text-golden animate-pulse' : 'text-golden'}`}
              data-testid={`text-modern-${result.id}`}
            >
              {result.modern || "--"}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Internet</p>
            <p 
              className={`font-bold text-lg ${result.isLoading ? 'text-golden animate-pulse' : 'text-golden'}`}
              data-testid={`text-internet-${result.id}`}
            >
              {result.internet || "--"}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">TW</p>
            <p 
              className={`font-bold text-lg ${result.isLoading ? 'text-golden animate-pulse' : 'text-golden'}`}
              data-testid={`text-tw-${result.id}`}
            >
              {result.tw || "--"}
            </p>
          </div>
        </div>
      )}

      {!hasTraditionalData && !hasModernData && (
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <p className="text-xs opacity-80 mb-1">Modern</p>
            <p 
              className="font-semibold text-sm text-golden animate-pulse"
              data-testid={`text-modern-loading-${result.id}`}
            >
              --
            </p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Internet</p>
            <p 
              className="font-semibold text-sm text-golden animate-pulse"
              data-testid={`text-internet-loading-${result.id}`}
            >
              --
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
