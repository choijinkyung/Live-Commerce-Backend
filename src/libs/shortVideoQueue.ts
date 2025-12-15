import { Queue } from 'bullmq';
import { redis } from './redis';

// 숏폼 비디오 처리 큐 이름
export const SHORT_VIDEO_QUEUE_NAME = 'short-video-processing-queue';

export const shortVideoQueue = new Queue(SHORT_VIDEO_QUEUE_NAME, {
    connection: redis,
})