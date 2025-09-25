import { RedisConfig } from "./config/redis";
import { BasicOperations } from "./examples/basic-operations";
import { DataStructures } from "./examples/data-structures";
import { CachingExamples } from "./examples/caching";

/**
 * Main entry point cho Redis Learning Project
 * Chạy các ví dụ khác nhau để học Redis
 */
async function main() {
  console.log("🚀 Redis Learning Project - Bắt đầu học Redis với TypeScript!");
  console.log("=".repeat(60));

  const redis = RedisConfig.getInstance();

  try {
    // Kết nối Redis
    console.log("📡 Đang kết nối Redis...");
    await redis.connect();

    // Test kết nối
    const pong = await redis.ping();
    console.log(`✅ Redis connection test: ${pong}`);

    // Hiển thị thông tin Redis
    const info = await redis.info();
    console.log("\n📊 Redis Server Info:");
    console.log(info.split("\n").slice(0, 10).join("\n")); // Chỉ hiển thị 10 dòng đầu

    // Menu lựa chọn
    console.log("\n🎯 Chọn ví dụ để chạy:");
    console.log("1. Basic Operations (SET/GET, EXISTS, DEL, EXPIRE)");
    console.log("2. Data Structures (Lists, Sets, Sorted Sets, Hashes)");
    console.log("3. Caching Examples (Cache patterns, TTL, Invalidation)");
    console.log("4. Chạy tất cả ví dụ");
    console.log("5. Thoát");

    // Để đơn giản, chạy tất cả ví dụ
    console.log("\n🔄 Chạy tất cả ví dụ...");

    // 1. Basic Operations
    console.log("\n" + "=".repeat(60));
    console.log("📚 PHẦN 1: BASIC OPERATIONS");
    console.log("=".repeat(60));
    const basicOps = new BasicOperations();
    await basicOps.runAllExamples();

    // 2. Data Structures
    console.log("\n" + "=".repeat(60));
    console.log("📚 PHẦN 2: DATA STRUCTURES");
    console.log("=".repeat(60));
    const dataStructures = new DataStructures();
    await dataStructures.runAllExamples();

    // 3. Caching
    console.log("\n" + "=".repeat(60));
    console.log("📚 PHẦN 3: CACHING EXAMPLES");
    console.log("=".repeat(60));
    const caching = new CachingExamples();
    await caching.runAllExamples();

    console.log("\n" + "=".repeat(60));
    console.log("🎉 HOÀN THÀNH! Tất cả ví dụ đã được chạy thành công!");
    console.log("=".repeat(60));

    // Hiển thị thống kê
    const finalInfo = await redis.info();
    const memoryInfo = finalInfo
      .split("\n")
      .find((line) => line.startsWith("used_memory_human"));
    console.log(`\n💾 Memory usage: ${memoryInfo}`);
  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    // Đóng kết nối
    console.log("\n🔌 Đang đóng kết nối Redis...");
    await redis.disconnect();
    console.log("✅ Đã đóng kết nối Redis");
  }
}

// Xử lý lỗi không bắt được
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Chạy chương trình
if (require.main === module) {
  main().catch(console.error);
}

export { RedisConfig, BasicOperations, DataStructures, CachingExamples };
