(() => {
  const el = id => document.getElementById(id);
  const text = (id, value) => { el(id).textContent = value; };
  const buttons = () => document.querySelectorAll('[data-category]');
  function hideCharacterNote() {
    const note = el('tutorial-coach');
    if (!document.body.classList.contains('is-training')) note.hidden = true;
    note.classList.remove('gabriel-note');
  }
  function gabrielNote(prayer) {
    const note = el('tutorial-coach');
    el('tutorial-mika').src = 'assets/images/characters/gabriel/gabriel_default.png';
    el('tutorial-mika').alt = '관리자 가브리엘';
    el('tutorial-title').textContent = '가브리엘 · 제7분류과 관리자';
    el('tutorial-text').textContent = prayer.originalText.join('\n\n');
    el('tutorial-next').disabled = true;
    note.classList.add('gabriel-note', 'dialogue-ready');
    note.hidden = false;
  }
  function metrics(state) {
    const percent = count => state.processedCount ? `${Math.round(count / state.processedCount * 100)}%` : '—';
    return [ `${state.processedCount} / ${state.dayPrayers.length}`, percent(state.correctCount), percent(state.compliantCount), `${state.score}` ];
  }
  function queue(state) {
    el('queue').replaceChildren();
    state.dayPrayers.forEach((prayer, index) => {
      const row = document.createElement('li');
      const done = index < state.processedCount;
      const current = index === state.currentPrayerIndex && !done;
      row.className = done ? 'done' : current ? 'current' : 'waiting';
      row.textContent = `${done ? '✓' : current ? '○' : '●'} ${index <= state.currentPrayerIndex ? prayer.sender : '수신 대기'}`;
      row.setAttribute('aria-label', `${row.textContent} · ${done ? '처리 완료' : current ? '읽음' : '읽지 않음'}`);
      el('queue').append(row);
    });
    text('inbox-count', state.phase === 'reading' ? '1' : '0');
    text('done-count', state.processedCount);
  }
  SpamToGod.ui = {
    screen(id) { document.querySelectorAll('.screen').forEach(screen => { screen.hidden = screen.id !== id; }); },
    kpi(state) { ['processed', 'accuracy', 'compliance', 'score'].forEach((id, i) => text(id, metrics(state)[i])); queue(state); },
    prayer(prayer, state) {
      const data = SpamToGod.data;
      const recommendation = data.recommendationKey(prayer);
      const urgency = data.urgencyOf(prayer);
      text('prayer-id', `PRAYER / ${prayer.id}`); text('sender', prayer.sender); text('region', prayer.region);
      text('summary', data.summaryOf(prayer)); text('original', data.originalOf(prayer)); text('human-status', prayer.status);
      text('urgency', `${urgency}%`); el('urgency-meter').value = urgency;
      text('repeat', `${prayer.repeatCount}회`); text('recommendation', recommendation ? data.categories[recommendation].label : '—');
      text('prayer-number', `${String(state.currentPrayerIndex + 1).padStart(2, '0')} / ${String(state.dayPrayers.length).padStart(2, '0')}`);
      text('mail-status', '○ 읽음'); text('feedback', '원문을 읽고 필요한 경우 SERAPH 요약을 펼쳐 확인해 주세요.');
      el('feedback').className = ''; el('original').hidden = false;
      el('summary-panel').open = false;
      el('stamp').hidden = true; el('next-prayer').hidden = true;
      el('prayer-card').classList.remove('filed');
      document.body.classList.toggle('day-late', state.day >= 4);
      document.body.classList.toggle('day-final', state.day === 5);
      buttons().forEach(button => {
        const isMiracle = button.dataset.category === 'miracle';
        if (!isMiracle) {
          button.disabled = false;
          return;
        }
        const miracleLocked = state.day < 2;
        const outOfLight = state.miraclePoints <= 0;
        const unavailableForPrayer = !prayer.miracleEligible;
        button.disabled = miracleLocked || outOfLight || unavailableForPrayer;
        button.title = miracleLocked
          ? 'DAY 02부터 기적 요청 분류가 열립니다.'
          : unavailableForPrayer
            ? '이 기도는 기적 요청 대상이 아닙니다.'
            : outOfLight
              ? '남은 별빛이 없어 기적 요청을 보낼 수 없습니다.'
              : '이 기도에 기적 요청을 사용할 수 있습니다.';
        button.querySelector('small').textContent = miracleLocked
          ? 'DAY 02부터 사용 가능'
          : unavailableForPrayer
            ? '이 기도는 대상 아님'
            : outOfLight
              ? '별빛 부족'
              : `사용 가능 · 남은 별빛 ${state.miraclePoints}`;
      });
      if (prayer.flags?.revealReplyButton) {
        let reply = document.getElementById('reply-button');
        if (!reply) {
          reply = document.createElement('button');
          reply.id = 'reply-button';
          reply.className = 'reply-button';
          reply.textContent = '답장하기';
          document.querySelector('.action-bar').append(reply);
          reply.addEventListener('click', () => SpamToGod.game.reply());
        }
        reply.hidden = false;
      } else {
        const reply = document.getElementById('reply-button');
        if (reply) reply.hidden = true;
      }
      if (prayer.flags?.gabrielAppears) gabrielNote(prayer); else hideCharacterNote();
      el('mail-icon').classList.remove('arriving'); void el('mail-icon').offsetWidth; el('mail-icon').classList.add('arriving');
      el('sender').focus(); this.kpi(state);
    },
    original() { el('summary-panel').open = !el('summary-panel').open; },
    resolve(prayer, chosen, correct) {
      buttons().forEach(button => { button.disabled = true; });
      const category = SpamToGod.data.categories[chosen];
      el('stamp-image').src = category.image; el('stamp-image').alt = category.stamp;
      text('stamp-label', `${category.label} · 접수 완료`); el('stamp').hidden = false;
      const expectedKey = SpamToGod.data.policyKey(prayer);
      const expected = expectedKey ? SpamToGod.data.categories[expectedKey] : null;
      if (!expected) text('feedback', prayer.errorEvent?.message || '정책 판정 테이블이 응답하지 않습니다. 기록만 남깁니다.');
      else text('feedback', `${correct ? '규정 일치 · +100' : '규정과 일치하지 않음 · −50'} — ${expected.label}: ${expected.rule}`);
      el('feedback').className = !expected || correct ? 'match' : 'mismatch'; text('mail-status', '✓ 처리 완료');
    },
    resolved(state) { this.kpi(state); el('prayer-card').classList.add('filed'); el('next-prayer').hidden = false; text('next-prayer', state.processedCount === state.dayPrayers.length ? (state.day === 5 ? '최종 보고 보기 →' : `DAY ${state.day} 근무 평가 보기 →`) : '다음 기도 →'); el('next-prayer').focus(); },
    result(state) {
      this.screen('result'); el('result-metrics').replaceChildren();
      ['처리량', '정확도', '규정 준수율', '업무 점수'].forEach((label, index) => { const item = document.createElement('div'); const value = document.createElement('strong'); item.textContent = label; value.textContent = metrics(state)[index]; item.append(value); el('result-metrics').append(item); });
      text('result-day', `DAY ${String(state.day).padStart(2, '0')} / COMPLETE`);
      text('result-title', state.day === 5 ? '마지막 근무를 마쳤습니다.' : `DAY ${state.day} 근무를 마쳤습니다.`);
      text('result-copy', state.day === 5 ? '이제 기록이 아니라 선택만 남았습니다.' : `${state.dayPrayers.length}통의 기도를 처리했습니다.`);
      text('result-message', SpamToGod.story.result(state));
      el('result-portrait').src = state.day >= 4 ? 'assets/images/characters/gabriel/gabriel_suspicious.png' : 'assets/images/characters/mika/mika_smile.png';
      text('result-speaker', state.day >= 4 ? '가브리엘 · 제7분류과 관리자' : '미카 · 교육 담당');
      text('result-help', state.day >= 4 ? '후반부에는 정답이 사라지는 기도가 등장합니다. 점수보다 기록과 선택이 중요해집니다.' : '정확도: 정답 분류 비율 · 규정 준수율: SERAPH 추천 일치 비율');
      text('restart', state.day === 5 ? '엔딩 보기 →' : `DAY ${state.day + 1} 출근하기 →`);
      text('result-note', state.day === 5 ? '마지막 선택에 따라 엔딩이 달라집니다.' : `다음 근무: DAY ${state.day + 1}`);
      el('result-title').focus();
    },
    ending(ending) {
      this.screen('ending');
      text('ending-bar', ending.id);
      text('ending-title', ending.title);
      el('ending-portrait').src = `assets/images/characters/gabriel/${ending.portrait || 'gabriel_default'}.png`;
      el('ending-lines').replaceChildren(...ending.lines.map(line => { const p = document.createElement('p'); p.textContent = line; return p; }));
      text('ending-result', ending.result);
      el('ending-title').focus();
    }
  };
})();
