import { Wifi, Battery, Calendar, MoreVertical } from "lucide-react";

interface AppHeaderProps {
  currentView: "2D" | "3D";
  onViewToggle: (view: "2D" | "3D") => void;
}

export default function AppHeader({ currentView, onViewToggle }: AppHeaderProps) {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });
  const dateString = now.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <header className="bg-golden text-gray-dark px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Status Bar Simulation */}
        <div className="flex items-center text-sm font-medium">
          <span data-testid="status-time">{timeString}</span>
          <span className="ml-2" data-testid="status-date">{dateString}</span>
          <Calendar className="ml-1 w-3 h-3" />
        </div>
        
        {/* Signal and Battery */}
        <div className="flex items-center text-sm">
          <Wifi className="mr-2 w-4 h-4" />
          <Battery className="mr-1 w-4 h-4" />
          <span>47%</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between max-w-md mx-auto mt-2">
        <div>
          <h1 className="text-xl font-bold" data-testid="app-title">Myanmar 2D</h1>
          <span className="text-xs opacity-80">v1.6.8</span>
        </div>
        
        {/* View Toggle Buttons */}
        <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
          <button 
            onClick={() => onViewToggle("2D")}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${
              currentView === "2D" 
                ? "bg-white text-coral shadow-sm" 
                : "text-white hover:bg-white hover:bg-opacity-20"
            }`}
            data-testid="button-toggle-2d"
          >
            2D
          </button>
          <button 
            onClick={() => onViewToggle("3D")}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${
              currentView === "3D" 
                ? "bg-white text-coral shadow-sm" 
                : "text-white hover:bg-white hover:bg-opacity-20"
            }`}
            data-testid="button-toggle-3d"
          >
            3D
          </button>
        </div>
        
        {/* Menu Button */}
        <button 
          className="text-gray-dark p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
          data-testid="button-menu"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
