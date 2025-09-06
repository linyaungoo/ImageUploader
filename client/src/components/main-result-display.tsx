import { CheckCircle } from "lucide-react";

interface MainResultDisplayProps {
  mainNumber: string;
  isLoading: boolean;
}

export default function MainResultDisplay({ mainNumber, isLoading }: MainResultDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl p-10 shadow-2xl text-center border-4 border-gradient-to-r from-purple-400 to-pink-400 backdrop-blur-lg">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
        Latest Result
      </h2>
      
      {/* Main Result Number */}
      <div className="relative">
        <h2 
          className={`text-8xl font-black mb-4 transition-all duration-500 transform hover:scale-110 ${
            isLoading ? 'bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse' : 'bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent drop-shadow-lg'
          }`}
          data-testid="text-main-result"
        >
          {isLoading ? "--" : mainNumber}
        </h2>
        
        {/* Loading Indicator */}
        <div className="flex items-center justify-center text-gray-600 text-lg font-semibold">
          <CheckCircle className={`mr-3 w-5 h-5 ${isLoading ? 'text-purple-500 animate-spin' : 'text-emerald-500'}`} />
          <span 
            className={isLoading ? "animate-pulse-slow" : ""}
            data-testid="text-update-status"
          >
            {isLoading ? "🔄 Updating..." : "Live Data"}
          </span>
        </div>
      </div>
    </div>
  );
}
