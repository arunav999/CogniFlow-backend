import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Cogniflow Redis DB connected");
  } catch (error) {
    console.error("Redis connection error:", error);
    process.exit(1);
  }
};

export { redisClient, connectRedis };
