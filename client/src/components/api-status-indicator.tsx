import { useQuery } from "@tanstack/react-query";
import { Wifi, WifiOff } from "lucide-react";

export default function APIStatusIndicator() {
  const { data: liveData, isError, isLoading } = useQuery({
    queryKey: ["/api/thai-stock/live"],
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1,
  });

  const isConnected = !isError && !isLoading && liveData;

  return (
    <div className="flex items-center text-xs">
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3 text-success mr-1" />
          <span className="text-success">Live</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-coral mr-1" />
          <span className="text-coral">Offline</span>
        </>
      )}
    </div>
  );
}