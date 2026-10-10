import { PrintItem, PrintSession } from '@/types/stamp';

declare global {
  // eslint-disable-next-line no-var
  var __printSessions: Map<string, PrintSession> | undefined;
}

if (!global.__printSessions) {
  global.__printSessions = new Map<string, PrintSession>();
}

export const sessionsMap = global.__printSessions;

/**
 * 간단한 4자리 숫자 세션 코드 생성 (예: 1234, 5678)
 */
export function generateSessionId(): string {
  // 1000 ~ 9999 중 중복되지 않는 4자리 숫자
  let code = Math.floor(1000 + Math.random() * 9000).toString();
  let tries = 0;
  while (sessionsMap?.has(code) && tries < 20) {
    code = Math.floor(1000 + Math.random() * 9000).toString();
    tries++;
  }
  return code;
}
