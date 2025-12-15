import { eventBus } from "../../libs/eventBus";
import { ShortVideoService } from "./short.service";

const service = new ShortVideoService();
eventBus.on(
  "liveSession.ended",
  async (event: { sessionId: string; endedAt: Date }) => {
    console.log("🎬 Live Ended → Create ShortVideo Job");
    const shortVideo = await service.createFromLive(event.sessionId);
    console.log("📥 Added JOB on Queue:", shortVideo.id);
  }
);
