import { randomUUID } from "crypto";
import { liveSessions } from "../../libs/store";
import { LiveSession } from "./live.model";
import { viewerCounter } from "../../libs/viewerCounter";
import { publishViewerCount } from "../../libs/realtime";
import { eventBus } from "../../libs/eventBus";

export class LiveSessionService {
  async create() {
    const session: LiveSession = {
      id: randomUUID(),
      status: "LIVE",
      startedAt: new Date(),
      endedAt: null,
    };

    liveSessions.set(session.id, session);
    await viewerCounter.init(session.id);

    return session;
  }

  /**
     * 라이브 종료가 이벤트여야하는 이유
     * 1. 숏폼 생성
     * 2. 리플레이 생성
     * 3. 통계 데이터 생성
     4. 알림 전송
     5. 외부 시스템 연동
     6. 리소스 정리
     7. 사용자 경험 향상
     이걸 이 서비스 하나에 넣으면 느려지고 실패전파어렵고 확장 불가함
     */
  async end(sessionId: string) {
    const session = liveSessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    if (session.status === "ENDED") {
      return session;
    }

    session.status = "ENDED";
    session.endedAt = new Date();

    eventBus.emit("liveSession.ended", {
      sessionId: session.id,
      endedAt: session.endedAt,
    });
    // -> 상태만 변경되기 때문에 라이브세션이 끝났다는 사실을 다른 기능들은 모름
    //1시간뒤 자동 삭제 (리플레이/숏폼 처리 고려)
    await viewerCounter.expire(session.id, 3600); // expire viewer count in 1 hour
    return session;
  }

  async join(sessionId: string, viewerId: string) {
    const session = liveSessions.get(sessionId);
    if (!session || session.status !== "LIVE") {
      throw new Error("Session not available");
    }
    const viewerCount = await viewerCounter.join(sessionId, viewerId); // increment viewer count in Redis
    // Notify all SSE clients about the updated viewer count
    publishViewerCount(sessionId, viewerCount);
    return { ...session, viewerCount };
  }
  async leave(sessionId: string, viewerId: string) {
    const session = liveSessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    const viewerCount = await viewerCounter.leave(sessionId, viewerId); // decrement viewer count in Redis
    publishViewerCount(sessionId, viewerCount);
    return { ...session, viewerCount };
  }
  async get(sessionId: string) {
    const session = liveSessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    const viewerCount = await viewerCounter.get(sessionId); // get viewer count from Redis
    return { ...session, viewerCount };
  }
}
