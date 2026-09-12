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
      const sample = { ...app.data.prayers[0], id:'TRAINING-001', sender:'인간 #4821', summary:'발표를 앞둔 직장인의 응원 요청.' };
      app.ui.prayer(sample, { phase:'reading', currentPrayerIndex:0, processedCount:0, correctCount:0, compliantCount:0, score:0 });
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
    result(correct) { return correct === 8 ? '여덟 통 모두 규정에 맞게 접수했네요! 오늘의 기도는 모두 담당 부서로 전달됐어요. 이제 따뜻한 차 한 잔 하러 갈까요?' : '첫 근무 수고했어요! 분류가 헷갈리면 오른쪽 규정표를 다시 읽어 보세요. 오늘의 실수도 내일의 업무 안내서가 될 거예요.'; }
  };
})();
