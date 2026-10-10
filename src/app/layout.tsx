import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '스탬프 도안 생성기 | 나만의 도장 & 인쇄 취합 플랫폼',
  description: '그림이나 사진으로 도장 제작용 흑백 도안을 만들고, 서명인·결재인 생성 및 실시간 인쇄 취합을 지원합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Serif+KR:wght@700;900&family=Jua&family=Do+Hyeon&family=Nanum+Brush+Script&display=swap"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
