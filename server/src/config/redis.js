import 'dotenv/config';

import {createClient} from 'redis';

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export default redisClient;
