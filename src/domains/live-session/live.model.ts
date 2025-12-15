export type LiveStatus = "LIVE" | "ENDED";

export interface LiveSession {
  id: string;
  status: LiveStatus;
  startedAt: Date;
  endedAt: Date | null;
  //   viewerCount: number | null;
}
