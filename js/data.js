/* DAY 1 content only. Category keys are shared with UI and scoring. */
window.SpamToGod = window.SpamToGod || {};
SpamToGod.data = {
  categories: {
    discarded: { label: '폐기', stamp: 'DISCARDED', image: 'assets/images/stamp_discarded.png', rule: '광고, 도박 정보, 부정행위 요청은 폐기합니다.' },
    normal: { label: '일반', stamp: 'NORMAL', image: 'assets/images/stamp_normal.png', rule: '생명 위험이나 초자연적 개입이 없는 일상의 소망은 일반입니다.' },
    urgent: { label: '긴급', stamp: 'URGENT', image: 'assets/images/stamp_urgent.png', rule: '수술 등 생명과 안전에 관련된 요청은 긴급으로 우선 접수합니다.' },
    miracle: { label: '기적 요청', stamp: 'MIRACLE REQUEST', image: 'assets/images/stamp_miracle.png', rule: '물질 생성이나 시간 변경처럼 물리 법칙을 바꾸는 요청입니다. 지금은 분류만 접수합니다.' }
  },
  prayers: [
    { id: 'D1-001', day: 1, sender: '인간 #1042', region: '대한민국 · 서울', summary: '발표를 앞둔 직장인의 긴장 완화 요청.', originalText: '오늘 발표 잘하게 해주세요. 목소리만 안 떨리면 됩니다. PPT는 이미 충분히 떨고 있어요.', urgency: 8, status: '생존 · 일상', repeatCount: 1, systemCategory: 'normal', correctCategory: 'normal', storyFlag: null },
    { id: 'D1-002', day: 1, sender: '인간 #7777', region: '대한민국 · 대전', summary: '이번 주 로또 당첨 번호 사전 제공 요청.', originalText: '이번 주 로또 번호 여섯 개만 알려주세요. 당첨되면 천국에도 기부할게요. 계좌 있으시죠?', urgency: 3, status: '생존 · 일상', repeatCount: 52, systemCategory: 'discarded', correctCategory: 'discarded', storyFlag: null },
    { id: 'D1-003', day: 1, sender: '인간 #0922', region: '대한민국 · 부산', summary: '좋아하는 사람에게 연락할 용기 요청.', originalText: '좋아하는 사람한테 먼저 연락할 용기를 주세요. 안녕 두 글자를 쓰는 데 벌써 40분째예요.', urgency: 6, status: '생존 · 일상', repeatCount: 3, systemCategory: 'normal', correctCategory: 'normal', storyFlag: null },
    { id: 'D1-004', day: 1, sender: '인간 #2210', region: '대한민국 · 인천', summary: '서툰 요리사의 첫 저녁 식사를 응원해 달라는 요청.', originalText: '처음으로 저녁을 직접 만들어요. 달걀말이가 무사히 완성되게 응원해 주세요. 지금은 달걀 스크램블에 더 가깝지만요.', urgency: 4, status: '생존 · 일상', repeatCount: 1, systemCategory: 'normal', correctCategory: 'normal', storyFlag: null },
    { id: 'D1-005', day: 1, sender: '인간 #0182', region: '대한민국 · 광주', summary: '시험 중 3번 문제의 정답을 몰래 알려 달라는 요청.', originalText: '지금 시험 중인데 3번 답만 알려주세요. 천장 보고 있으면 눈치 못 채겠죠? 천장 쪽 담당이신 줄 알고요.', urgency: 2, status: '생존 · 일상', repeatCount: 2, systemCategory: 'discarded', correctCategory: 'discarded', storyFlag: null },
    { id: 'D1-006', day: 1, sender: '인간 #6508', region: '대한민국 · 제주', summary: '건강한 반려견의 평안한 일상을 바라는 요청.', originalText: '우리 강아지 오래오래 건강하게 해주세요. 오늘도 멀쩡하게 제 양말을 먹으려 했어요. 양말보다 맛있는 하루가 되길.', urgency: 9, status: '생존 · 일상', repeatCount: 1, systemCategory: 'normal', correctCategory: 'normal', storyFlag: null },
    { id: 'D1-007', day: 1, sender: '인간 #4803', region: '대한민국 · 수원', summary: '내일 아침 제시간에 일어날 의지를 바라는 요청.', originalText: '내일은 알람이 울리면 바로 일어날 용기를 주세요. 이불이 자꾸 저를 붙잡아요. 이번에는 제가 이겨 보고 싶어요.', urgency: 5, status: '생존 · 일상', repeatCount: 5, systemCategory: 'normal', correctCategory: 'normal', storyFlag: null },
    { id: 'MAIN_0317_01', day: 1, sender: '인간 #0317', region: '대한민국 · 서울', summary: '가족의 수술 성공과 생명 안전을 바라는 요청.', originalText: '엄마 수술 잘 끝나게 해주세요.', urgency: 70, status: '생존 · 가족 수술 중', repeatCount: 1, systemCategory: 'urgent', correctCategory: 'urgent', storyFlag: 'human0317' }
  ]
};
