import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

export class RedisConfig {
  private static instance: RedisConfig;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB || "0"),
    });

    this.setupEventListeners();
  }

  public static getInstance(): RedisConfig {
    if (!RedisConfig.instance) {
      RedisConfig.instance = new RedisConfig();
    }
    return RedisConfig.instance;
  }

  private setupEventListeners(): void {
    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    this.client.on("connect", () => {
      console.log("✅ Redis Client Connected");
    });

    this.client.on("ready", () => {
      console.log("🚀 Redis Client Ready");
    });

    this.client.on("end", () => {
      console.log("❌ Redis Client Disconnected");
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
    } catch (error) {
      console.error("Failed to disconnect from Redis:", error);
      throw error;
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public async ping(): Promise<string> {
    return await this.client.ping();
  }

  public async flushAll(): Promise<void> {
    await this.client.flushAll();
  }

  public async info(): Promise<string> {
    return await this.client.info();
  }
}
