import { RedisConfig } from "../config/redis";

/**
 * Ví dụ về Caching với Redis
 * - Cache đơn giản
 * - Cache với TTL
 * - Cache invalidation
 * - Cache warming
 * - Cache patterns
 */
export class CachingExamples {
  private redis: RedisConfig;

  constructor() {
    this.redis = RedisConfig.getInstance();
  }

  /**
   * 1. Cache đơn giản - Lưu trữ kết quả tính toán
   */
  async simpleCache(): Promise<void> {
    console.log("\n=== 1. Simple Cache ===");

    const client = this.redis.getClient();

    // Hàm tính toán phức tạp (giả lập)
    const expensiveCalculation = (n: number): number => {
      console.log(`  Computing fibonacci(${n})...`);
      if (n <= 1) return n;
      return expensiveCalculation(n - 1) + expensiveCalculation(n - 2);
    };

    // Hàm fibonacci với cache
    const fibonacci = async (n: number): Promise<number> => {
      const cacheKey = `fib:${n}`;

      // Kiểm tra cache trước
      const cached = await client.get(cacheKey);
      if (cached) {
        console.log(`  Cache hit for fib(${n}) = ${cached}`);
        return parseInt(cached);
      }

      // Tính toán và cache kết quả
      const result = expensiveCalculation(n);
      await client.set(cacheKey, result.toString());
      console.log(`  Cache miss for fib(${n}) = ${result}`);

      return result;
    };

    // Test cache
    console.log("First call (cache miss):");
    const result1 = await fibonacci(10);

    console.log("Second call (cache hit):");
    const result2 = await fibonacci(10);

    console.log(`Results: ${result1} = ${result2}`);
  }

  /**
   * 2. Cache với TTL - Thời gian hết hạn
   */
  async cacheWithTTL(): Promise<void> {
    console.log("\n=== 2. Cache with TTL ===");

    const client = this.redis.getClient();

    // Hàm lấy thời gian hiện tại (giả lập API call)
    const getCurrentTime = (): string => {
      console.log("  Fetching current time from API...");
      return new Date().toISOString();
    };

    // Cache với TTL 5 giây
    const getCachedTime = async (): Promise<string> => {
      const cacheKey = "current_time";

      const cached = await client.get(cacheKey);
      if (cached) {
        console.log("  Cache hit - using cached time");
        return cached;
      }

      const currentTime = getCurrentTime();
      await client.setEx(cacheKey, 5, currentTime); // TTL 5 giây
      console.log("  Cache miss - fetched new time");

      return currentTime;
    };

    // Test cache với TTL
    console.log("First call:");
    const time1 = await getCachedTime();
    console.log(`Time: ${time1}`);

    console.log("Second call (within TTL):");
    const time2 = await getCachedTime();
    console.log(`Time: ${time2}`);

    console.log("Waiting 6 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 6000));

    console.log("Third call (after TTL expired):");
    const time3 = await getCachedTime();
    console.log(`Time: ${time3}`);
  }

  /**
   * 3. Cache Invalidation - Xóa cache khi cần
   */
  async cacheInvalidation(): Promise<void> {
    console.log("\n=== 3. Cache Invalidation ===");

    const client = this.redis.getClient();

    // Giả lập user data
    interface User {
      id: number;
      name: string;
      email: string;
    }

    const users: User[] = [
      { id: 1, name: "Alice", email: "alice@example.com" },
      { id: 2, name: "Bob", email: "bob@example.com" },
    ];

    // Lấy user từ database (giả lập)
    const getUserFromDB = (id: number): User | null => {
      console.log(`  Fetching user ${id} from database...`);
      return users.find((u) => u.id === id) || null;
    };

    // Lấy user với cache
    const getUser = async (id: number): Promise<User | null> => {
      const cacheKey = `user:${id}`;

      const cached = await client.get(cacheKey);
      if (cached) {
        console.log(`  Cache hit for user ${id}`);
        return JSON.parse(cached);
      }

      const user = getUserFromDB(id);
      if (user) {
        await client.setEx(cacheKey, 300, JSON.stringify(user)); // TTL 5 phút
        console.log(`  Cache miss for user ${id}`);
      }

      return user;
    };

    // Cập nhật user và invalidate cache
    const updateUser = async (
      id: number,
      updates: Partial<User>
    ): Promise<User | null> => {
      console.log(`  Updating user ${id}...`);

      // Cập nhật trong database (giả lập)
      const userIndex = users.findIndex((u) => u.id === id);
      if (userIndex === -1) return null;

      users[userIndex] = { ...users[userIndex], ...updates };

      // Invalidate cache
      const cacheKey = `user:${id}`;
      await client.del(cacheKey);
      console.log(`  Cache invalidated for user ${id}`);

      return users[userIndex];
    };

    // Test cache invalidation
    console.log("First call - get user 1:");
    const user1 = await getUser(1);
    console.log("User 1:", user1);

    console.log("Second call - get user 1 (cache hit):");
    const user1Cached = await getUser(1);
    console.log("User 1 cached:", user1Cached);

    console.log("Update user 1:");
    const updatedUser = await updateUser(1, { name: "Alice Updated" });
    console.log("Updated user:", updatedUser);

    console.log("Third call - get user 1 (cache miss after update):");
    const user1AfterUpdate = await getUser(1);
    console.log("User 1 after update:", user1AfterUpdate);
  }

  /**
   * 4. Cache Warming - Làm nóng cache trước
   */
  async cacheWarming(): Promise<void> {
    console.log("\n=== 4. Cache Warming ===");

    const client = this.redis.getClient();

    // Giả lập danh sách sản phẩm phổ biến
    const popularProducts = [
      { id: 1, name: "iPhone 15", price: 999 },
      { id: 2, name: "Samsung Galaxy S24", price: 899 },
      { id: 3, name: "MacBook Pro", price: 1999 },
      { id: 4, name: "iPad Air", price: 599 },
      { id: 5, name: "AirPods Pro", price: 249 },
    ];

    // Lấy thông tin sản phẩm (giả lập API call)
    const getProductFromAPI = (id: number) => {
      console.log(`  Fetching product ${id} from API...`);
      return popularProducts.find((p) => p.id === id);
    };

    // Lấy sản phẩm với cache
    const getProduct = async (id: number) => {
      const cacheKey = `product:${id}`;

      const cached = await client.get(cacheKey);
      if (cached) {
        console.log(`  Cache hit for product ${id}`);
        return JSON.parse(cached);
      }

      const product = getProductFromAPI(id);
      if (product) {
        await client.setEx(cacheKey, 600, JSON.stringify(product)); // TTL 10 phút
        console.log(`  Cache miss for product ${id}`);
      }

      return product;
    };

    // Cache warming - load tất cả sản phẩm phổ biến vào cache
    const warmCache = async (): Promise<void> => {
      console.log("  Warming cache with popular products...");

      for (const product of popularProducts) {
        const cacheKey = `product:${product.id}`;
        await client.setEx(cacheKey, 600, JSON.stringify(product));
      }

      console.log(`  Cache warmed with ${popularProducts.length} products`);
    };

    // Test cache warming
    console.log("Warming cache...");
    await warmCache();

    console.log("Getting product 1 (should be cache hit):");
    const product1 = await getProduct(1);
    console.log("Product 1:", product1);

    console.log("Getting product 3 (should be cache hit):");
    const product3 = await getProduct(3);
    console.log("Product 3:", product3);
  }

  /**
   * 5. Cache Patterns - Các pattern phổ biến
   */
  async cachePatterns(): Promise<void> {
    console.log("\n=== 5. Cache Patterns ===");

    const client = this.redis.getClient();

    // Pattern 1: Cache-Aside (Lazy Loading)
    const cacheAside = async (
      key: string,
      fetchFn: () => Promise<string>
    ): Promise<string> => {
      const cached = await client.get(key);
      if (cached) {
        console.log(`  Cache-Aside: Cache hit for ${key}`);
        return cached;
      }

      const data = await fetchFn();
      await client.setEx(key, 300, data);
      console.log(`  Cache-Aside: Cache miss for ${key}`);
      return data;
    };

    // Pattern 2: Write-Through
    const writeThrough = async (key: string, value: string): Promise<void> => {
      console.log(`  Write-Through: Writing ${key} to cache and storage`);

      // Write to cache
      await client.setEx(key, 300, value);

      // Write to storage (giả lập)
      console.log(`  Write-Through: Writing ${key} to database`);
    };

    // Pattern 3: Write-Behind (Write-Back)
    const writeBehind = async (key: string, value: string): Promise<void> => {
      console.log(`  Write-Behind: Writing ${key} to cache immediately`);

      // Write to cache immediately
      await client.setEx(key, 300, value);

      // Queue for later database write (giả lập)
      console.log(`  Write-Behind: Queued ${key} for database write`);
    };

    // Test các patterns
    console.log("Testing Cache-Aside pattern:");
    const data1 = await cacheAside("test:1", async () => "Data from database");
    console.log("Result:", data1);

    console.log("Testing Write-Through pattern:");
    await writeThrough("test:2", "New data");

    console.log("Testing Write-Behind pattern:");
    await writeBehind("test:3", "Another data");
  }

  /**
   * Chạy tất cả ví dụ về caching
   */
  async runAllExamples(): Promise<void> {
    try {
      await this.simpleCache();
      await this.cacheWithTTL();
      await this.cacheInvalidation();
      await this.cacheWarming();
      await this.cachePatterns();

      console.log("\n✅ Tất cả ví dụ về caching đã hoàn thành!");
    } catch (error) {
      console.error("❌ Lỗi khi chạy ví dụ:", error);
    }
  }
}
