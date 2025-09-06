import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { LotteryResult } from "@shared/schema";

export default function History() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 text-white px-4 py-4 shadow-xl border-b-4 border-purple-300">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href="/">
            <button 
              className="flex items-center text-white hover:bg-white hover:bg-opacity-20 rounded-full p-3 transition-all duration-200 transform hover:scale-110"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold tracking-wide drop-shadow-lg" data-testid="text-history-title">
            Results History
          </h1>
          <div className="w-11 h-11"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Date Selector */}
        <div className="bg-gradient-to-r from-white via-purple-50 to-pink-50 rounded-2xl p-6 shadow-2xl border-2 border-purple-200">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-purple-600 mr-3" />
            <h3 className="font-bold text-purple-800 text-lg">Select Date</h3>
          </div>
          <select 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-4 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 bg-white font-semibold text-gray-800 text-lg"
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
          ) : filteredResults.length > 0 ? (
            filteredResults.map((dayResult, dayIndex) => (
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
        {filteredResults.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border border-blue-100">
            <h4 className="font-bold text-gray-800 mb-4 text-center text-lg">Daily Summary</h4>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-4 text-white shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105">
                <p className="text-3xl font-bold mb-1">
                  {(() => {
                    // Find 12:01 PM result
                    for (const day of filteredResults) {
                      const result = day.child?.find((r: any) => {
                        const time = convertTimeToDisplayFormat(r.time);
                        return time === '12:01 PM';
                      });
                      if (result) return result.twod;
                    }
                    return "--";
                  })()}
                </p>
                <p className="text-sm font-medium opacity-90">12:01 PM</p>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-4 text-white shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105">
                <p className="text-3xl font-bold mb-1">
                  {(() => {
                    // Find 4:30 PM result
                    for (const day of filteredResults) {
                      const result = day.child?.find((r: any) => {
                        const time = convertTimeToDisplayFormat(r.time);
                        return time === '4:30 PM';
                      });
                      if (result) return result.twod;
                    }
                    return "--";
                  })()}
                </p>
                <p className="text-sm font-medium opacity-90">4:30 PM</p>
              </div>
            </div>
            <div className="mt-4 text-center bg-white bg-opacity-60 rounded-lg p-2">
              <p className="text-sm text-gray-600 font-medium">
                📅 Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}