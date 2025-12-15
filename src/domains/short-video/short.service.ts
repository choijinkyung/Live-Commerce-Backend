import { ShortVideo } from "./short.model";
import { shortVideoQueue } from "../../libs/shortVideoQueue";
import { randomUUID } from "crypto";

const shortVideos = new Map<string, ShortVideo>();

export class ShortVideoService {
  async createFromLive(liveSessionId: string) {
    const shortVideo: ShortVideo = {
      id: randomUUID(),
      liveSessionId,
      createdAt: new Date(),
      status: "PENDING",
      source: "LIVE_REPLAY",
      updatedAt: new Date(),
    };

    //숏폼 생성 기록
    shortVideos.set(shortVideo.id, shortVideo);

    //비동기로 숏폼 생성 작업 큐에 추가
    await shortVideoQueue.add("create-short-video", { //job name
      shortVideoId: shortVideo.id,
      liveSessionId,
    });
      
      return shortVideo;
  }

  get(id: string) {
    return shortVideos.get(id);
  }
}
