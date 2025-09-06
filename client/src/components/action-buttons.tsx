import { RefreshCw, History } from "lucide-react";
import { Link } from "wouter";

interface ActionButtonsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function ActionButtons({ onRefresh, isRefreshing }: ActionButtonsProps) {
  return (
    <div className="flex space-x-4 pt-4">
      <button 
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex-1 bg-success text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-green-600 transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        data-testid="button-refresh"
      >
        <RefreshCw className={`mr-2 w-4 h-4 inline ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </button>
      <Link href="/history">
        <button 
          className="flex-1 bg-white text-gray-dark py-3 px-6 rounded-xl font-semibold shadow-lg border border-gray-300 hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 active:scale-95 w-full"
          data-testid="button-history"
        >
          <History className="mr-2 w-4 h-4 inline" />
          History
        </button>
      </Link>
    </div>
  );
}
