/**
 * Redis Service - Graceful caching with fallback
 *
 * When Redis is not available, all cache operations become no-ops.
 * This allows the app to work without Redis installed.
 *
 * @see docs/ARCHITECTURE.md for caching flow
 */

import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType | null = null;
  private connected = false;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const url = this.configService.get<string>('REDIS_URL');
      if (!url) {
        this.logger.warn('REDIS_URL not set — caching disabled');
        return;
      }
      this.client = createClient({ url });
      this.client.on('error', (err) => {
        this.logger.warn(`Redis error: ${err.message}`);
        this.connected = false;
      });
      await this.client.connect();
      this.connected = true;
      this.logger.log('Redis connected');
    } catch (err: any) {
      this.logger.warn(`Redis not available — caching disabled: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.client && this.connected) {
      await this.client.disconnect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.connected || !this.client) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttl = 300): Promise<void> {
    if (!this.connected || !this.client) return;
    try {
      await this.client.set(key, JSON.stringify(value), { EX: ttl });
    } catch {
      // Silently fail — app continues without cache
    }
  }

  async del(key: string): Promise<void> {
    if (!this.connected || !this.client) return;
    try {
      await this.client.del(key);
    } catch {
      // Silently fail
    }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.connected || !this.client) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch {
      // Silently fail
    }
  }
}
