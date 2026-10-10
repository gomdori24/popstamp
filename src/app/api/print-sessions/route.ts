import { NextResponse } from 'next/server';
import { sessionsMap, generateSessionId } from '@/lib/session-store';
import { PrintSession } from '@/types/stamp';

export async function GET() {
  const sessions = Array.from(sessionsMap.values()).map((s) => ({
    id: s.id,
    title: s.title,
    createdAt: s.createdAt,
    itemCount: s.items.length,
  }));
  return NextResponse.json({ success: true, sessions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = body.title || '새 인쇄 세션';
    const id = body.customId ? body.customId.toUpperCase().trim() : generateSessionId();

    const newSession: PrintSession = {
      id,
      title,
      createdAt: Date.now(),
      items: [],
    };

    sessionsMap.set(id, newSession);

    return NextResponse.json({
      success: true,
      session: newSession,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '세션 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
