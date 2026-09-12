(() => {
  const app = SpamToGod;
  let state, resolutionTimer;

  function dayPrayers(day) {
    return app.data.allPrayers.filter(prayer => prayer.day === day);
  }

  function reset() {
    clearTimeout(resolutionTimer);
    state = {
      day: 1,
      phase: 'tutorial',
      dayPrayers: dayPrayers(1),
      currentPrayerIndex: 0,
      score: 0,
      processedCount: 0,
      correctCount: 0,
      compliantCount: 0,
      miraclePoints: 3,
      records: [],
      finalChoice: null
    };
  }

  function setDay(day) {
    state.day = day;
    state.phase = 'reading';
    state.dayPrayers = dayPrayers(day);
    state.currentPrayerIndex = 0;
    state.processedCount = 0;
    state.correctCount = 0;
    state.compliantCount = 0;
    document.querySelector('.top-tools span:first-child').textContent = `DAY ${String(day).padStart(2, '0')}`;
    document.getElementById('work-day').textContent = `DAY ${String(day).padStart(2, '0')}`;
    document.getElementById('work-mode').textContent = day === 5 ? '마지막 기도' : day === 4 ? '시스템 조사' : day === 3 ? '분류 오류' : day === 2 ? '업무 폭주' : '첫 출근';
    document.getElementById('mode-label').textContent = day === 5 ? '최종 근무' : '업무 모드';
    document.querySelector('.rules summary').textContent = `분류 규정 · DAY ${day}`;
  }

  function openPrayer() {
    state.phase = 'reading';
    const prayer = state.dayPrayers[state.currentPrayerIndex];
    app.ui.prayer(prayer, state);
    app.audio.effect('mail');
    if (prayer.flags?.stopBgm && app.audio.stop) app.audio.stop();
  }

  function finishDay() {
    state.phase = 'result';
    app.ui.result(state);
  }

  function endingById(id) {
    return app.data.endings.find(ending => ending.id === id);
  }

  function showEnding(id) {
    state.phase = 'ending';
    app.ui.ending(endingById(id));
  }

  function resolvePrayer(category) {
    const prayer = state.dayPrayers[state.currentPrayerIndex];
    const expected = app.data.policyKey(prayer);
    const recommendation = app.data.recommendationKey(prayer);
    const correct = expected == null ? true : category === expected;
    state.phase = 'resolving';
    state.processedCount++;
    state.correctCount += Number(correct);
    state.compliantCount += Number(recommendation == null || category === recommendation);
    state.score += expected == null ? 0 : correct ? 100 : -50;
    if (category === 'miracle') {
      state.miraclePoints = Math.max(0, state.miraclePoints - 1);
      if (state.day === 5 && prayer.flags?.revealReplyButton) state.finalChoice = 'miracle';
    } else if (state.day === 5 && prayer.flags?.revealReplyButton && !state.finalChoice) {
      state.finalChoice = 'company';
    }
    state.records.push({ id: prayer.id, day: state.day, category, correct });
    app.ui.resolve(prayer, category, correct);
    app.audio.effect(category === 'miracle' ? 'correct' : 'stamp');
    resolutionTimer = setTimeout(() => {
      state.phase = 'resolved';
      if (!prayer.flags?.suppressSuccessSound) app.audio.effect(correct ? 'correct' : 'wrong');
      app.ui.resolved(state);
    }, 650);
  }

  app.game = {
    state() { return state; },
    begin() {
      if (!state) reset();
      setDay(state.day || 1);
      app.ui.screen('game');
      openPrayer();
    },
    classify(category) {
      if (!state || state.phase !== 'reading' || !Object.hasOwn(app.data.categories, category)) return;
      const prayer = state.dayPrayers[state.currentPrayerIndex];
      if (category === 'miracle' && (state.day < 2 || !prayer.miracleEligible || state.miraclePoints <= 0)) return;
      resolvePrayer(category);
    },
    reply() {
      if (!state || state.phase !== 'reading') return;
      const prayer = state.dayPrayers[state.currentPrayerIndex];
      if (!prayer.flags?.revealReplyButton) return;
      state.finalChoice = 'reply';
      showEnding('ENDING_C_REPLY');
    },
    next() {
      if (!state || state.phase !== 'resolved') return;
      if (state.processedCount === state.dayPrayers.length) {
        finishDay();
        return;
      }
      state.currentPrayerIndex++;
      openPrayer();
    },
    continueFromResult() {
      if (!state) return;
      if (state.day >= 5) {
        const id = state.finalChoice === 'miracle' ? 'ENDING_B_MIRACLE' : state.finalChoice === 'reply' ? 'ENDING_C_REPLY' : 'ENDING_A_COMPANY_ANGEL';
        showEnding(id);
        return;
      }
      setDay(state.day + 1);
      app.ui.screen('game');
      openPrayer();
    },
    restart() {
      reset();
      app.audio.start();
      app.story.start();
    }
  };

  document.getElementById('start-button').addEventListener('click', () => { reset(); app.audio.start(); app.story.start(); });
  document.getElementById('tutorial-next').addEventListener('click', () => app.story.next());
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => app.story.active() ? app.story.classify(button.dataset.category) : app.game.classify(button.dataset.category)));
  document.getElementById('tutorial-skip').addEventListener('click', () => app.story.skip());
  document.getElementById('training-start').addEventListener('click', () => app.story.begin());
  document.getElementById('next-prayer').addEventListener('click', () => app.game.next());
  document.getElementById('restart').addEventListener('click', () => app.game.continueFromResult());
  document.getElementById('ending-restart').addEventListener('click', () => app.game.restart());
  document.getElementById('sound').addEventListener('click', event => {
    const muted = app.audio.toggle();
    event.currentTarget.textContent = muted ? '사운드 꺼짐' : '사운드 켜짐';
    event.currentTarget.setAttribute('aria-pressed', String(muted));
  });
  document.addEventListener('click', event => {
    if (event.target.closest('button:not(:disabled)') && !event.target.closest('[data-category], #sound, #tutorial-next, #reply-button')) app.audio.effect('click');
  });
})();
