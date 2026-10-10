import { NextResponse } from 'next/server';
import { sessionsMap } from '@/lib/session-store';
import { PrintItem } from '@/types/stamp';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const upperId = sessionId.toUpperCase();
  const session = sessionsMap.get(upperId);

  if (!session) {
    return NextResponse.json(
      { success: false, error: '세션을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    session,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const upperId = sessionId.toUpperCase();
  const session = sessionsMap.get(upperId);

  if (!session) {
    return NextResponse.json(
      { success: false, error: '해당 인쇄 세션이 존재하지 않습니다.' },
      { status: 404 }
    );
  }

  try {
    const itemData: Omit<PrintItem, 'id' | 'createdAt'> = await req.json();

    const newItem: PrintItem = {
      ...itemData,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      quantity: itemData.quantity || 1,
    };

    session.items.push(newItem);

    return NextResponse.json({
      success: true,
      item: newItem,
      totalCount: session.items.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '도안 제출 실패' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const upperId = sessionId.toUpperCase();

  const url = new URL(req.url);
  const itemId = url.searchParams.get('itemId');

  const session = sessionsMap.get(upperId);
  if (!session) {
    return NextResponse.json({ success: false, error: '세션 없음' }, { status: 404 });
  }

  if (itemId) {
    // 특정 아이템 삭제
    session.items = session.items.filter((it) => it.id !== itemId);
    return NextResponse.json({ success: true, remaining: session.items.length });
  } else {
    // 세션 전체 삭제
    sessionsMap.delete(upperId);
    return NextResponse.json({ success: true, deleted: true });
  }
}
