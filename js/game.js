(() => {
  const app = SpamToGod;
  let state, resolutionTimer;
  function reset() {
    clearTimeout(resolutionTimer);
    state = { day: 1, phase: 'tutorial', currentPrayerIndex: 0, score: 0, processedCount: 0, correctCount: 0, compliantCount: 0, records: [] };
  }
  function openPrayer() { state.phase = 'reading'; app.ui.prayer(app.data.prayers[state.currentPrayerIndex], state); app.audio.effect('mail'); }
  app.game = {
    begin() { if (!state || state.phase !== 'tutorial') return; app.ui.screen('game'); openPrayer(); },
    classify(category) {
      if (!state || state.phase !== 'reading' || category === 'miracle' || !Object.hasOwn(app.data.categories, category)) return;
      state.phase = 'resolving';
      const prayer = app.data.prayers[state.currentPrayerIndex];
      const correct = category === prayer.correctCategory;
      state.processedCount++; state.correctCount += Number(correct); state.compliantCount += Number(category === prayer.systemCategory);
      state.score += correct ? 100 : -50;
      state.records.push({ id: prayer.id, category, correct });
      app.ui.resolve(prayer, category, correct); app.audio.effect('stamp');
      resolutionTimer = setTimeout(() => { state.phase = 'resolved'; app.audio.effect(correct ? 'correct' : 'wrong'); app.ui.resolved(state); }, 650);
    },
    next() {
      if (!state || state.phase !== 'resolved') return;
      if (state.processedCount === app.data.prayers.length) { state.phase = 'result'; app.ui.result(state); return; }
      state.currentPrayerIndex++; openPrayer();
    }
  };
  document.getElementById('start-button').addEventListener('click', () => { reset(); app.audio.start(); app.story.start(); });
  document.getElementById('tutorial-next').addEventListener('click', () => app.story.next());
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => app.story.active() ? app.story.classify(button.dataset.category) : app.game.classify(button.dataset.category)));
  document.getElementById('tutorial-skip').addEventListener('click', () => app.story.skip());
  document.getElementById('training-start').addEventListener('click', () => app.story.begin());
  document.getElementById('next-prayer').addEventListener('click', () => app.game.next());
  document.getElementById('restart').addEventListener('click', () => { reset(); app.story.start(); });
  document.getElementById('sound').addEventListener('click', event => { const muted = app.audio.toggle(); event.currentTarget.textContent = muted ? '사운드 꺼짐' : '사운드 켜짐'; event.currentTarget.setAttribute('aria-pressed', String(muted)); });
  document.addEventListener('click', event => { if (event.target.closest('button:not(:disabled)') && !event.target.closest('[data-category], #sound, #tutorial-next')) app.audio.effect('click'); });
})();
