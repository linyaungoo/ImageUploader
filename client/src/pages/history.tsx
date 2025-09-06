import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { LotteryResult } from "@shared/schema";

export default function History() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const { data: historyResults = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/thai-stock/2d-results"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter results by selected date
  const filteredResults = historyResults.filter((dayResult: any) => 
    dayResult.date === selectedDate
  );

  const { data: allResults = [] } = useQuery<LotteryResult[]>({
    queryKey: ["/api/lottery-results", "2D"],
  });

  // Generate date options for the last 10 days
  const getDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const convertTimeToDisplayFormat = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header */}
      <header className="bg-golden text-gray-dark px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href="/">
            <button 
              className="flex items-center text-gray-dark hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold" data-testid="text-history-title">
            Results History
          </h1>
          <div className="w-9 h-9"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Date Selector */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center mb-3">
            <Calendar className="w-4 h-4 text-coral mr-2" />
            <h3 className="font-semibold text-gray-dark">Select Date</h3>
          </div>
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
            data-testid="select-history-date"
          >
            {getDateOptions().map(date => (
              <option key={date} value={date}>
                {formatDisplayDate(date)}
                {date === new Date().toISOString().split('T')[0] && " (Today)"}
              </option>
            ))}
          </select>
        </div>

        {/* History Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral mx-auto"></div>
              <p className="text-gray-medium mt-2">Loading history...</p>
            </div>
          ) : historyResults.length > 0 ? (
            historyResults.map((dayResult, dayIndex) => (
              <div key={dayIndex} className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                  <h4 className="font-semibold text-gray-dark flex items-center">
                    <TrendingUp className="w-4 h-4 text-success mr-2" />
                    {formatDisplayDate(dayResult.date || selectedDate)}
                  </h4>
                  <span className="text-xs text-gray-medium">
                    {dayResult.child?.length || 0} draws
                  </span>
                </div>
                
                {dayResult.child?.map((result: any, index: number) => (
                  <div 
                    key={index}
                    className="bg-coral rounded-xl p-4 text-white shadow-lg"
                    data-testid={`card-history-result-${index}`}
                  >
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-semibold" data-testid={`text-history-time-${index}`}>
                        {convertTimeToDisplayFormat(result.time)}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs opacity-80 mb-1">SET</p>
                        <p 
                          className="font-semibold text-sm"
                          data-testid={`text-history-set-${index}`}
                        >
                          {result.set}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80 mb-1">Value</p>
                        <p 
                          className="font-semibold text-sm"
                          data-testid={`text-history-value-${index}`}
                        >
                          {result.value}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80 mb-1">2D</p>
                        <p 
                          className="font-bold text-lg text-golden"
                          data-testid={`text-history-2d-${index}`}
                        >
                          {result.twod}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-medium mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-dark mb-2">No Results Found</h3>
              <p className="text-gray-medium">
                No lottery results available for {formatDisplayDate(selectedDate)}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {historyResults.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h4 className="font-semibold text-gray-dark mb-3">Daily Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-light rounded-lg p-3">
                <p className="text-2xl font-bold text-success">
                  {historyResults.reduce((total, day) => total + (day.child?.length || 0), 0)}
                </p>
                <p className="text-xs text-gray-medium">Total Draws</p>
              </div>
              <div className="bg-gray-light rounded-lg p-3">
                <p className="text-2xl font-bold text-coral">
                  {historyResults[0]?.child?.[historyResults[0].child.length - 1]?.twod || "--"}
                </p>
                <p className="text-xs text-gray-medium">Latest Result</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}