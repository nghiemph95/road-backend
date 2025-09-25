# 🚀 Redis Learning Project

A comprehensive Redis learning project with TypeScript - Practical examples and easy-to-understand code to master Redis from basics to advanced concepts.

## 📋 Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
- [Examples](#examples)
- [Redis Commands](#redis-commands)
- [Best Practices](#best-practices)

## 🎯 Introduction

This project is designed to help you learn Redis practically through:

- **Concrete Examples**: Each concept has clear code examples
- **TypeScript**: Using TypeScript for type safety
- **Docker**: Easy Redis setup with Docker
- **Real-world**: Production-ready patterns and use cases

## 🛠️ Installation

### System Requirements

- Node.js >= 16
- Docker & Docker Compose
- npm or yarn

### Step 1: Clone and install dependencies

```bash
cd redis-learning
npm install
```

### Step 2: Environment configuration

```bash
cp env.example .env
```

Edit the `.env` file if needed:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Step 3: Start Redis with Docker

```bash
# Start Redis
npm run redis:start

# Check if Redis is running
npm run redis:cli
```

## 📁 Project Structure

```
redis-learning/
├── src/
│   ├── config/
│   │   └── redis.ts          # Redis connection configuration
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

## 🚀 Running the Project

### Run all examples

```bash
npm run dev
```

### Build and run production

```bash
npm run build
npm start
```

### Other commands

```bash
# View Redis CLI
npm run redis:cli

# Stop Redis
npm run redis:stop

# Clean build
npm run clean
```

## 📚 Examples

### 1. Basic Operations (`basic-operations.ts`)

Learn the most fundamental Redis operations:

- **SET/GET**: Store and retrieve data
- **EXISTS**: Check if key exists
- **DEL**: Delete key
- **EXPIRE/TTL**: Set expiration time
- **MSET/MGET**: Multiple key operations
- **INCR/DECR**: Increment/decrement numbers

```typescript
// SET/GET example
await client.set("name", "John Doe");
const name = await client.get("name");
console.log(name); // "John Doe"
```

### 2. Data Structures (`data-structures.ts`)

Explore Redis data types:

#### Lists (Ordered collections)

```typescript
// Add to the beginning of the list
await client.lPush("shopping_list", "milk", "bread");

// Get all items
const items = await client.lRange("shopping_list", 0, -1);
```

#### Sets (Unique collections)

```typescript
// Add to set
await client.sAdd("fruits", "apple", "banana", "orange");

// Check if element exists in set
const hasApple = await client.sIsMember("fruits", "apple");
```

#### Sorted Sets (Scored collections)

```typescript
// Add with scores
await client.zAdd("leaderboard", [
  { score: 100, value: "player1" },
  { score: 150, value: "player2" },
]);

// Get in descending order
const topPlayers = await client.zRevRange("leaderboard", 0, -1);
```

#### Hashes (Object key-value)

```typescript
// Set multiple fields
await client.hSet("user:1001", {
  name: "John Doe",
  email: "john@example.com",
  age: "30",
});

// Get all fields
const userData = await client.hGetAll("user:1001");
```

### 3. Caching Examples (`caching.ts`)

Learn practical caching patterns:

#### Simple Cache

```typescript
const fibonacci = async (n: number): Promise<number> => {
  const cacheKey = `fib:${n}`;

  // Check cache first
  const cached = await client.get(cacheKey);
  if (cached) return parseInt(cached);

  // Calculate and cache result
  const result = expensiveCalculation(n);
  await client.set(cacheKey, result.toString());

  return result;
};
```

#### Cache with TTL

```typescript
// Cache with 5 seconds expiration
await client.setEx("current_time", 5, new Date().toISOString());
```

#### Cache Invalidation

```typescript
// Update user and clear cache
const updateUser = async (id: number, updates: Partial<User>) => {
  // Update database
  await updateUserInDB(id, updates);

  // Invalidate cache
  await client.del(`user:${id}`);
};
```

## 🔧 Redis Commands

### Basic Commands

```bash
# Connect to Redis CLI
redis-cli

# Test connection
PING

# View all keys
KEYS *

# View server information
INFO

# Clear all data
FLUSHALL

# Exit
EXIT
```

### Useful Commands

```bash
# View memory usage
INFO memory

# View number of keys
DBSIZE

# View keys by pattern
KEYS user:*

# View TTL of key
TTL mykey

# Monitor commands real-time
MONITOR
```

## 💡 Best Practices

### 1. Naming Convention

```typescript
// ✅ Good
"user:1001:profile";
"session:abc123";
"cache:product:123";

// ❌ Avoid
"user1001";
"sessionabc123";
"cacheproduct123";
```

### 2. TTL Strategy

```typescript
// Set appropriate TTL
await client.setEx("user:1001", 3600, userData); // 1 hour
await client.setEx("product:123", 86400, productData); // 1 day
await client.setEx("session:abc", 1800, sessionData); // 30 minutes
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
// Use singleton pattern
const redis = RedisConfig.getInstance();
await redis.connect();

// Close connection when not in use
await redis.disconnect();
```

## 🐳 Docker Commands

```bash
# Start Redis
docker-compose up -d redis

# View logs
docker-compose logs redis

# Enter container
docker exec -it redis-learning-redis-1 redis-cli

# Stop Redis
docker-compose down
```

## 📖 References

- [Redis Official Documentation](https://redis.io/docs/)
- [Redis Commands](https://redis.io/commands/)
- [Redis Data Types](https://redis.io/docs/data-types/)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)

## 🤝 Contributing

If you have ideas for improvements or want to add new examples, please create an issue or pull request!

## 📄 License

MIT License - See [LICENSE](LICENSE) file for more details.

---

**Happy Learning! 🎉**

Learn Redis in a fun and effective way with TypeScript!
