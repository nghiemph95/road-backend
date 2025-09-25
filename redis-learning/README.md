# 🚀 Redis Learning Project

Dự án học Redis với TypeScript - Các ví dụ thực tế và dễ hiểu để nắm vững Redis từ cơ bản đến nâng cao.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Cài đặt](#cài-đặt)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Chạy dự án](#chạy-dự-án)
- [Các ví dụ](#các-ví-dụ)
- [Redis Commands](#redis-commands)
- [Best Practices](#best-practices)

## 🎯 Giới thiệu

Dự án này được thiết kế để giúp bạn học Redis một cách thực tế thông qua:

- **Ví dụ cụ thể**: Mỗi concept đều có ví dụ code rõ ràng
- **TypeScript**: Sử dụng TypeScript để có type safety
- **Docker**: Chạy Redis dễ dàng với Docker
- **Thực tế**: Các pattern và use case thực tế trong production

## 🛠️ Cài đặt

### Yêu cầu hệ thống

- Node.js >= 16
- Docker & Docker Compose
- npm hoặc yarn

### Bước 1: Clone và cài đặt dependencies

```bash
cd redis-learning
npm install
```

### Bước 2: Cấu hình môi trường

```bash
cp env.example .env
```

Chỉnh sửa file `.env` nếu cần:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Bước 3: Khởi động Redis với Docker

```bash
# Khởi động Redis
npm run redis:start

# Kiểm tra Redis đang chạy
npm run redis:cli
```

## 📁 Cấu trúc dự án

```
redis-learning/
├── src/
│   ├── config/
│   │   └── redis.ts          # Cấu hình Redis connection
│   ├── examples/
│   │   ├── basic-operations.ts    # SET/GET, EXISTS, DEL, EXPIRE
│   │   ├── data-structures.ts     # Lists, Sets, Sorted Sets, Hashes
│   │   └── caching.ts             # Cache patterns, TTL, Invalidation
│   └── index.ts              # Entry point
├── docker/
│   ├── docker-compose.yml    # Redis container setup
│   └── redis.conf           # Redis configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Chạy dự án

### Chạy tất cả ví dụ

```bash
npm run dev
```

### Build và chạy production

```bash
npm run build
npm start
```

### Các lệnh khác

```bash
# Xem Redis CLI
npm run redis:cli

# Dừng Redis
npm run redis:stop

# Clean build
npm run clean
```

## 📚 Các ví dụ

### 1. Basic Operations (`basic-operations.ts`)

Học các thao tác cơ bản nhất của Redis:

- **SET/GET**: Lưu trữ và lấy dữ liệu
- **EXISTS**: Kiểm tra key có tồn tại
- **DEL**: Xóa key
- **EXPIRE/TTL**: Đặt thời gian hết hạn
- **MSET/MGET**: Thao tác nhiều key cùng lúc
- **INCR/DECR**: Tăng/giảm số

```typescript
// Ví dụ SET/GET
await client.set("name", "Nguyễn Văn A");
const name = await client.get("name");
console.log(name); // "Nguyễn Văn A"
```

### 2. Data Structures (`data-structures.ts`)

Khám phá các kiểu dữ liệu của Redis:

#### Lists (Danh sách có thứ tự)

```typescript
// Thêm vào đầu danh sách
await client.lPush("shopping_list", "milk", "bread");

// Lấy tất cả items
const items = await client.lRange("shopping_list", 0, -1);
```

#### Sets (Tập hợp không trùng lặp)

```typescript
// Thêm vào set
await client.sAdd("fruits", "apple", "banana", "orange");

// Kiểm tra phần tử có trong set
const hasApple = await client.sIsMember("fruits", "apple");
```

#### Sorted Sets (Tập hợp có điểm số)

```typescript
// Thêm với điểm số
await client.zAdd("leaderboard", [
  { score: 100, value: "player1" },
  { score: 150, value: "player2" },
]);

// Lấy theo thứ tự giảm dần
const topPlayers = await client.zRevRange("leaderboard", 0, -1);
```

#### Hashes (Object key-value)

```typescript
// Set nhiều field
await client.hSet("user:1001", {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  age: "30",
});

// Lấy tất cả fields
const userData = await client.hGetAll("user:1001");
```

### 3. Caching Examples (`caching.ts`)

Học các pattern caching thực tế:

#### Cache đơn giản

```typescript
const fibonacci = async (n: number): Promise<number> => {
  const cacheKey = `fib:${n}`;

  // Kiểm tra cache trước
  const cached = await client.get(cacheKey);
  if (cached) return parseInt(cached);

  // Tính toán và cache kết quả
  const result = expensiveCalculation(n);
  await client.set(cacheKey, result.toString());

  return result;
};
```

#### Cache với TTL

```typescript
// Cache với thời gian hết hạn 5 giây
await client.setEx("current_time", 5, new Date().toISOString());
```

#### Cache Invalidation

```typescript
// Cập nhật user và xóa cache
const updateUser = async (id: number, updates: Partial<User>) => {
  // Cập nhật database
  await updateUserInDB(id, updates);

  // Invalidate cache
  await client.del(`user:${id}`);
};
```

## 🔧 Redis Commands

### Các lệnh cơ bản

```bash
# Kết nối Redis CLI
redis-cli

# Kiểm tra kết nối
PING

# Xem tất cả keys
KEYS *

# Xem thông tin server
INFO

# Xóa tất cả dữ liệu
FLUSHALL

# Thoát
EXIT
```

### Các lệnh hữu ích

```bash
# Xem memory usage
INFO memory

# Xem số lượng keys
DBSIZE

# Xem keys theo pattern
KEYS user:*

# Xem TTL của key
TTL mykey

# Monitor commands real-time
MONITOR
```

## 💡 Best Practices

### 1. Naming Convention

```typescript
// ✅ Tốt
"user:1001:profile";
"session:abc123";
"cache:product:123";

// ❌ Tránh
"user1001";
"sessionabc123";
"cacheproduct123";
```

### 2. TTL Strategy

```typescript
// Đặt TTL phù hợp
await client.setEx("user:1001", 3600, userData); // 1 giờ
await client.setEx("product:123", 86400, productData); // 1 ngày
await client.setEx("session:abc", 1800, sessionData); // 30 phút
```

### 3. Error Handling

```typescript
try {
  const result = await client.get("key");
  if (result) {
    return JSON.parse(result);
  }
} catch (error) {
  console.error("Redis error:", error);
  // Fallback to database
  return await getFromDatabase();
}
```

### 4. Connection Management

```typescript
// Sử dụng singleton pattern
const redis = RedisConfig.getInstance();
await redis.connect();

// Đóng kết nối khi không dùng
await redis.disconnect();
```

## 🐳 Docker Commands

```bash
# Khởi động Redis
docker-compose up -d redis

# Xem logs
docker-compose logs redis

# Vào container
docker exec -it redis-learning-redis-1 redis-cli

# Dừng Redis
docker-compose down
```

## 📖 Tài liệu tham khảo

- [Redis Official Documentation](https://redis.io/docs/)
- [Redis Commands](https://redis.io/commands/)
- [Redis Data Types](https://redis.io/docs/data-types/)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)

## 🤝 Đóng góp

Nếu bạn có ý tưởng cải thiện hoặc thêm ví dụ mới, hãy tạo issue hoặc pull request!

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

**Happy Learning! 🎉**

Học Redis một cách vui vẻ và hiệu quả với TypeScript!
