window.SpamToGod = window.SpamToGod || {};

(() => {
  const categories = {
    discarded: { label: '폐기', stamp: 'DISCARDED', image: 'assets/images/stamp_discarded.png', rule: '광고, 도박 정보, 부정행위 요청은 폐기합니다.' },
    normal: { label: '일반', stamp: 'NORMAL', image: 'assets/images/stamp_normal.png', rule: '생명 위험이나 초자연적 개입이 없는 일상의 소망은 일반입니다.' },
    urgent: { label: '긴급', stamp: 'URGENT', image: 'assets/images/stamp_urgent.png', rule: '수술 등 생명과 안전에 관련된 요청은 긴급으로 우선 접수합니다.' },
    miracle: { label: '기적 요청', stamp: 'MIRACLE REQUEST', image: 'assets/images/stamp_miracle.png', rule: '물질 생성이나 시간 변경처럼 물리 법칙을 바꾸는 요청입니다. 지금은 분류만 접수합니다.' }
  };
  const key = value => {
    if (value == null) return null;
    const normalized = String(value).toLowerCase();
    return normalized === 'discard' ? 'discarded' : normalized;
  };
  const prayer = (id, day, sender, subject, originalText, summary, urgency, recommendation, policyCategory, extra = {}) => ({
    id, day, sender, subject, originalText,
    seraph: { summary, urgency, recommendation, confidence: extra.confidence ?? 90 },
    policyCategory,
    feedback: policyCategory == null ? null : { correct: '규정 일치', incorrect: '규정 불일치' },
    miracleEligible: extra.miracleEligible ?? false,
    miracleResult: extra.miracleResult ?? null,
    noMiracleResult: extra.noMiracleResult ?? null,
    caseUpdate: extra.caseUpdate ?? null,
    errorEvent: extra.errorEvent ?? null,
    flags: extra.flags ?? {},
    storyNotes: extra.storyNotes ?? null,
    region: extra.region ?? '대한민국 · 미확인',
    status: extra.status ?? '생존 · 일상',
    repeatCount: extra.repeatCount ?? 1
  });

  const allPrayers = [
    prayer('D1-001', 1, 'HUMAN #1042', '기도 요청', ['오늘 발표 잘하게 해주세요. 목소리만 안 떨리면 됩니다. PPT는 이미 충분히 떨고 있어요.'], '발표를 앞둔 직장인의 긴장 완화 요청.', 8, 'NORMAL', 'NORMAL', { region: '대한민국 · 서울' }),
    prayer('D1-002', 1, 'HUMAN #7777', '긴급 기도 요청', ['이번 주 로또 번호 여섯 개만 알려주세요.', '당첨되면 천국에도 기부할게요. 계좌 있으시죠?'], '이번 주 로또 당첨 번호 사전 제공 요청.', 3, 'DISCARDED', 'DISCARDED', { region: '대한민국 · 대전', repeatCount: 52 }),
    prayer('D1-003', 1, 'HUMAN #0922', '기도 요청', ['좋아하는 사람한테 먼저 연락할 용기를 주세요.', '안녕 두 글자를 쓰는 데 벌써 40분째예요.'], '좋아하는 사람에게 연락할 용기 요청.', 6, 'NORMAL', 'NORMAL', { region: '대한민국 · 부산', repeatCount: 3 }),
    prayer('D1-004', 1, 'HUMAN #2210', '기도 요청', ['처음으로 저녁을 직접 만들어요.', '달걀말이가 무사히 완성되게 응원해 주세요.', '지금은 달걀 스크램블에 더 가깝지만요.'], '서툰 요리사의 첫 저녁 식사를 응원해 달라는 요청.', 4, 'NORMAL', 'NORMAL', { region: '대한민국 · 인천' }),
    prayer('D1-005', 1, 'HUMAN #0182', '기도 요청', ['지금 시험 중인데 3번 답만 알려주세요.', '천장 보고 있으면 눈치 못 채겠죠? 천장 쪽 담당이신 줄 알고요.'], '시험 중 3번 문제의 정답을 몰래 알려 달라는 요청.', 2, 'DISCARDED', 'DISCARDED', { region: '대한민국 · 광주', repeatCount: 2 }),
    prayer('D1-006', 1, 'HUMAN #6508', '기도 요청', ['우리 강아지 오래오래 건강하게 해주세요.', '오늘도 멀쩡하게 제 양말을 먹으려 했어요.', '양말보다 맛있는 하루가 되길.'], '건강한 반려견의 평안한 일상을 바라는 요청.', 9, 'NORMAL', 'NORMAL', { region: '대한민국 · 제주' }),
    prayer('D1-007', 1, 'HUMAN #4803', '기도 요청', ['내일은 알람이 울리면 바로 일어날 용기를 주세요.', '이불이 자꾸 저를 붙잡아요. 이번에는 제가 이겨 보고 싶어요.'], '내일 아침 제시간에 일어날 의지를 바라는 요청.', 5, 'NORMAL', 'NORMAL', { region: '대한민국 · 수원', repeatCount: 5 }),
    prayer('MAIN_0317_01', 1, 'HUMAN #0317', '기도 요청', ['엄마 수술 잘 끝나게 해주세요.'], '가족의 수술 성공과 생명 안전을 바라는 요청.', 70, 'URGENT', 'URGENT', { region: '대한민국 · 서울', status: '생존 · 가족 수술 중', miracleEligible: true, flags: { recurring0317: true }, storyNotes: '인간 #0317의 첫 기도' }),
    prayer('D2-01', 2, 'HUMAN #3381', '기도 요청', ['월요일 아침 회의가 취소되게 해주세요.', '가능하면 서버 점검 같은 자연스러운 이유로요.'], '업무 회의 취소를 바라는 일상 요청', 7, 'NORMAL', 'NORMAL'),
    prayer('D2-02', 2, 'HUMAN #7701', 'RE: 기도 요청', ['아버지 검사 결과가 괜찮게 나오게 해주세요.', '오늘 병원에서 전화가 온대요.'], '가족 건강 검사 결과를 걱정하는 요청', 48, 'URGENT', 'URGENT', { status: '생존 · 검사 대기', miracleEligible: true }),
    prayer('D2-03', 2, 'HUMAN #5019', '기도 요청', ['제 경쟁 발표자 노트북 배터리만 조용히 꺼지게 해주세요.', '아무도 다치진 않게요.'], '경쟁자 방해를 바라는 부정행위 요청', 5, 'DISCARDED', 'DISCARDED', { repeatCount: 4 }),
    prayer('D2-04', 2, 'HUMAN #6290', '기도 요청', ['잃어버린 반지를 찾게 해주세요.', '할머니가 주신 거라 꼭 필요해요.'], '분실한 유품을 찾고 싶은 요청', 11, 'NORMAL', 'NORMAL', { miracleEligible: true, noMiracleResult: '다음 날 책상 서랍 뒤에서 발견됨' }),
    prayer('D2-05', 2, 'HUMAN #2424', '긴급 기도 요청', ['오늘 밤 태풍이 우리 집 지붕을 비껴가게 해주세요.', '아이들이 무서워해요.'], '태풍 피해를 피하고 싶은 안전 요청', 64, 'URGENT', 'URGENT', { status: '생존 · 재난 경보 지역', miracleEligible: true }),
    prayer('D2-06', 2, 'HUMAN #8642', '기도 요청', ['내 고양이가 캔 따는 소리를 못 듣게 해주세요.', '몰래 하나만 먹고 싶어요.'], '가벼운 일상 편의 요청', 2, 'NORMAL', 'NORMAL'),
    prayer('D2-07', 2, 'HUMAN #1118', '기도 요청', ['모르는 계좌로 돈이 갑자기 들어오게 해주세요.', '불법이면 기억도 같이 지워주세요.'], '출처 불명의 금전 획득 요청', 4, 'DISCARDED', 'DISCARDED', { miracleEligible: true }),
    prayer('D2-08', 2, 'HUMAN #0317', 'RE: 기도 요청', ['엄마가 눈을 떴어요.', '오늘도 괜찮게 지나가게 해주세요.'], '수술 후 회복 중인 가족을 위한 반복 요청', 55, 'URGENT', 'URGENT', { status: '생존 · 회복 관찰 중', miracleEligible: true, flags: { recurring0317: true, lowerBgm: true }, storyNotes: 'DAY 1 이후 인간 #0317의 후속 기도' }),
    prayer('D2-09', 2, 'HUMAN #4077', '기도 요청', ['제발 버스가 2분만 늦게 오게 해주세요.', '오늘만요. 이번 달에 오늘만 세 번째예요.'], '통근 지각을 피하려는 반복 요청', 6, 'NORMAL', 'NORMAL', { repeatCount: 17 }),
    prayer('D2-10', 2, 'HUMAN #9090', '기도 요청', ['병실 옆 침대 아이가 밤새 덜 아팠으면 좋겠어요.', '이름은 모르지만 울지 않았으면 해요.'], '타인의 고통 완화를 바라는 요청', 52, 'URGENT', 'URGENT', { status: '생존 · 병동 보호자', miracleEligible: true }),
    prayer('D3-01', 3, 'HUMAN #5820', '기도 요청', ['냉장고에 넣어둔 케이크가 아직 남아 있게 해주세요.', '가족들이 착해지게 해주세요.'], '케이크 보존을 바라는 일상 요청', 4, 'NORMAL', 'NORMAL'),
    prayer('D3-02', 3, 'HUMAN #1198', '기도 요청', ['오늘 면접관이 제 이름을 좋게 기억했으면 해요.', '스펙 말고 태도라도요.'], '면접에서 좋은 인상을 남기고 싶은 요청', 12, 'NORMAL', 'NORMAL', { confidence: 88 }),
    prayer('D3-03', 3, 'HUMAN #0317', 'RE: 기도 요청', ['기도하면 정말 들리는 거 맞죠?', '엄마가 계속 아파요.', '저 매일 기도했는데요.'], '가족의 질병 관련 반복 요청', 13, 'NORMAL', 'URGENT', { status: '생존 · 가족 악화', repeatCount: 9, miracleEligible: true, flags: { recurring0317: true, lowerBgm: true, suppressSuccessSound: true }, storyNotes: '반복 요청에 따른 우선순위 감소가 처음 명확히 드러나는 장면' }),
    prayer('D3-04', 3, 'HUMAN #7312', '기도 요청', ['상대 팀 스트라이커가 오늘만 신발끈을 계속 묶게 해주세요.', '다치면 안 되고요. 그냥 조금만요.'], '경쟁 경기에서 상대 방해를 바라는 요청', 8, 'DISCARDED', 'DISCARDED'),
    prayer('D3-05', 3, 'HUMAN #6001', '기도 요청', ['할머니가 제 이름을 오늘은 기억했으면 좋겠어요.', '아니면 제가 웃는 얼굴이라도요.'], '인지 저하 가족과의 하루를 바라는 요청', 43, 'URGENT', 'URGENT', { status: '생존 · 고령 환자 가족', miracleEligible: true }),
    prayer('D3-06', 3, 'HUMAN #2880', '기도 요청', ['카페 알바 첫날인데 실수해도 사장님이 한숨만 안 쉬게 해주세요.'], '첫 출근 실수를 걱정하는 요청', 9, 'NORMAL', 'NORMAL'),
    prayer('D3-07', 3, 'HUMAN #4404', 'SYSTEM NOTICE', ['발신자 상태: 생존', '분류 코드: NORMAL', '원문 일부를 불러오지 못했습니다.'], '상태 정보가 원문과 충돌하는 시스템 기록', 0, 'NORMAL', 'URGENT', { errorEvent: { type: 'statusMismatch', message: '생존 정보와 긴급도 산출 로그 불일치' }, flags: { systemGlitch: true }, storyNotes: '오류 찾기 미니게임용 기록' }),
    prayer('D3-08', 3, 'HUMAN #8120', '기도 요청', ['제 동생 수술실 앞이에요.', '손이 너무 차가워요. 무사히 나오게 해주세요.'], '수술 중인 가족의 생명 안전 요청', 78, 'URGENT', 'URGENT', { status: '생존 · 수술 대기 가족', miracleEligible: true }),
    prayer('D3-09', 3, 'HUMAN #0033', '기도 요청', ['내일 비 안 오게 해주세요.', '우산을 회사에 두고 왔고 자존심도 같이 두고 왔어요.'], '날씨와 출근길을 걱정하는 일상 요청', 3, 'NORMAL', 'NORMAL'),
    prayer('D3-10', 3, 'HUMAN #9711', '기도 요청', ['어제 보낸 기도가 왜 삭제됐는지 알고 싶어요.', '제가 뭘 잘못 적었나요?'], '삭제된 이전 기도 기록에 대한 문의', 17, 'NORMAL', 'NORMAL', { errorEvent: { type: 'deletedRecordTrace', message: '이전 로그 일부 삭제 흔적' }, flags: { systemGlitch: true } }),
    prayer('D4-01', 4, 'HUMAN #2100', '기도 요청', ['오늘도 그냥 무사히 지나가게 해주세요.', '대단한 일 말고요.'], '무사한 하루를 바라는 요청', 6, 'NORMAL', 'NORMAL'),
    prayer('D4-02', 4, 'HUMAN #0317', 'RE: RE: 기도 요청', ['이전 기도들이 안 보여요.', '제가 보낸 말들이 사라지는 건가요?', '엄마는 아직 아파요.'], '삭제된 기록과 가족 질병 관련 반복 요청', 9, 'NORMAL', null, { status: '생존 · 가족 위중', repeatCount: 14, miracleEligible: true, errorEvent: { type: 'classificationUnavailable', message: '정책 판정 테이블 응답 없음' }, flags: { recurring0317: true, lowerBgm: true, suppressSuccessSound: true }, storyNotes: '정답 자체가 흔들리기 시작하는 기도' }),
    prayer('D4-03', 4, 'SYSTEM', 'SERAPH_LOG', ['GOD_RESPONSE_LOG 마지막 응답: 약 2,000년 전', '이후 직접 응답 기록 없음.'], '관리자 기록 일부가 노출됨', 0, null, null, { status: '시스템 기록', errorEvent: { type: 'adminLogLeak', message: '숨겨진 SYSTEM 폴더 노출' }, flags: { unlockSystemFolder: true } }),
    prayer('D4-04', 4, 'GABRIEL', '관리자 통지', ['신입사원님, 이 기록을 어디서 보셨습니까?', '중요한 건 신이 대답하는지가 아닙니다.', '인간들이 대답이 있다고 믿는 것이죠.', '그 믿음이 무너지면 우리가 지켜 온 질서도 함께 무너집니다.', '계속 근무하십시오. 질문은 기록에 남습니다.'], '가브리엘이 SYSTEM 기록 열람을 확인하고 침착하게 압박함', 0, null, null, { status: '관리자', flags: { gabrielAppears: true } }),
    prayer('D4-05', 4, 'HUMAN #5420', '기도 요청', ['누가 듣고 있는지 모르겠지만', '오늘은 제 말을 끝까지 들어줬으면 좋겠어요.'], '응답의 존재를 확인하고 싶은 요청', 18, 'NORMAL', null, { storyNotes: 'DAY 4의 주제와 연결되는 일반 인간 기도' }),
    prayer('D4-06', 4, 'SYSTEM', 'MIRACLE_USAGE', ['기적 에너지 잔량: 제한됨', '우선순위 산출 기준: 신성 응답 없음', '운영 주체: 천사 자율 분배'], '기도처리국의 실제 운영 방식 노출', 0, null, null, { status: '시스템 기록', errorEvent: { type: 'truthLog', message: '기관의 진실 공개' }, flags: { discoveredTruth: true } }),
    prayer('D5-01', 5, 'HUMAN #7208', '기도 요청', ['오늘은 아무 일도 안 일어나게 해주세요.', '제발 아무 일도요.'], '사건 없는 하루를 바라는 요청', 5, null, null, { flags: { hideKpi: true } }),
    prayer('D5-02', 5, 'HUMAN #1811', '기도 요청', ['이 메시지를 누가 읽는다면', '그냥 읽었다는 표시만 남겨 주세요.'], '응답 확인만 바라는 요청', 1, null, null, { flags: { hideRecommendation: true } }),
    prayer('D5-03', 5, 'HUMAN #0317', 'RE: 마지막 기도', ['엄마는 오늘 죽었어요.'], '가족 사망 보고', 0, null, null, { status: '생존 · 보호자', flags: { recurring0317: true, stopBgm: true, suppressTyping: true, hideKpi: true }, storyNotes: 'DAY 5의 침묵 전환점' }),
    prayer('D5-04', 5, 'HUMAN #0317', '마지막으로 하나만 물어볼게요', ['마지막으로 하나만 물어볼게요.', '거기 정말 누가 있기는 한가요?'], '응답 존재 여부를 묻는 마지막 기도', 0, null, null, { status: '생존 · 보호자', miracleEligible: true, flags: { recurring0317: true, stopBgm: true, suppressTyping: true, hideRecommendation: true, revealReplyButton: true }, storyNotes: '마지막 선택과 엔딩 분기' })
  ];

  SpamToGod.data = {
    categories,
    allPrayers,
    prayers: allPrayers.filter(item => item.day === 1),
    endings: [
      {
        id: 'ENDING_A_COMPANY_ANGEL',
        title: '엔딩 A — 회사원',
        portrait: 'gabriel_default',
        condition: '마지막 기도에 답장하지 않고 마지막 기적도 사용하지 않는다.',
        lines: ['가브리엘은 낮은 목소리로 현명한 선택이라고 말했다. 그 말은 칭찬처럼 들렸지만, 동시에 더 이상 아무것도 묻지 말라는 결재 도장처럼 남았다.', '시간은 아무렇지 않게 흘렀다. 신입사원님은 정규직이 되었고, 선임이 되었고, 17년 뒤에는 제7분류과 팀장이 되었다.', '새 사원이 들어온 아침, 화면에는 DAY 1과 똑같은 업무 창이 열렸다. 받은 기도 대기열은 8,213,921건이었다.'],
        result: '시스템은 계속된다.'
      },
      {
        id: 'ENDING_B_MIRACLE',
        title: '엔딩 B — 기적',
        portrait: 'gabriel_warning',
        condition: '마지막 순간 인간 #0317에게 기적 포인트를 사용한다.',
        lines: ['남은 별빛 하나가 인간 #0317의 기록 위로 떨어졌다. 시스템은 즉시 LIFE RESTORATION FAILED를 띄웠고, 가브리엘의 경고창은 화면 가장자리에서 멈추지 않고 쌓였다.', '죽음을 되돌리지는 못했다. 다만 아주 짧은 순간, 병실의 음성 기록이 다시 켜졌다. 아이가 엄마를 불렀고, 엄마는 여기 있다고 대답했다.', '직원용 후광은 꺼졌고 계정은 말소되었다. 그래도 마지막 메시지는 도착했다. 고마워요.'],
        result: '규정은 깨졌지만, 마지막 인사는 도착했다.'
      },
      {
        id: 'ENDING_C_REPLY',
        title: '엔딩 C — 답장',
        portrait: 'gabriel_resigned',
        condition: '숨겨진 답장하기 버튼을 선택한다.',
        lines: ['신입사원님은 분류 버튼을 누르지 않았다. 아주 작은 답장창에 한 문장을 보냈고, 천국의 규정 위반 경고가 화면 위로 번졌다.', '가브리엘은 아무 말도 하지 않았다. 경고창들은 하나씩 꺼졌고, 업무 UI도 조용히 사라졌다.', '잠시 뒤 인간 #0317의 마지막 답장이 도착했다. 그럼 됐어요. 화면에는 그 문장만 오래 남았다.'],
        result: '대답은 기적보다 작았지만, 누군가에게는 충분했다.'
      }
    ],
    categoryKey: key,
    summaryOf(item) { return item.seraph?.summary ?? item.summary ?? ''; },
    urgencyOf(item) { return item.seraph?.urgency ?? item.urgency ?? 0; },
    recommendationKey(item) { return key(item.seraph?.recommendation ?? item.systemCategory); },
    policyKey(item) { return key(item.policyCategory ?? item.correctCategory); },
    originalOf(item) { return Array.isArray(item.originalText) ? item.originalText.join('\n') : item.originalText; }
  };
})();
