import { redis } from "./redis";

export class ViewerCounter {
  private countKey(sessionId: string) {
    return `live:session:${sessionId}:viewers`;
  }
  private viewerKey(sessionId: string, viewerId: string) {
    return `live:session:${sessionId}:viewer:${viewerId}`;
  }

  async init(sessionId: string) {
    await redis.set(this.countKey(sessionId), 0);
  }

  async join(sessionId: string, viewerId: string) {
    const viewerKey = this.viewerKey(sessionId, viewerId);
    const alreadyJoined = await redis.exists(viewerKey);
    // 이미 join 했는지 확인
    if (alreadyJoined) {
      return await this.get(sessionId);
    }
    // 처음 join
    await redis.set(viewerKey, "joined");
    return await redis.incr(this.countKey(sessionId));
  }

  async leave(sessionId: string, viewerId: string) {
    const viewerKey = this.viewerKey(sessionId, viewerId);
    const alreadyJoined = await redis.exists(viewerKey);
    if (!alreadyJoined) {
      return await this.get(sessionId);
    }
    await redis.del(viewerKey);
    const count = await redis.decr(this.countKey(sessionId));
    return Math.max(0, count);
  }
    
  async get(sessionId: string) {
    const value = await redis.get(this.countKey(sessionId));
    return Number(value ?? 0);
  }
  async expire(sessionId: string, seconds: number) {
    await redis.expire(this.countKey(sessionId), seconds);
  }
}

export const viewerCounter = new ViewerCounter();
