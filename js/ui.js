(() => {
  const el = id => document.getElementById(id);
  const text = (id, value) => { el(id).textContent = value; };
  const buttons = () => document.querySelectorAll('[data-category]');
  function metrics(state) {
    const percent = count => state.processedCount ? `${Math.round(count / state.processedCount * 100)}%` : '—';
    return [ `${state.processedCount} / 8`, percent(state.correctCount), percent(state.compliantCount), `${state.score}` ];
  }
  function queue(state) {
    el('queue').replaceChildren();
    SpamToGod.data.prayers.forEach((prayer, index) => {
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
      text('prayer-id', `PRAYER / ${prayer.id}`); text('sender', prayer.sender); text('region', prayer.region);
      text('summary', prayer.summary); text('original', prayer.originalText); text('human-status', prayer.status);
      text('urgency', `${prayer.urgency}%`); el('urgency-meter').value = prayer.urgency;
      text('repeat', `${prayer.repeatCount}회`); text('recommendation', SpamToGod.data.categories[prayer.systemCategory].label);
      text('prayer-number', `${String(state.currentPrayerIndex + 1).padStart(2, '0')} / 08`);
      text('mail-status', '○ 읽음'); text('feedback', '원문을 읽고 필요한 경우 SERAPH 요약을 펼쳐 확인해 주세요.');
      el('feedback').className = ''; el('original').hidden = false;
      el('summary-panel').open = false;
      el('stamp').hidden = true; el('next-prayer').hidden = true;
      el('prayer-card').classList.remove('filed');
      buttons().forEach(button => { button.disabled = button.dataset.category === 'miracle'; });
      el('mail-icon').classList.remove('arriving'); void el('mail-icon').offsetWidth; el('mail-icon').classList.add('arriving');
      el('sender').focus(); this.kpi(state);
    },
    original() { el('summary-panel').open = !el('summary-panel').open; },
    resolve(prayer, chosen, correct) {
      buttons().forEach(button => { button.disabled = true; });
      const category = SpamToGod.data.categories[chosen];
      el('stamp-image').src = category.image; el('stamp-image').alt = category.stamp;
      text('stamp-label', `${category.label} · 접수 완료`); el('stamp').hidden = false;
      const expected = SpamToGod.data.categories[prayer.correctCategory];
      text('feedback', `${correct ? '규정 일치 · +100' : '규정과 일치하지 않음 · −50'} — ${expected.label}: ${expected.rule}`);
      el('feedback').className = correct ? 'match' : 'mismatch'; text('mail-status', '✓ 처리 완료');
    },
    resolved(state) { this.kpi(state); el('prayer-card').classList.add('filed'); el('next-prayer').hidden = false; text('next-prayer', state.processedCount === 8 ? 'DAY 1 근무 평가 보기 →' : '다음 기도 →'); el('next-prayer').focus(); },
    result(state) {
      this.screen('result'); el('result-metrics').replaceChildren();
      ['처리량', '정확도', '규정 준수율', '업무 점수'].forEach((label, index) => { const item = document.createElement('div'); const value = document.createElement('strong'); item.textContent = label; value.textContent = metrics(state)[index]; item.append(value); el('result-metrics').append(item); });
      text('result-message', SpamToGod.story.result(state.correctCount)); el('result-title').focus();
    }
  };
})();
