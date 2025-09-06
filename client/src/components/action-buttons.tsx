import { History } from "lucide-react";
import { Link } from "wouter";

interface ActionButtonsProps {}

export default function ActionButtons({}: ActionButtonsProps) {
  return (
    <div className="flex pt-4">
      <Link href="/history">
        <button 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-purple-200"
          data-testid="button-history"
        >
          <History className="mr-3 w-5 h-5 inline" />
          View History
        </button>
      </Link>
    </div>
  );
}
