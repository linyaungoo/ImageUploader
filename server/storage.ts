import { type LotteryResult, type InsertLotteryResult, type AppSettings, type InsertAppSettings } from "@shared/schema";
import { randomUUID } from "crypto";
import { thaiStockAPI } from "./thaistock-api";

export interface IStorage {
  // Lottery results methods
  getLotteryResults(): Promise<LotteryResult[]>;
  getLotteryResultsByType(resultType: string): Promise<LotteryResult[]>;
  getLotteryResultsByDate(date: string): Promise<LotteryResult[]>;
  createLotteryResult(result: InsertLotteryResult): Promise<LotteryResult>;
  updateLotteryResult(id: string, updates: Partial<LotteryResult>): Promise<LotteryResult | undefined>;
  
  // Historical data caching methods
  cacheHistoricalData(date: string, data: any): Promise<void>;
  getCachedHistoricalData(date: string): Promise<any | undefined>;
  
  // App settings methods
  getAppSettings(): Promise<AppSettings | undefined>;
  updateAppSettings(updates: Partial<AppSettings>): Promise<AppSettings>;
}

export class MemStorage implements IStorage {
  private lotteryResults: Map<string, LotteryResult>;
  private historicalDataCache: Map<string, any>;
  private appSettings: AppSettings | undefined;

  constructor() {
    this.lotteryResults = new Map();
    this.historicalDataCache = new Map();
    this.appSettings = undefined;
    this.initializeData();
  }

  private async initializeData() {
    const today = new Date().toISOString().split('T')[0];
    
    // Initialize app settings
    this.appSettings = {
      id: randomUUID(),
      currentView: "2D",
      lastUpdate: new Date(),
      totalDrawsToday: 4,
    };

    // Try to fetch real data from Thai Stock API
    try {
      const liveData = await thaiStockAPI.getLiveData();
      if (liveData) {
        const realResults = thaiStockAPI.convertToLotteryResults(liveData);
        realResults.forEach(result => {
          this.lotteryResults.set(result.id, result);
        });
        console.log("Initialized with real Thai Stock 2D data");
        return;
      }
    } catch (error) {
      console.warn("Failed to fetch initial data from Thai Stock API, using fallback:", error);
    }

    // Fallback: Initialize with expected draw times (but no data)
    const drawTimes = ["11:00 AM", "12:01 PM", "3:00 PM", "4:30 PM"];
    drawTimes.forEach((time, index) => {
      const result: LotteryResult = {
        id: randomUUID(),
        drawTime: time,
        drawDate: today,
        resultType: "2D",
        set: null,
        value: null,
        result2D: null,
        modern: null,
        internet: null,
        tw: null,
        isLoading: true,
        createdAt: new Date(),
      };
      this.lotteryResults.set(result.id, result);
    });
  }



  async getLotteryResults(): Promise<LotteryResult[]> {
    return Array.from(this.lotteryResults.values()).sort((a, b) => 
      new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime()
    );
  }

  async getLotteryResultsByType(resultType: string): Promise<LotteryResult[]> {
    const results = await this.getLotteryResults();
    return results.filter(result => result.resultType === resultType);
  }

  async getLotteryResultsByDate(date: string): Promise<LotteryResult[]> {
    const results = await this.getLotteryResults();
    return results.filter(result => result.drawDate === date);
  }

  async createLotteryResult(insertResult: InsertLotteryResult): Promise<LotteryResult> {
    const id = randomUUID();
    const result: LotteryResult = { 
      id,
      drawTime: insertResult.drawTime,
      drawDate: insertResult.drawDate,
      resultType: insertResult.resultType,
      set: insertResult.set || null,
      value: insertResult.value || null,
      result2D: insertResult.result2D || null,
      modern: insertResult.modern || null,
      internet: insertResult.internet || null,
      tw: insertResult.tw || null,
      isLoading: insertResult.isLoading || false,
      createdAt: new Date(),
    };
    this.lotteryResults.set(id, result);
    return result;
  }

  async updateLotteryResult(id: string, updates: Partial<LotteryResult>): Promise<LotteryResult | undefined> {
    const existing = this.lotteryResults.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.lotteryResults.set(id, updated);
    return updated;
  }

  async getAppSettings(): Promise<AppSettings | undefined> {
    return this.appSettings;
  }

  async cacheHistoricalData(date: string, data: any): Promise<void> {
    this.historicalDataCache.set(date, data);
  }

  async getCachedHistoricalData(date: string): Promise<any | undefined> {
    return this.historicalDataCache.get(date);
  }

  async updateAppSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    if (!this.appSettings) {
      this.appSettings = {
        id: randomUUID(),
        currentView: "2D",
        lastUpdate: new Date(),
        totalDrawsToday: 0,
        ...updates,
      };
    } else {
      this.appSettings = { ...this.appSettings, ...updates, lastUpdate: new Date() };
    }
    return this.appSettings;
  }
}

export const storage = new MemStorage();
