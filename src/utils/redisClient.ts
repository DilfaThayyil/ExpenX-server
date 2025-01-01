import { createClient } from "redis";
import { REDISURL } from "../config/env";

const redisClient = createClient({
  url: REDISURL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
};

connectRedis();

export default redisClient;
