import redis from "./redisClient.js";

const MAX_ACTIONS = 10; // número máximo de ações por usuário

export async function recordUserAction(userId, action) {
    const key = `user:${userId}:actions`;
    const timestamp = new Date().toISOString();
    const value = JSON.stringify({ action, timestamp });

    await redis.lpush(key, value);
    await redis.ltrim(key, 0, MAX_ACTIONS - 1);
    await redis.expire(key, 60 * 60 * 24 * 7); // expira em 7 dias
}

export async function getUserRecentActions(userId) {
    const key = `user:${userId}:actions`;
    const items = await redis.lrange(key, 0, -1);
    return items.map((i) => JSON.parse(i));
}
