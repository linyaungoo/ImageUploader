import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AppHeader from "@/components/app-header";
import MainResultDisplay from "@/components/main-result-display";
import ResultCard from "@/components/result-card";
import ActionButtons from "@/components/action-buttons";
import QuickStats from "@/components/quick-stats";
import FloatingNotification from "@/components/floating-notification";
import type { LotteryResult, AppSettings } from "@shared/schema";

export default function Home() {
  const [currentView, setCurrentView] = useState<"2D" | "3D">("2D");
  const [showNotification, setShowNotification] = useState(false);
  const queryClient = useQueryClient();

  const { data: lotteryResults = [], isLoading: resultsLoading, error: resultsError } = useQuery<LotteryResult[]>({
    queryKey: ["/api/lottery-results", currentView],
    refetchInterval: 60000, // Auto-refresh every minute
  });

  const { data: settings } = useQuery<AppSettings>({
    queryKey: ["/api/settings"],
  });

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/lottery-results/refresh"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lottery-results"] });
      setShowNotification(true);
    },
    onError: (error) => {
      console.error("Failed to refresh results:", error);
      // Show error notification
      setShowNotification(true);
    },
  });

  const updateViewMutation = useMutation({
    mutationFn: (view: "2D" | "3D") => 
      apiRequest("PATCH", "/api/settings", { currentView: view }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const handleViewToggle = (view: "2D" | "3D") => {
    setCurrentView(view);
    updateViewMutation.mutate(view);
  };

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  // Auto-fetch real data on component mount
  useEffect(() => {
    if (!resultsLoading && lotteryResults.length === 0) {
      // If no data exists, fetch fresh data from API
      refreshMutation.mutate();
    }
  }, [resultsLoading, lotteryResults.length]);

  const handleDismissNotification = () => {
    setShowNotification(false);
  };

  // Filter results by current view, today's date, and specific times (12:01 PM and 4:30 PM)
  const todayResults = lotteryResults.filter(result => {
    const today = new Date().toISOString().split('T')[0];
    const isToday = result.resultType === currentView && result.drawDate === today;
    
    // Only show 12:01 PM and 4:30 PM results
    const allowedTimes = ['12:01 PM', '4:30 PM'];
    const isAllowedTime = allowedTimes.includes(result.drawTime);
    
    return isToday && isAllowedTime;
  });

  // Get the main result (most recent completed result that's not "--")
  const mainResult = todayResults
    .filter(result => !result.isLoading && result.result2D && result.result2D !== "--")
    .sort((a, b) => {
      const timeA = convertTo24Hour(a.drawTime);
      const timeB = convertTo24Hour(b.drawTime);
      return timeB.localeCompare(timeA); // Most recent first
    })[0];

  // Sort results by time for display
  const sortedResults = [...todayResults].sort((a, b) => {
    const timeA = convertTo24Hour(a.drawTime);
    const timeB = convertTo24Hour(b.drawTime);
    return timeA.localeCompare(timeB);
  });

  // Helper function to convert 12-hour to 24-hour format for sorting
  function convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <AppHeader 
        currentView={currentView}
        onViewToggle={handleViewToggle}
      />
      
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <MainResultDisplay 
          mainNumber={mainResult?.result2D || "--"}
          isLoading={resultsLoading}
        />

        <div className="space-y-4" data-testid="result-cards-container">
          {sortedResults.map((result) => (
            <ResultCard 
              key={result.id}
              result={result}
            />
          ))}
        </div>

        <ActionButtons />

        <QuickStats 
          firstDraw={sortedResults[0]?.result2D || "--"}
          secondDraw={sortedResults[1]?.result2D || "--"}
          lastFetchTime={new Date().toLocaleString()}
        />
      </main>

      <FloatingNotification 
        show={showNotification}
        onDismiss={handleDismissNotification}
        message={refreshMutation.isError ? "Update Failed" : "Results Updated"}
        description={refreshMutation.isError ? "Could not fetch latest data. Please try again." : "Latest lottery numbers are now available"}
      />
    </div>
  );
}
