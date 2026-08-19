import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import redisClient from "./config/redis.js";

const PORT = process.env.PORT;

await connectDB();
await redisClient.connect();
console.log("Successfully connected to Databases.");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
