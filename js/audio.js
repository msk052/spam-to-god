(() => {
  const paths = {
    mail: 'assets/audio/sfx/mail_arrive_soft.wav', click: 'assets/audio/sfx/click_soft.wav',
    stamp: 'assets/audio/sfx/stamp.wav', correct: 'assets/audio/sfx/process_correct.wav',
    wrong: 'assets/audio/sfx/process_wrong.wav', dialogue: 'assets/audio/sfx/dialogue_next.wav'
  };
  const bgm = new Audio('assets/audio/bgm/day1_office_theme.mp3');
  bgm.loop = true; bgm.volume = 0.22;
  const effects = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, new Audio(path)]));
  let muted = false, started = false;
  const play = audio => { const promise = audio.play(); if (promise) promise.catch(() => {}); };
  SpamToGod.audio = {
    start() { started = true; if (!muted && !document.hidden) play(bgm); },
    stop() { bgm.pause(); bgm.currentTime = 0; Object.values(effects).forEach(sound => sound.pause()); },
    effect(key) { if (muted || document.hidden || !effects[key]) return; const sound = effects[key]; sound.currentTime = 0; sound.volume = key === 'stamp' ? 0.35 : 0.25; play(sound); },
    toggle() { muted = !muted; bgm.muted = muted; Object.values(effects).forEach(sound => { sound.muted = muted; if (muted) sound.pause(); }); if (!muted && started) play(bgm); return muted; }
  };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { bgm.pause(); Object.values(effects).forEach(sound => sound.pause()); } else if (started && !muted) play(bgm); });
})();
