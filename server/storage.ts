import { type LotteryResult, type InsertLotteryResult, type AppSettings, type InsertAppSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lottery results methods
  getLotteryResults(): Promise<LotteryResult[]>;
  getLotteryResultsByType(resultType: string): Promise<LotteryResult[]>;
  getLotteryResultsByDate(date: string): Promise<LotteryResult[]>;
  createLotteryResult(result: InsertLotteryResult): Promise<LotteryResult>;
  updateLotteryResult(id: string, updates: Partial<LotteryResult>): Promise<LotteryResult | undefined>;
  
  // App settings methods
  getAppSettings(): Promise<AppSettings | undefined>;
  updateAppSettings(updates: Partial<AppSettings>): Promise<AppSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private lotteryResults: Map<string, LotteryResult>;
  private appSettings: AppSettings | undefined;

  constructor() {
    this.users = new Map();
    this.lotteryResults = new Map();
    this.appSettings = undefined;
    this.initializeData();
  }

  private initializeData() {
    const today = new Date().toISOString().split('T')[0];
    
    // Initialize app settings
    this.appSettings = {
      id: randomUUID(),
      currentView: "2D",
      lastUpdate: new Date(),
      totalDrawsToday: 4,
    };

    // Initialize some lottery results for today
    const results: LotteryResult[] = [
      {
        id: randomUUID(),
        drawTime: "12:01 PM",
        drawDate: today,
        resultType: "2D",
        set: "1,205.27",
        value: "23,339.30",
        result2D: "79",
        modern: null,
        internet: null,
        tw: null,
        isLoading: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        drawTime: "4:30 PM",
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
      },
      {
        id: randomUUID(),
        drawTime: "9:30 AM",
        drawDate: today,
        resultType: "2D",
        set: null,
        value: null,
        result2D: null,
        modern: "01",
        internet: "76",
        tw: "60",
        isLoading: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        drawTime: "2:00 PM",
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
      },
    ];

    results.forEach(result => {
      this.lotteryResults.set(result.id, result);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLotteryResults(): Promise<LotteryResult[]> {
    return Array.from(this.lotteryResults.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      ...insertResult, 
      id,
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
