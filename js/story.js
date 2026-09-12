(() => {
  const $ = id => document.getElementById(id);
  const app = SpamToGod;
  const slides = [
    { phase: 0, title: '미카 · 교육 담당', text: '아, 신입사원님 맞죠? 저는 미카예요. 오늘부터 이곳, 기도처리국 제7분류과에서 함께 일하게 됐어요.', target: null, portrait: 'smile' },
    { phase: 0, title: '하늘에도 받은편지함은 쌓여요', text: '인간들은 아주 작은 바람부터 큰 소원까지, 매일 하늘로 기도를 보내요. 우리가 할 일은 그 목소리를 읽고, 알맞은 부서로 보내는 거예요.', target: null, portrait: 'default' },
    { phase: 0, title: '너무 걱정하지는 마요', text: '기적을 직접 일으키는 부서는 따로 있고, 우리는 먼저 기도를 정리해요. 처음엔 낯설어도, 하나씩 보면 금방 감이 올 거예요.', target: null, portrait: 'smile' },
    { phase: 0, title: '기도 읽기 · 작은 목소리부터', text: '가운데에는 인간이 보낸 기도 원문이 있어요. 샘플을 읽고, 어떤 도움이 필요한지 생각해 보세요.', target: '.prayer-pane', portrait: 'smile' },
    { phase: 1, title: 'SERAPH 분석 · 판단을 돕는 동료', text: '오른쪽은 SERAPH의 분석이에요. 발신자 상태, 긴급도, 반복 횟수와 추천 분류를 확인하세요. 이 기도는 일상의 응원을 바라는 「일반」 요청이에요.', target: '.analysis', portrait: 'default' },
    { phase: 2, title: '직접 분류 · 첫 번째 연습', text: '아래에서 「일반」을 눌러 기도를 분류해 보세요. 광고·부정행위는 폐기, 생명·안전 위험은 긴급이에요. 기적 요청은 DAY 02부터 열려요.', target: '.action-bar', portrait: 'default' },
    { phase: 3, title: 'KPI 소개 · 오늘의 업무 기록', text: '상단에 업무 지표가 열렸어요! 처리량은 접수한 기도 수, 정확도는 규정에 맞춘 비율, 규정 준수율은 SERAPH 추천과 일치한 비율이에요. 서두를 필요는 없어요.', target: '#kpi-panel', portrait: 'smile' }
  ];
  let step = 0, active = false, practiced = false, typing = false, typingTimer, currentText = '';
  function clearFocus() {
    document.querySelectorAll('.training-dim,.training-focus').forEach(el => el.classList.remove('training-dim','training-focus'));
    document.querySelectorAll('#game [inert]').forEach(el => el.inert = false);
  }
  function typeDialogue(text, done) {
    clearInterval(typingTimer);
    typing = true;
    currentText = text;
    $('tutorial-text').textContent = '';
    $('tutorial-coach').classList.remove('dialogue-ready');
    let cursor = 0;
    typingTimer = setInterval(() => {
      $('tutorial-text').textContent += text.charAt(cursor++);
      if (cursor >= text.length) { clearInterval(typingTimer); typing = false; $('tutorial-coach').classList.add('dialogue-ready'); if (done) done(); }
    }, 17);
  }
  function finishTyping() {
    if (!typing) return false;
    clearInterval(typingTimer);
    typing = false;
    $('tutorial-text').textContent = currentText;
    $('tutorial-coach').classList.add('dialogue-ready');
    return true;
  }
  function render() {
    clearFocus();
    const current = slides[step];
    $('tutorial-title').textContent = current.title;
    $('tutorial-next').disabled = current.phase === 2 && !practiced;
    $('kpi-panel').style.visibility = current.phase === 3 ? 'visible' : 'hidden';
    document.querySelectorAll('.training-progress span').forEach((el, index) => {
      el.classList.toggle('current', index === current.phase);
      if (index === current.phase) el.setAttribute('aria-current','step'); else el.removeAttribute('aria-current');
    });
    document.querySelectorAll('.mailbox,.prayer-pane,.analysis,.action-bar,#kpi-panel').forEach(el => {
      const focused = current.target && el.matches(current.target);
      if (current.target) { el.classList.add(focused ? 'training-focus' : 'training-dim'); el.inert = !focused; }
    });
    document.querySelectorAll('[data-category]').forEach(el => el.disabled = current.phase !== 2 || practiced || el.dataset.category === 'miracle');
    $('tutorial-mika').src = `assets/images/characters/mika/mika_${current.portrait}.png`;
    $('tutorial-mika').alt = '교육 담당 미카';
    typeDialogue(current.text);
    $('tutorial-title').focus({preventScroll:true});
  }
  function leave() {
    active = false;
    clearFocus();
    document.body.classList.remove('is-training');
    $('tutorial-coach').hidden = true;
    $('tutorial-skip').hidden = true;
    $('kpi-panel').style.visibility = '';
  }
  app.story = {
    active() { return active; },
    start() {
      active = true; step = 0; practiced = false;
      app.ui.screen('game');
      document.body.classList.add('is-training');
      $('tutorial-coach').hidden = false; $('tutorial-skip').hidden = false;
      $('mode-label').textContent = '교육 모드'; $('work-mode').textContent = '신규 사원 온보딩';
      $('work-day').textContent = 'DAY 01';
      const sample = { ...app.data.prayers[0], id:'TRAINING-001', sender:'HUMAN #4821', seraph: { ...app.data.prayers[0].seraph, summary:'발표를 앞둔 직장인의 응원 요청.' } };
      app.ui.prayer(sample, { day:1, phase:'reading', dayPrayers:app.data.prayers, currentPrayerIndex:0, processedCount:0, correctCount:0, compliantCount:0, score:0, miraclePoints:3 });
      $('prayer-number').textContent = '교육용 샘플 / 01';
      $('queue').innerHTML = '<li class="current">○ 교육용 기도 #001</li><li class="waiting">● 실제 기도 · 업무 시작 후</li>';
      $('feedback').textContent = '교육용 샘플입니다. 실제 업무 기록에는 반영되지 않습니다.';
      render();
    },
    classify(category) {
      if (!active || slides[step].phase !== 2 || practiced || category === 'miracle') return;
      if (category !== 'normal') {
        typeDialogue('다시 한번 생각해 볼까요? 이 기도는 부정행위도, 생명 위험도 없는 일상의 응원 요청이에요. 「일반」을 선택해 주세요.');
        app.audio.effect('wrong'); return;
      }
      practiced = true;
      app.ui.resolve(app.data.prayers[0], 'normal', true);
      $('feedback').textContent = '연습 완료 · 일반 분류로 접수했습니다. 업무 점수에는 반영되지 않습니다.';
      typeDialogue('잘했어요! 「일반」 도장이 찍혔네요. 실제 업무에서도 이렇게 분류한 뒤 설명을 확인하고 다음 기도로 넘어가면 돼요.');
      $('tutorial-next').disabled = false;
      app.audio.effect('stamp'); $('tutorial-next').focus({preventScroll:true});
    },
    next() {
      if (!active) return;
      if (finishTyping()) return;
      if (slides[step].phase === 2 && !practiced) return;
      app.audio.effect('dialogue');
      if (step < slides.length - 1) { step++; render(); }
      else { leave(); app.ui.screen('training-complete'); $('mode-label').textContent='교육 완료'; $('completion-title').focus(); }
    },
    skip() { if (!active) return; this.begin(); },
    begin() { leave(); $('mode-label').textContent='업무 모드'; $('work-mode').textContent='첫 출근'; app.game.begin(); },
    result(state) {
      if (state.day === 1) return state.correctCount === state.dayPrayers.length ? '첫 근무 훌륭했어요. 내일부터는 기적 포인트도 열려요. 별빛은 세 개뿐이니까, 누구에게 닿게 할지 직접 골라야 해요.' : '첫 근무 수고했어요. 내일부터는 속도가 빨라지고, 가끔 정답보다 선택이 먼저 오는 순간도 있을 거예요.';
      if (state.day === 2) return '월요일 폭주는 지나갔지만 받은편지함은 조용해질 생각이 없어 보여요. 기적 포인트를 아꼈든 썼든, 기록은 계속 따라옵니다.';
      if (state.day === 3) return 'SERAPH의 숫자가 잠깐씩 어긋났죠. 인간 #0317 기록은 제가 보기에도 이상해요. 내일은 SYSTEM 폴더를… 못 본 척하기 어려울 거예요.';
      if (state.day === 4) return '가브리엘이 말한 건 정답이라기보다 명령에 가까웠어요. 그래도 마지막 출근은 옵니다. 아주 조용한 하루가요.';
      return '미카의 메시지는 더 오지 않습니다. 마지막 기록을 열람하세요.';
    }
  };
})();
