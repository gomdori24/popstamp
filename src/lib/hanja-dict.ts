/**
 * 인명용 및 도장용 주요 한글 음별 한자 매핑 사전
 */
export interface HanjaEntry {
  hanja: string;
  meaning: string;
}

export const HANJA_DICTIONARY: Record<string, HanjaEntry[]> = {
  가: [
    { hanja: '佳', meaning: '아름다울 가' },
    { hanja: '嘉', meaning: '아름다울 가' },
    { hanja: '家', meaning: '집 가' },
    { hanja: '加', meaning: '더할 가' },
    { hanja: '街', meaning: '거리 가' },
  ],
  강: [
    { hanja: '姜', meaning: '성씨 강' },
    { hanja: '康', meaning: '편안할 강' },
    { hanja: '江', meaning: '강 강' },
    { hanja: '剛', meaning: '굳셀 강' },
    { hanja: '强', meaning: '강할 강' },
  ],
  건: [
    { hanja: '建', meaning: '세울 건' },
    { hanja: '健', meaning: '굳셀 건' },
    { hanja: '乾', meaning: '하늘 건' },
  ],
  경: [
    { hanja: '慶', meaning: '경사 경' },
    { hanja: '景', meaning: '볕/경치 경' },
    { hanja: '敬', meaning: '공경할 경' },
    { hanja: '庚', meaning: '별 경' },
    { hanja: '鏡', meaning: '거울 경' },
    { hanja: '卿', meaning: '벼슬 경' },
  ],
  고: [
    { hanja: '高', meaning: '높을 고' },
    { hanja: '顧', meaning: '돌아볼 고' },
    { hanja: '固', meaning: '굳을 고' },
  ],
  광: [
    { hanja: '光', meaning: '빛 광' },
    { hanja: '廣', meaning: '넓을 광' },
  ],
  교: [
    { hanja: '敎', meaning: '가르칠 교' },
    { hanja: '橋', meaning: '다리 교' },
    { hanja: '校', meaning: '학교 교' },
  ],
  구: [
    { hanja: '具', meaning: '갖출 구' },
    { hanja: '求', meaning: '구할 구' },
    { hanja: '久', meaning: '오랠 구' },
    { hanja: '九', meaning: '아홉 구' },
  ],
  국: [
    { hanja: '國', meaning: '나라 국' },
    { hanja: '菊', meaning: '국화 국' },
  ],
  권: [
    { hanja: '權', meaning: '권세 권' },
    { hanja: '勸', meaning: '권할 권' },
  ],
  규: [
    { hanja: '奎', meaning: '별 규' },
    { hanja: '圭', meaning: '홀 규' },
    { hanja: '珪', meaning: '옥 규' },
  ],
  균: [
    { hanja: '均', meaning: '고를 균' },
    { hanja: '鈞', meaning: '무게 균' },
  ],
  기: [
    { hanja: '基', meaning: '터 기' },
    { hanja: '起', meaning: '일어날 기' },
    { hanja: '杞', meaning: '구기자나무 기' },
    { hanja: '琦', meaning: '옥 기' },
    { hanja: '琪', meaning: '옥 기' },
    { hanja: '祺', meaning: '복 기' },
    { hanja: '奇', meaning: '기이할 기' },
  ],
  길: [
    { hanja: '吉', meaning: '길할 길' },
    { hanja: '桔', meaning: '도라지 길' },
  ],
  김: [
    { hanja: '金', meaning: '성씨 김 / 쇠 금' },
  ],
  나: [
    { hanja: '羅', meaning: '그물 라/나' },
    { hanja: '娜', meaning: '아리따울 나' },
  ],
  남: [
    { hanja: '南', meaning: '남녘 남' },
    { hanja: '男', meaning: '사내 남' },
  ],
  다: [
    { hanja: '多', meaning: '많을 다' },
    { hanja: '茶', meaning: '차 다' },
  ],
  단: [
    { hanja: '端', meaning: '바를 단' },
    { hanja: '丹', meaning: '붉을 단' },
  ],
  달: [
    { hanja: '達', meaning: '통달할 달' },
  ],
  대: [
    { hanja: '大', meaning: '큰 대' },
    { hanja: '代', meaning: '대신할 대' },
  ],
  덕: [
    { hanja: '德', meaning: '큰 덕' },
  ],
  도: [
    { hanja: '道', meaning: '길 도' },
    { hanja: '度', meaning: '법도 도' },
    { hanja: '導', meaning: '이끌 도' },
    { hanja: '島', meaning: '섬 도' },
    { hanja: '陶', meaning: '질그릇 도' },
  ],
  동: [
    { hanja: '東', meaning: '동녘 동' },
    { hanja: '同', meaning: '한가지 동' },
    { hanja: '童', meaning: '아이 동' },
    { hanja: '棟', meaning: '용마루 동' },
  ],
  두: [
    { hanja: '斗', meaning: '말 두' },
    { hanja: '頭', meaning: '머리 두' },
  ],
  라: [
    { hanja: '羅', meaning: '비단 라' },
  ],
  락: [
    { hanja: '樂', meaning: '즐길 락' },
  ],
  란: [
    { hanja: '蘭', meaning: '난초 란' },
  ],
  람: [
    { hanja: '藍', meaning: '쪽 람' },
    { hanja: '嵐', meaning: '남기 람' },
  ],
  련: [
    { hanja: '蓮', meaning: '연꽃 련' },
    { hanja: '連', meaning: '이을 련' },
  ],
  렴: [
    { hanja: '廉', meaning: '청렴할 렴' },
  ],
  령: [
    { hanja: '領', meaning: '거느릴 령' },
    { hanja: '令', meaning: '명령 령' },
  ],
  례: [
    { hanja: '禮', meaning: '예도 례' },
  ],
  로: [
    { hanja: '盧', meaning: '밥그릇 로' },
    { hanja: '魯', meaning: '노둔할 로' },
  ],
  록: [
    { hanja: '祿', meaning: '녹 록' },
    { hanja: '錄', meaning: '기록할 록' },
  ],
  리: [
    { hanja: '李', meaning: '오얏 리' },
    { hanja: '利', meaning: '이로울 리' },
    { hanja: '理', meaning: '다스릴 리' },
  ],
  림: [
    { hanja: '林', meaning: '수풀 림' },
  ],
  만: [
    { hanja: '萬', meaning: '일만 만' },
    { hanja: '滿', meaning: '찰 만' },
  ],
  명: [
    { hanja: '明', meaning: '밝을 명' },
    { hanja: '命', meaning: '목숨 명' },
    { hanja: '名', meaning: '이름 명' },
  ],
  모: [
    { hanja: '毛', meaning: '털 모' },
    { hanja: '謀', meaning: '꾀할 모' },
  ],
  목: [
    { hanja: '睦', meaning: '화목할 목' },
    { hanja: '木', meaning: '나무 목' },
  ],
  무: [
    { hanja: '武', meaning: '굳셀 무' },
    { hanja: '茂', meaning: '우거질 무' },
  ],
  문: [
    { hanja: '文', meaning: '글월 문' },
    { hanja: '門', meaning: '문 문' },
  ],
  미: [
    { hanja: '美', meaning: '아름다울 미' },
    { hanja: '微', meaning: '작을 미' },
  ],
  민: [
    { hanja: '敏', meaning: '민첩할 민' },
    { hanja: '民', meaning: '백성 민' },
    { hanja: '玟', meaning: '옥돌 민' },
    { hanja: '旻', meaning: '하늘 민' },
    { hanja: '旼', meaning: '화락할 민' },
  ],
  박: [
    { hanja: '朴', meaning: '순박할 박 / 성씨 박' },
    { hanja: '博', meaning: '넓을 박' },
  ],
  배: [
    { hanja: '裵', meaning: '옷자락 배 / 성씨 배' },
    { hanja: '培', meaning: '북돋울 배' },
  ],
  백: [
    { hanja: '白', meaning: '흰 백' },
    { hanja: '伯', meaning: '맏 백' },
  ],
  범: [
    { hanja: '範', meaning: '법 범' },
    { hanja: '凡', meaning: '무릇 범' },
  ],
  병: [
    { hanja: '炳', meaning: '밝을 병' },
    { hanja: '秉', meaning: '잡을 병' },
    { hanja: '昞', meaning: '밝을 병' },
  ],
  보: [
    { hanja: '普', meaning: '넓을 보' },
    { hanja: '寶', meaning: '보배 보' },
    { hanja: '輔', meaning: '도울 보' },
    { hanja: '保', meaning: '지킬 보' },
  ],
  복: [
    { hanja: '福', meaning: '복 복' },
  ],
  봉: [
    { hanja: '鳳', meaning: '봉황 봉' },
    { hanja: '奉', meaning: '받들 봉' },
  ],
  부: [
    { hanja: '富', meaning: '부유할 부' },
    { hanja: '夫', meaning: '지아비 부' },
  ],
  비: [
    { hanja: '飛', meaning: '날 비' },
    { hanja: '斐', meaning: '무늬 비' },
  ],
  빈: [
    { hanja: '彬', meaning: '빛날 빈' },
    { hanja: '斌', meaning: '빛날 빈' },
  ],
  사: [
    { hanja: '思', meaning: '생각할 사' },
    { hanja: '士', meaning: '선비 사' },
  ],
  산: [
    { hanja: '山', meaning: '뫼 산' },
    { hanja: '産', meaning: '낳을 산' },
  ],
  상: [
    { hanja: '相', meaning: '서로 상' },
    { hanja: '祥', meaning: '상서로울 상' },
    { hanja: '尙', meaning: '오히려 상' },
    { hanja: '常', meaning: '항상 상' },
  ],
  서: [
    { hanja: '瑞', meaning: '상서로울 서' },
    { hanja: '徐', meaning: '천천할 서' },
    { hanja: '署', meaning: '관청 서' },
    { hanja: '序', meaning: '차례 서' },
    { hanja: '書', meaning: '글 서' },
  ],
  석: [
    { hanja: '錫', meaning: '주석 석' },
    { hanja: '碩', meaning: '클 석' },
    { hanja: '石', meaning: '돌 석' },
  ],
  선: [
    { hanja: '善', meaning: '착할 선' },
    { hanja: '宣', meaning: '베풀 선' },
    { hanja: '仙', meaning: '신선 선' },
    { hanja: '鮮', meaning: '고울 선' },
  ],
  섭: [
    { hanja: '燮', meaning: '불꽃 섭' },
  ],
  성: [
    { hanja: '成', meaning: '이룰 성' },
    { hanja: '聖', meaning: '성스러울 성' },
    { hanja: '星', meaning: '별 성' },
    { hanja: '誠', meaning: '정성 성' },
  ],
  세: [
    { hanja: '世', meaning: '인간/대 세' },
    { hanja: '勢', meaning: '형세 세' },
  ],
  소: [
    { hanja: '昭', meaning: '밝을 소' },
    { hanja: '素', meaning: '본디 소' },
    { hanja: '笑', meaning: '웃을 소' },
  ],
  손: [
    { hanja: '孫', meaning: '손자 손' },
  ],
  송: [
    { hanja: '宋', meaning: '송나라 송' },
    { hanja: '松', meaning: '소나무 송' },
  ],
  수: [
    { hanja: '洙', meaning: '물가 수' },
    { hanja: '秀', meaning: '빼어날 수' },
    { hanja: '壽', meaning: '목숨 수' },
    { hanja: '修', meaning: '닦을 수' },
    { hanja: '樹', meaning: '나무 수' },
    { hanja: '守', meaning: '지킬 수' },
  ],
  숙: [
    { hanja: '淑', meaning: '맑을 숙' },
    { hanja: '肅', meaning: '엄숙할 숙' },
  ],
  순: [
    { hanja: '淳', meaning: '순박할 순' },
    { hanja: '純', meaning: '순수할 순' },
    { hanja: '順', meaning: '순할 순' },
    { hanja: '巡', meaning: '돌 순' },
  ],
  승: [
    { hanja: '承', meaning: '이을 승' },
    { hanja: '勝', meaning: '이길 승' },
    { hanja: '昇', meaning: '오를 승' },
  ],
  시: [
    { hanja: '時', meaning: '때 시' },
    { hanja: '始', meaning: '비로소 시' },
    { hanja: '施', meaning: '베풀 시' },
  ],
  신: [
    { hanja: '申', meaning: '납 신 / 성씨 신' },
    { hanja: '愼', meaning: '삼갈 신' },
    { hanja: '新', meaning: '새 신' },
    { hanja: '信', meaning: '믿을 신' },
    { hanja: '晨', meaning: '새벽 신' },
  ],
  심: [
    { hanja: '沈', meaning: '가라앉을 심 / 성씨 심' },
    { hanja: '心', meaning: '마음 심' },
  ],
  아: [
    { hanja: '娥', meaning: '예쁠 아' },
    { hanja: '雅', meaning: '맑을 아' },
    { hanja: '亞', meaning: '버금 아' },
  ],
  안: [
    { hanja: '安', meaning: '편안할 안' },
    { hanja: '顔', meaning: '얼굴 안' },
  ],
  양: [
    { hanja: '梁', meaning: '들보 량/양' },
    { hanja: '楊', meaning: '버들 양' },
    { hanja: '陽', meaning: '볕 양' },
  ],
  연: [
    { hanja: '然', meaning: '그러할 연' },
    { hanja: '延', meaning: '끌 연' },
    { hanja: '淵', meaning: '못 연' },
    { hanja: '演', meaning: '펼 연' },
    { hanja: '燕', meaning: '제비 연' },
  ],
  열: [
    { hanja: '烈', meaning: '매울 열' },
    { hanja: '悅', meaning: '기쁠 열' },
  ],
  영: [
    { hanja: '永', meaning: '길 영' },
    { hanja: '英', meaning: '꽃부리 영' },
    { hanja: '榮', meaning: '영화 영' },
    { hanja: '泳', meaning: '헤엄칠 영' },
    { hanja: '瑛', meaning: '옥빛 영' },
    { hanja: '映', meaning: '비칠 영' },
    { hanja: '泳', meaning: '헤엄칠 영' },
  ],
  예: [
    { hanja: '藝', meaning: '재주 예' },
    { hanja: '睿', meaning: '밝을 예' },
    { hanja: '譽', meaning: '기릴 예' },
  ],
  오: [
    { hanja: '吳', meaning: '오나라 오' },
    { hanja: '吾', meaning: '나 오' },
    { hanja: '五', meaning: '다섯 오' },
  ],
  옥: [
    { hanja: '玉', meaning: '구슬 옥' },
  ],
  온: [
    { hanja: '溫', meaning: '따뜻할 온' },
  ],
  완: [
    { hanja: '完', meaning: '완전할 완' },
    { hanja: '浣', meaning: '빨 완' },
  ],
  용: [
    { hanja: '容', meaning: '얼굴/너그러울 용' },
    { hanja: '龍', meaning: '용 룡/용' },
    { hanja: '勇', meaning: '날랠 용' },
  ],
  우: [
    { hanja: '宇', meaning: '집 우' },
    { hanja: '佑', meaning: '도울 우' },
    { hanja: '友', meaning: '벗 우' },
    { hanja: '遇', meaning: '만날 우' },
    { hanja: '雨', meaning: '비 우' },
    { hanja: '羽', meaning: '깃 우' },
  ],
  욱: [
    { hanja: '旭', meaning: '아침해 욱' },
    { hanja: '昱', meaning: '빛날 욱' },
  ],
  운: [
    { hanja: '雲', meaning: '구름 운' },
    { hanja: '運', meaning: '운전할 운' },
  ],
  원: [
    { hanja: '源', meaning: '근원 원' },
    { hanja: '元', meaning: '으뜸 원' },
    { hanja: '遠', meaning: '멀 원' },
    { hanja: '圓', meaning: '둥글 원' },
  ],
  유: [
    { hanja: '柳', meaning: '버들 류/유' },
    { hanja: '劉', meaning: '도끼 류/유' },
    { hanja: '有', meaning: '있을 유' },
    { hanja: '裕', meaning: '넉넉할 유' },
    { hanja: '柔', meaning: '부드러울 유' },
    { hanja: '維', meaning: '바를 유' },
  ],
  윤: [
    { hanja: '尹', meaning: '다스릴 윤' },
    { hanja: '潤', meaning: '윤택할 윤' },
    { hanja: '允', meaning: '진실로 윤' },
  ],
  율: [
    { hanja: '律', meaning: '법칙 률/율' },
  ],
  은: [
    { hanja: '銀', meaning: '은빛 은' },
    { hanja: '恩', meaning: '은혜 은' },
    { hanja: '殷', meaning: '성할 은' },
  ],
  을: [
    { hanja: '乙', meaning: '새 을' },
  ],
  의: [
    { hanja: '義', meaning: '옳을 의' },
    { hanja: '儀', meaning: '거동 의' },
    { hanja: '宜', meaning: '마땅할 의' },
  ],
  이: [
    { hanja: '李', meaning: '오얏 리/이' },
    { hanja: '怡', meaning: '기쁠 이' },
    { hanja: '利', meaning: '이로울 이' },
  ],
  익: [
    { hanja: '益', meaning: '더할 익' },
    { hanja: '翼', meaning: '날개 익' },
  ],
  인: [
    { hanja: '印', meaning: '도장 인' },
    { hanja: '仁', meaning: '어질 인' },
    { hanja: '寅', meaning: '동방 인' },
    { hanja: '人', meaning: '사람 인' },
    { hanja: '認', meaning: '알 인' },
  ],
  일: [
    { hanja: '一', meaning: '한 일' },
    { hanja: '日', meaning: '날 일' },
    { hanja: '逸', meaning: '편안할 일' },
  ],
  임: [
    { hanja: '林', meaning: '수풀 림/임' },
    { hanja: '任', meaning: '맡길 임' },
  ],
  자: [
    { hanja: '子', meaning: '아들 자' },
    { hanja: '慈', meaning: '사랑 자' },
  ],
  작: [
    { hanja: '作', meaning: '지을 작' },
  ],
  장: [
    { hanja: '張', meaning: '베풀 장' },
    { hanja: '長', meaning: '길 장' },
    { hanja: '章', meaning: '글월 장' },
  ],
  재: [
    { hanja: '在', meaning: '있을 재' },
    { hanja: '載', meaning: '실을 재' },
    { hanja: '宰', meaning: '재상 재' },
    { hanja: '材', meaning: '재목 재' },
    { hanja: '渽', meaning: '맑을 재' },
  ],
  전: [
    { hanja: '全', meaning: '온전할 전' },
    { hanja: '田', meaning: '밭 전' },
    { hanja: '典', meaning: '법 전' },
  ],
  정: [
    { hanja: '鄭', meaning: '나라 정' },
    { hanja: '正', meaning: '바를 정' },
    { hanja: '政', meaning: '정사 정' },
    { hanja: '廷', meaning: '조정 정' },
    { hanja: '貞', meaning: '곧을 정' },
    { hanja: '淨', meaning: '깨끗할 정' },
    { hanja: '晶', meaning: '맑을 정' },
    { hanja: '禎', meaning: '상서로울 정' },
  ],
  제: [
    { hanja: '濟', meaning: '건널 제' },
    { hanja: '第', meaning: '차례 제' },
  ],
  조: [
    { hanja: '趙', meaning: '나라 조' },
    { hanja: '曺', meaning: '무리 조' },
    { hanja: '朝', meaning: '아침 조' },
    { hanja: '祖', meaning: '할아비 조' },
  ],
  종: [
    { hanja: '宗', meaning: '마루 종' },
    { hanja: '鍾', meaning: '쇠북 종' },
    { hanja: '鐘', meaning: '종 종' },
  ],
  주: [
    { hanja: '周', meaning: '두루 주' },
    { hanja: '朱', meaning: '붉을 주' },
    { hanja: '珠', meaning: '구슬 주' },
    { hanja: '柱', meaning: '기둥 주' },
    { hanja: '主', meaning: '주인 주' },
  ],
  준: [
    { hanja: '俊', meaning: '준걸 준' },
    { hanja: '準', meaning: '평평할 준' },
    { hanja: '濬', meaning: '깊을 준' },
    { hanja: '準', meaning: '법도 준' },
  ],
  중: [
    { hanja: '中', meaning: '가운데 중' },
    { hanja: '重', meaning: '무거울 중' },
  ],
  지: [
    { hanja: '志', meaning: '뜻 지' },
    { hanja: '智', meaning: '지혜 지' },
    { hanja: '知', meaning: '알 지' },
    { hanja: '池', meaning: '못 지' },
  ],
  진: [
    { hanja: '眞', meaning: '참 진' },
    { hanja: '鎭', meaning: '진압할 진' },
    { hanja: '進', meaning: '나아갈 진' },
    { hanja: '振', meaning: '떨칠 진' },
    { hanja: '辰', meaning: '별 진' },
    { hanja: '珍', meaning: '보배 진' },
  ],
  찬: [
    { hanja: '燦', meaning: '빛날 찬' },
    { hanja: '讚', meaning: '기릴 찬' },
    { hanja: '讚', meaning: '도울 찬' },
  ],
  창: [
    { hanja: '昌', meaning: '창성할 창' },
    { hanja: '彰', meaning: '밝을 창' },
    { hanja: '昶', meaning: '밝을 창' },
  ],
  채: [
    { hanja: '彩', meaning: '채색 채' },
    { hanja: '蔡', meaning: '성씨 채' },
  ],
  천: [
    { hanja: '天', meaning: '하늘 천' },
    { hanja: '千', meaning: '일천 천' },
    { hanja: '川', meaning: '내 천' },
  ],
  철: [
    { hanja: '哲', meaning: '밝을 철' },
    { hanja: '澈', meaning: '맑을 철' },
    { hanja: '鐵', meaning: '쇠 철' },
  ],
  태: [
    { hanja: '泰', meaning: '클 태' },
    { hanja: '太', meaning: '클 태' },
  ],
  택: [
    { hanja: '澤', meaning: '못/은혜 택' },
  ],
  하: [
    { hanja: '河', meaning: '물 하' },
    { hanja: '夏', meaning: '여름 하' },
    { hanja: '荷', meaning: '연 하' },
  ],
  학: [
    { hanja: '鶴', meaning: '학 학' },
    { hanja: '學', meaning: '배울 학' },
  ],
  한: [
    { hanja: '韓', meaning: '나라 한' },
    { hanja: '漢', meaning: '한수 한' },
  ],
  해: [
    { hanja: '海', meaning: '바다 해' },
    { hanja: '諧', meaning: '화할 해' },
  ],
  혁: [
    { hanja: '赫', meaning: '빛날 혁' },
    { hanja: '爀', meaning: '빛날 혁' },
  ],
  현: [
    { hanja: '賢', meaning: '어질 현' },
    { hanja: '鉉', meaning: '솥귀 현' },
    { hanja: '顯', meaning: '밝을 현' },
    { hanja: '玄', meaning: '검을 현' },
    { hanja: '炫', meaning: '밝을 현' },
    { hanja: '玹', meaning: '옥돌 현' },
  ],
  혜: [
    { hanja: '惠', meaning: '은혜 혜' },
    { hanja: '慧', meaning: '슬기 혜' },
  ],
  호: [
    { hanja: '浩', meaning: '넓을 호' },
    { hanja: '鎬', meaning: '호경 호' },
    { hanja: '虎', meaning: '범 호' },
    { hanja: '湖', meaning: '호수 호' },
  ],
  홍: [
    { hanja: '洪', meaning: '넓을 홍' },
    { hanja: '鴻', meaning: '큰기러기 홍' },
    { hanja: '紅', meaning: '붉을 홍' },
  ],
  화: [
    { hanja: '華', meaning: '빛날 화' },
    { hanja: '和', meaning: '화할 화' },
    { hanja: '花', meaning: '꽃 화' },
  ],
  환: [
    { hanja: '煥', meaning: '불꽃 환' },
    { hanja: '桓', meaning: '굳셀 환' },
  ],
  황: [
    { hanja: '黃', meaning: '누를 황' },
    { hanja: '皇', meaning: '임금 황' },
  ],
  훈: [
    { hanja: '勳', meaning: '공 훈' },
    { hanja: '訓', meaning: '가르칠 훈' },
  ],
  희: [
    { hanja: '熙', meaning: '빛날 희' },
    { hanja: '喜', meaning: '기쁠 희' },
    { hanja: '希', meaning: '바랄 희' },
    { hanja: '姬', meaning: '계집 희' },
  ],
};

/**
 * 한글 한 글자를 입력받아 해당 음의 한자 후보 배열을 반환합니다.
 */
export function getHanjaCandidates(char: string): HanjaEntry[] {
  if (!char) return [];
  return HANJA_DICTIONARY[char] || [];
}
