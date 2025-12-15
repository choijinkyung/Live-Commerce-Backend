import { Router, Response, Request } from "express";
import { LiveSessionService } from "./live.service";
import { addSseClient, removeSseClient } from "../../libs/realtime";

const liveRouter = Router();
const service = new LiveSessionService();

liveRouter.get("/", (req, res) => {
  res.json({ message: "live router good!" });
});

liveRouter.post("/sessions", async (req: Request, res: Response) => {
  const session = await service.create();
  res.status(201).json(session);
});

liveRouter.post("/sessions/:id/end", async (req: Request, res: Response) => {
  try {
    const session = await service.end(req.params.id);
    res.json(session);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

liveRouter.post("/sessions/:id/join", async (req: Request, res: Response) => {
  try {
    const viewerId = req.header("viewer-id");
    if (!viewerId) {
      return res.status(400).json({ message: "viewer-id header is required" });
    }
    const session = await service.join(req.params.id, viewerId);
    res.json(session);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

liveRouter.post("/sessions/:id/leave", async (req: Request, res: Response) => {
  try {
    const viewerId = req.header("viewer-id");
    if (!viewerId) {
      return res.status(400).json({ message: "viewer-id header is required" });
    }
    const session = await service.leave(req.params.id, viewerId);
    res.json(session);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

liveRouter.get("/sessions/:id", async (req: Request, res: Response) => {
  try {
    const session = await service.get(req.params.id);
    res.json(session);
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
});

// SSE endpoint for streaming viewer count updates
liveRouter.get("/sessions/:id/stream", async (req: Request, res: Response) => {
  const sessionId = req.params.id;
  // SSE 필수 헤더
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // (프록시가 있으면) 버퍼링 방지
  // res.setHeader('X-Accel-Buffering', 'no');

  // 첫 연결 확인용 메시지
  res.write(`event:conneted\n`);
  res.write(`data:${JSON.stringify({ sessionId })}\n\n`);

  addSseClient(sessionId, res);

  const interval = setInterval(() => {
    res.write(`event: ping\n`);
    res.write(`data: ${Date.now()}\n\n`);
  }, 15000);

  //연결 끊기면 정리
  req.on("close", () => {
    clearInterval(interval);
    //구독 해제
    removeSseClient(sessionId, res);
  });
  // In a real implementation, you would pipe the video stream to the response.
});
export default liveRouter;
