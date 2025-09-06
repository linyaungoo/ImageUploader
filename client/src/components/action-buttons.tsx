import { History } from "lucide-react";
import { Link } from "wouter";

interface ActionButtonsProps {}

export default function ActionButtons({}: ActionButtonsProps) {
  return (
    <div className="flex pt-4">
      <Link href="/history">
        <button 
          className="w-full bg-white text-gray-dark py-3 px-6 rounded-xl font-semibold shadow-lg border border-gray-300 hover:bg-gray-50 transform transition-all duration-200 hover:scale-105 active:scale-95"
          data-testid="button-history"
        >
          <History className="mr-2 w-4 h-4 inline" />
          History
        </button>
      </Link>
    </div>
  );
}
