// userActionsService.js
import redis from "./redisClient.js";

const MAX_ACTIONS = 10; // quantas ações recentes manter por usuário

export async function recordUserAction(userId, action) {
    const key = `user:${userId}:actions`;
    const timestamp = new Date().toISOString();

    // salva a ação como JSON
    const value = JSON.stringify({ action, timestamp });

    // adiciona no início da lista
    await redis.lpush(key, value);

    // limita o tamanho da lista
    await redis.ltrim(key, 0, MAX_ACTIONS - 1);
}

export async function getUserRecentActions(userId) {
    const key = `user:${userId}:actions`;
    const items = await redis.lrange(key, 0, -1);
    return items.map((i) => JSON.parse(i));
}
