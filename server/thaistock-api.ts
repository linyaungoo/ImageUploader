import type { LotteryResult } from "@shared/schema";

export interface ThaiStockLiveData {
  live: {
    set: string;
    value: string;
    time: string;
    twod: string;
  };
  result: Array<{
    set: string;
    value: string;
    open_time: string;
    twod: string;
  }>;
}

export interface ThaiStock2DResult {
  time: string;
  set: string;
  value: string;
  twod: string;
}

export interface ThaiStockDateResult {
  date: string;
  child: ThaiStock2DResult[];
}

export class ThaiStockAPIService {
  private readonly baseURL = "https://api.thaistock2d.com";

  async getLiveData(): Promise<ThaiStockLiveData | null> {
    try {
      const response = await fetch(`${this.baseURL}/live`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch live data:", error);
      return null;
    }
  }

  async get2DResults(date?: string): Promise<ThaiStockDateResult[] | null> {
    try {
      // For now, always use the last 10 days endpoint since specific date queries seem to have issues
      // The API returns the last 10 days of data, which we can filter on the client side
      const url = `${this.baseURL}/2d_result`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // If a specific date is requested, filter the results
      if (date && Array.isArray(data)) {
        return data.filter((dayData: any) => dayData.date === date);
      }
      
      return data;
    } catch (error) {
      console.error("Failed to fetch 2D results:", error);
      return null;
    }
  }

  async getHistory(date?: string): Promise<ThaiStockDateResult[] | null> {
    try {
      const url = date 
        ? `${this.baseURL}/history?date=${date}`
        : `${this.baseURL}/history`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch history:", error);
      return null;
    }
  }

  // Convert Thai Stock API data to our app's LotteryResult format
  convertToLotteryResults(liveData: ThaiStockLiveData): LotteryResult[] {
    const results: LotteryResult[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Add final results from the result array
    liveData.result.forEach((result, index) => {
      const drawTime = this.convertTimeToDisplayFormat(result.open_time);
      
      results.push({
        id: `thai-${today}-${index}`,
        drawTime,
        drawDate: today,
        resultType: "2D",
        set: result.set,
        value: result.value,
        result2D: result.twod,
        modern: null,
        internet: null,
        tw: null,
        isLoading: false,
        createdAt: new Date(),
      });
    });

    return results;
  }

  // Convert 24-hour time to 12-hour format for display
  private convertTimeToDisplayFormat(time24: string): string {
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  }

  // Get draw times in the expected format
  getDrawTimes(): string[] {
    return [
      "11:00 AM",
      "12:01 PM", 
      "3:00 PM",
      "4:30 PM"
    ];
  }
}

export const thaiStockAPI = new ThaiStockAPIService();