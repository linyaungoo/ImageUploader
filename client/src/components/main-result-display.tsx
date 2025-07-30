import { CheckCircle } from "lucide-react";

interface MainResultDisplayProps {
  mainNumber: string;
  isLoading: boolean;
}

export default function MainResultDisplay({ mainNumber, isLoading }: MainResultDisplayProps) {
  return (
    <div className="text-center space-y-4">
      {/* Main Result Number */}
      <div className="relative">
        <h2 
          className="text-8xl font-bold text-success mb-2" 
          data-testid="text-main-result"
        >
          {isLoading ? "--" : mainNumber}
        </h2>
        
        {/* Loading Indicator */}
        <div className="flex items-center justify-center text-gray-medium text-sm">
          <CheckCircle className="text-success mr-2 w-4 h-4" />
          <span 
            className={isLoading ? "animate-pulse-slow" : ""}
            data-testid="text-update-status"
          >
            {isLoading ? "Updated: loading..." : "Updated: 2 minutes ago"}
          </span>
        </div>
      </div>
    </div>
  );
}
