import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLotteryResultSchema, insertAppSettingsSchema } from "@shared/schema";
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

  // Refresh lottery results (simulate new data)
  app.post("/api/lottery-results/refresh", async (req, res) => {
    try {
      // Simulate updating loading results with actual data
      const results = await storage.getLotteryResults();
      const loadingResults = results.filter(r => r.isLoading);
      
      for (const result of loadingResults) {
        const randomNumber = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        await storage.updateLotteryResult(result.id, {
          isLoading: false,
          result2D: randomNumber,
          set: "1,456.78",
          value: "28,765.43",
        });
      }

      const updatedResults = await storage.getLotteryResults();
      res.json(updatedResults);
    } catch (error) {
      res.status(500).json({ message: "Failed to refresh results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
