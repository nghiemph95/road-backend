import { RedisConfig } from "../config/redis";

/**
 * Ví dụ cơ bản về các thao tác Redis
 * - SET/GET: Lưu trữ và lấy dữ liệu string
 * - EXISTS: Kiểm tra key có tồn tại
 * - DEL: Xóa key
 * - EXPIRE: Đặt thời gian hết hạn
 * - TTL: Kiểm tra thời gian còn lại
 */
export class BasicOperations {
  private redis: RedisConfig;

  constructor() {
    this.redis = RedisConfig.getInstance();
  }

  /**
   * 1. SET/GET - Thao tác cơ bản nhất
   */
  async setAndGet(): Promise<void> {
    console.log("\n=== 1. SET/GET Operations ===");

    const client = this.redis.getClient();

    // SET - Lưu dữ liệu
    await client.set("name", "Nguyễn Văn A");
    await client.set("age", "25");
    await client.set("city", "Hồ Chí Minh");

    // GET - Lấy dữ liệu
    const name = await client.get("name");
    const age = await client.get("age");
    const city = await client.get("city");

    console.log(`Name: ${name}`);
    console.log(`Age: ${age}`);
    console.log(`City: ${city}`);
  }

  /**
   * 2. EXISTS - Kiểm tra key có tồn tại
   */
  async checkExists(): Promise<void> {
    console.log("\n=== 2. EXISTS Operations ===");

    const client = this.redis.getClient();

    // Kiểm tra key tồn tại
    const nameExists = await client.exists("name");
    const emailExists = await client.exists("email");

    console.log(`Key 'name' exists: ${nameExists}`);
    console.log(`Key 'email' exists: ${emailExists}`);
  }

  /**
   * 3. DEL - Xóa key
   */
  async deleteKeys(): Promise<void> {
    console.log("\n=== 3. DEL Operations ===");

    const client = this.redis.getClient();

    // Xóa một key
    const deleted = await client.del("city");
    console.log(`Deleted 'city' key: ${deleted}`);

    // Kiểm tra lại
    const cityExists = await client.exists("city");
    console.log(`Key 'city' still exists: ${cityExists}`);
  }

  /**
   * 4. EXPIRE/TTL - Thời gian hết hạn
   */
  async expireAndTTL(): Promise<void> {
    console.log("\n=== 4. EXPIRE/TTL Operations ===");

    const client = this.redis.getClient();

    // Đặt thời gian hết hạn 10 giây
    await client.set("temp_data", "This will expire in 10 seconds");
    await client.expire("temp_data", 10);

    // Kiểm tra TTL
    const ttl = await client.ttl("temp_data");
    console.log(`TTL of 'temp_data': ${ttl} seconds`);

    // Đợi một chút và kiểm tra lại
    setTimeout(async () => {
      const ttlAfter = await client.ttl("temp_data");
      console.log(`TTL after 3 seconds: ${ttlAfter} seconds`);
    }, 3000);
  }

  /**
   * 5. MSET/MGET - Thao tác nhiều key cùng lúc
   */
  async multipleOperations(): Promise<void> {
    console.log("\n=== 5. MSET/MGET Operations ===");

    const client = this.redis.getClient();

    // MSET - Set nhiều key cùng lúc
    await client.mSet({
      "user:1:name": "Alice",
      "user:1:email": "alice@example.com",
      "user:1:age": "30",
      "user:2:name": "Bob",
      "user:2:email": "bob@example.com",
      "user:2:age": "25",
    });

    // MGET - Get nhiều key cùng lúc
    const user1Data = await client.mGet([
      "user:1:name",
      "user:1:email",
      "user:1:age",
    ]);
    const user2Data = await client.mGet([
      "user:2:name",
      "user:2:email",
      "user:2:age",
    ]);

    console.log("User 1 data:", user1Data);
    console.log("User 2 data:", user2Data);
  }

  /**
   * 6. INCR/DECR - Tăng/giảm số
   */
  async incrementDecrement(): Promise<void> {
    console.log("\n=== 6. INCR/DECR Operations ===");

    const client = this.redis.getClient();

    // Set giá trị ban đầu
    await client.set("counter", "0");

    // Tăng dần
    await client.incr("counter");
    await client.incr("counter");
    await client.incr("counter");

    let counter = await client.get("counter");
    console.log(`Counter after 3 increments: ${counter}`);

    // Giảm dần
    await client.decr("counter");
    counter = await client.get("counter");
    console.log(`Counter after 1 decrement: ${counter}`);

    // Tăng với số lượng cụ thể
    await client.incrBy("counter", 5);
    counter = await client.get("counter");
    console.log(`Counter after +5: ${counter}`);
  }

  /**
   * Chạy tất cả ví dụ
   */
  async runAllExamples(): Promise<void> {
    try {
      await this.setAndGet();
      await this.checkExists();
      await this.deleteKeys();
      await this.expireAndTTL();
      await this.multipleOperations();
      await this.incrementDecrement();

      console.log("\n✅ Tất cả ví dụ cơ bản đã hoàn thành!");
    } catch (error) {
      console.error("❌ Lỗi khi chạy ví dụ:", error);
    }
  }
}
