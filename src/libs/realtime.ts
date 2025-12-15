/**
 * 이 라이브를 보고있는 사람들의 전화번호(res)를 저장해둔다 = 주소록 이라고 생각하면 됨!
 */

import type { Response } from "express";

type Client = Response;

const clientBySession = new Map<string, Set<Client>>();

//새로운 구독 발생
export function addSseClient(sessionId: string, res: Response) {
    let set = clientBySession.get(sessionId);
    if (!set) {
        set = new Set();
        clientBySession.set(sessionId, set);
    }
    //res(전화번호 추가)
    set.add(res);
}

//구독 해제
export function removeSseClient(sessionId: string, res: Response) {
    const set = clientBySession.get(sessionId);
    if (set) {
        set.delete(res);
        if (set.size === 0) {
            clientBySession.delete(sessionId);
        }
    }
}

//구독자들에게 시청자 수 업데이트 알림 보내기
export function publishViewerCount(sessionId: string, viewerCount: number) {
    const set = clientBySession.get(sessionId);
    if (!set) return;
    const payload = JSON.stringify({ sessionId, viewerCount, ts: Date.now() });
    
    for(const res of set) {
        res.write('event: viewerCount\n')
        res.write(`data: ${payload}\n\n`);
    }
}   