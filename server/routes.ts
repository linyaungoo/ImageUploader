import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLotteryResultSchema, insertAppSettingsSchema } from "@shared/schema";
import { thaiStockAPI } from "./thaistock-api";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all lottery results
  app.get("/api/lottery-results", async (req, res) => {
    try {
      const results = await storage.getLotteryResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lottery results" });
    }
  });

  // Get lottery results by type (2D or 3D)
  app.get("/api/lottery-results/:type", async (req, res) => {
    try {
      const { type } = req.params;
      if (type !== "2D" && type !== "3D") {
        return res.status(400).json({ message: "Invalid result type" });
      }
      const results = await storage.getLotteryResultsByType(type);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lottery results" });
    }
  });

  // Get lottery results by date
  app.get("/api/lottery-results/date/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const results = await storage.getLotteryResultsByDate(date);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lottery results" });
    }
  });

  // Create a new lottery result
  app.post("/api/lottery-results", async (req, res) => {
    try {
      const validatedData = insertLotteryResultSchema.parse(req.body);
      const result = await storage.createLotteryResult(validatedData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create lottery result" });
      }
    }
  });

  // Update a lottery result
  app.patch("/api/lottery-results/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const result = await storage.updateLotteryResult(id, updates);
      if (!result) {
        return res.status(404).json({ message: "Lottery result not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lottery result" });
    }
  });

  // Get app settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAppSettings();
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update app settings
  app.patch("/api/settings", async (req, res) => {
    try {
      const updates = req.body;
      const settings = await storage.updateAppSettings(updates);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Refresh lottery results (fetch real data from Thai Stock API)
  app.post("/api/lottery-results/refresh", async (req, res) => {
    try {
      const liveData = await thaiStockAPI.getLiveData();
      
      if (!liveData) {
        return res.status(500).json({ message: "Failed to fetch live data from Thai Stock API" });
      }

      // Convert API data to our format
      const newResults = thaiStockAPI.convertToLotteryResults(liveData);
      
      // Clear existing results for today and add new ones
      const today = new Date().toISOString().split('T')[0];
      const existingResults = await storage.getLotteryResults();
      const todayResults = existingResults.filter(r => r.drawDate === today);
      
      // Remove old results for today
      for (const result of todayResults) {
        await storage.updateLotteryResult(result.id, { isLoading: true });
      }

      // Add new results from API
      for (const result of newResults) {
        await storage.createLotteryResult({
          drawTime: result.drawTime,
          drawDate: result.drawDate,
          resultType: result.resultType,
          set: result.set,
          value: result.value,
          result2D: result.result2D,
          modern: result.modern,
          internet: result.internet,
          tw: result.tw,
          isLoading: false,
        });
      }

      const updatedResults = await storage.getLotteryResultsByDate(today);
      res.json(updatedResults);
    } catch (error) {
      console.error("Refresh error:", error);
      res.status(500).json({ message: "Failed to refresh results" });
    }
  });

  // Get live data from Thai Stock API
  app.get("/api/thai-stock/live", async (req, res) => {
    try {
      const liveData = await thaiStockAPI.getLiveData();
      if (!liveData) {
        return res.status(500).json({ message: "Failed to fetch live data" });
      }
      res.json(liveData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live data" });
    }
  });

  // Get 2D results from Thai Stock API with caching
  app.get("/api/thai-stock/2d-results", async (req, res) => {
    try {
      const { date } = req.query;
      const dateStr = date as string;
      
      // Check cache first
      if (dateStr) {
        const cachedData = await storage.getCachedHistoricalData(dateStr);
        if (cachedData) {
          return res.json(cachedData);
        }
      }
      
      const results = await thaiStockAPI.get2DResults(dateStr);
      if (!results) {
        return res.status(500).json({ message: "Failed to fetch 2D results" });
      }
      
      // Cache the results
      if (dateStr) {
        await storage.cacheHistoricalData(dateStr, results);
      }
      
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch 2D results" });
    }
  });

  // Get history from Thai Stock API  
  app.get("/api/thai-stock/history", async (req, res) => {
    try {
      const { date } = req.query;
      const history = await thaiStockAPI.getHistory(date as string);
      if (!history) {
        return res.status(500).json({ message: "Failed to fetch history" });
      }
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
