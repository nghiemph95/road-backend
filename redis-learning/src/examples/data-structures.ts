import { RedisConfig } from "../config/redis";

/**
 * Ví dụ về các kiểu dữ liệu trong Redis
 * - Lists: Danh sách có thứ tự
 * - Sets: Tập hợp không trùng lặp
 * - Sorted Sets: Tập hợp có điểm số
 * - Hashes: Object key-value
 */
export class DataStructures {
  private redis: RedisConfig;

  constructor() {
    this.redis = RedisConfig.getInstance();
  }

  /**
   * 1. LISTS - Danh sách có thứ tự
   */
  async listOperations(): Promise<void> {
    console.log("\n=== 1. LIST Operations ===");

    const client = this.redis.getClient();

    // LPUSH - Thêm vào đầu danh sách
    await client.lPush("shopping_list", ["milk", "bread", "eggs"]);

    // RPUSH - Thêm vào cuối danh sách
    await client.rPush("shopping_list", ["cheese", "butter"]);

    // LRANGE - Lấy một phần danh sách
    const allItems = await client.lRange("shopping_list", 0, -1);
    console.log("All items:", allItems);

    // LINDEX - Lấy item tại vị trí cụ thể
    const firstItem = await client.lIndex("shopping_list", 0);
    const lastItem = await client.lIndex("shopping_list", -1);
    console.log(`First item: ${firstItem}`);
    console.log(`Last item: ${lastItem}`);

    // LLEN - Độ dài danh sách
    const length = await client.lLen("shopping_list");
    console.log(`List length: ${length}`);

    // LPOP - Lấy và xóa item đầu tiên
    const popped = await client.lPop("shopping_list");
    console.log(`Popped item: ${popped}`);

    // Lấy danh sách sau khi pop
    const afterPop = await client.lRange("shopping_list", 0, -1);
    console.log("After pop:", afterPop);
  }

  /**
   * 2. SETS - Tập hợp không trùng lặp
   */
  async setOperations(): Promise<void> {
    console.log("\n=== 2. SET Operations ===");

    const client = this.redis.getClient();

    // SADD - Thêm phần tử vào set
    await client.sAdd("fruits", "apple", "banana", "orange", "apple"); // apple chỉ được thêm 1 lần

    // SMEMBERS - Lấy tất cả phần tử
    const fruits = await client.sMembers("fruits");
    console.log("Fruits:", fruits);

    // SISMEMBER - Kiểm tra phần tử có trong set
    const hasApple = await client.sIsMember("fruits", "apple");
    const hasGrape = await client.sIsMember("fruits", "grape");
    console.log(`Has apple: ${hasApple}`);
    console.log(`Has grape: ${hasGrape}`);

    // SCARD - Số lượng phần tử
    const count = await client.sCard("fruits");
    console.log(`Number of fruits: ${count}`);

    // SREM - Xóa phần tử
    await client.sRem("fruits", "banana");
    const afterRemove = await client.sMembers("fruits");
    console.log("After removing banana:", afterRemove);

    // Tạo set thứ 2 để demo phép toán tập hợp
    await client.sAdd("citrus", "orange", "lemon", "lime");

    // SINTER - Giao của 2 set
    const intersection = await client.sInter("fruits", "citrus");
    console.log("Intersection (fruits ∩ citrus):", intersection);

    // SUNION - Hợp của 2 set
    const union = await client.sUnion("fruits", "citrus");
    console.log("Union (fruits ∪ citrus):", union);
  }

  /**
   * 3. SORTED SETS - Tập hợp có điểm số
   */
  async sortedSetOperations(): Promise<void> {
    console.log("\n=== 3. SORTED SET Operations ===");

    const client = this.redis.getClient();

    // ZADD - Thêm phần tử với điểm số
    await client.zAdd("leaderboard", [
      { score: 100, value: "player1" },
      { score: 150, value: "player2" },
      { score: 75, value: "player3" },
      { score: 200, value: "player4" },
    ]);

    // ZRANGE - Lấy theo thứ tự tăng dần
    const ascending = await client.zRange("leaderboard", 0, -1);
    console.log("Leaderboard (ascending):", ascending);

    // ZREVRANGE - Lấy theo thứ tự giảm dần
    const descending = await client.zRevRange("leaderboard", 0, -1);
    console.log("Leaderboard (descending):", descending);

    // ZRANGE WITHSCORES - Lấy kèm điểm số
    const withScores = await client.zRangeWithScores("leaderboard", 0, -1);
    console.log("Leaderboard with scores:");
    withScores.forEach((item) => {
      console.log(`  ${item.value}: ${item.score}`);
    });

    // ZRANK - Xếp hạng của phần tử
    const rank = await client.zRank("leaderboard", "player2");
    console.log(`Player2 rank: ${rank}`);

    // ZSCORE - Điểm số của phần tử
    const score = await client.zScore("leaderboard", "player2");
    console.log(`Player2 score: ${score}`);

    // ZCOUNT - Đếm phần tử trong khoảng điểm
    const count = await client.zCount("leaderboard", 100, 200);
    console.log(`Players with score 100-200: ${count}`);
  }

  /**
   * 4. HASHES - Object key-value
   */
  async hashOperations(): Promise<void> {
    console.log("\n=== 4. HASH Operations ===");

    const client = this.redis.getClient();

    // HSET - Set nhiều field trong hash
    await client.hSet("user:1001", {
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      age: "30",
      city: "Hồ Chí Minh",
    });

    // HGET - Lấy một field
    const name = await client.hGet("user:1001", "name");
    const email = await client.hGet("user:1001", "email");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);

    // HGETALL - Lấy tất cả fields
    const allFields = await client.hGetAll("user:1001");
    console.log("All user data:", allFields);

    // HKEYS - Lấy tất cả keys
    const keys = await client.hKeys("user:1001");
    console.log("Hash keys:", keys);

    // HVALS - Lấy tất cả values
    const values = await client.hVals("user:1001");
    console.log("Hash values:", values);

    // HEXISTS - Kiểm tra field có tồn tại
    const hasAge = await client.hExists("user:1001", "age");
    const hasPhone = await client.hExists("user:1001", "phone");
    console.log(`Has age field: ${hasAge}`);
    console.log(`Has phone field: ${hasPhone}`);

    // HINCRBY - Tăng giá trị số
    await client.hIncrBy("user:1001", "age", 1);
    const newAge = await client.hGet("user:1001", "age");
    console.log(`Age after increment: ${newAge}`);

    // HDEL - Xóa field
    await client.hDel("user:1001", "city");
    const afterDelete = await client.hGetAll("user:1001");
    console.log("After deleting city:", afterDelete);
  }

  /**
   * Chạy tất cả ví dụ về data structures
   */
  async runAllExamples(): Promise<void> {
    try {
      await this.listOperations();
      await this.setOperations();
      await this.sortedSetOperations();
      await this.hashOperations();

      console.log("\n✅ Tất cả ví dụ về data structures đã hoàn thành!");
    } catch (error) {
      console.error("❌ Lỗi khi chạy ví dụ:", error);
    }
  }
}
