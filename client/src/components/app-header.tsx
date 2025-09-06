import { MoreVertical } from "lucide-react";
import APIStatusIndicator from "./api-status-indicator";

interface AppHeaderProps {
  currentView: "2D" | "3D";
  onViewToggle: (view: "2D" | "3D") => void;
}

export default function AppHeader({ currentView, onViewToggle }: AppHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 text-white px-4 py-4 shadow-xl border-b-4 border-purple-300">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-wide drop-shadow-lg" data-testid="app-title">Myanmar 2D</h1>
          <div className="flex items-center space-x-2">
            <span className="text-xs opacity-90 font-medium">v1.6.8</span>
            <APIStatusIndicator />
          </div>
        </div>
        
        {/* View Toggle Buttons */}
        <div className="flex bg-black bg-opacity-20 rounded-xl p-1 backdrop-blur-sm border border-white border-opacity-20">
          <button 
            onClick={() => onViewToggle("2D")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform ${
              currentView === "2D" 
                ? "bg-white text-purple-700 shadow-lg scale-105" 
                : "text-white hover:bg-white hover:bg-opacity-20 hover:scale-105"
            }`}
            data-testid="button-toggle-2d"
          >
            2D
          </button>
          <button 
            onClick={() => onViewToggle("3D")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform ${
              currentView === "3D" 
                ? "bg-white text-purple-700 shadow-lg scale-105" 
                : "text-white hover:bg-white hover:bg-opacity-20 hover:scale-105"
            }`}
            data-testid="button-toggle-3d"
          >
            3D
          </button>
        </div>
        
        {/* Menu Button */}
        <button 
          className="text-white p-3 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 transform hover:scale-110"
          data-testid="button-menu"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
