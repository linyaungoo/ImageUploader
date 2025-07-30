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

  const { data: lotteryResults = [], isLoading: resultsLoading } = useQuery<LotteryResult[]>({
    queryKey: ["/api/lottery-results", currentView],
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

  const handleDismissNotification = () => {
    setShowNotification(false);
  };

  // Filter results by current view and today's date
  const todayResults = lotteryResults.filter(result => {
    const today = new Date().toISOString().split('T')[0];
    return result.resultType === currentView && result.drawDate === today;
  });

  // Get the main result (first completed result)
  const mainResult = todayResults.find(result => !result.isLoading && result.result2D);

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
    <div className="min-h-screen bg-gray-light">
      <AppHeader 
        currentView={currentView}
        onViewToggle={handleViewToggle}
      />
      
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <MainResultDisplay 
          mainNumber={mainResult?.result2D || "79"}
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

        <ActionButtons 
          onRefresh={handleRefresh}
          isRefreshing={refreshMutation.isPending}
        />

        <QuickStats 
          totalDraws={settings?.totalDrawsToday || 0}
          lastUpdateTime={mainResult?.drawTime || "12:01"}
        />
      </main>

      <FloatingNotification 
        show={showNotification}
        onDismiss={handleDismissNotification}
        message="Results Updated"
        description="Latest lottery numbers are now available"
      />
    </div>
  );
}
