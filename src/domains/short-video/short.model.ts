export type ShortVideoStatus = 'PENDING' |'PROCESSING' | 'READY' | 'FAILED';

export interface ShortVideo {
  id: string;
  liveSessionId: string;
    status: ShortVideoStatus;
    
    source: 'LIVE_REPLAY';//추후 다른 소스 추가 가능
    durationSec?: number;

    videoUrl?: string; //READY 상태일때 저장된 영상 URL
    thumbnailUrl?: string;
    createdAt: Date;
    updatedAt: Date;

    errorMessage?: string;//FAILED 상태일때 이유 기록

}