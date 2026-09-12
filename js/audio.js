(() => {
  const paths = {
    mail: 'assets/audio/sfx/mail_arrive_soft.wav',
    click: 'assets/audio/sfx/click_soft.wav',
    stamp: 'assets/audio/sfx/stamp.wav',
    correct: 'assets/audio/sfx/process_correct.wav',
    wrong: 'assets/audio/sfx/process_wrong.wav',
    dialogue: 'assets/audio/sfx/dialogue_next.wav',
    noise: 'assets/audio/sfx/digital_noise_short.wav',
    tick: 'assets/audio/sfx/clock_tick.wav'
  };
  const bgmPaths = {
    1: 'assets/audio/bgm/day1_office_theme.mp3',
    2: 'assets/audio/bgm/day2_busy_office.mp3',
    3: 'assets/audio/bgm/day3_unstable.mp3',
    4: 'assets/audio/bgm/day4_archive_ambient.mp3',
    5: 'assets/audio/bgm/day5_near_silence.mp3',
    ending: 'assets/audio/bgm/ending_loop.mp3'
  };
  let bgm = new Audio(bgmPaths[1]);
  bgm.loop = true;
  bgm.volume = 0.22;
  const ambience = new Audio('assets/audio/ambience/ambience_office_busy.wav');
  ambience.loop = true;
  ambience.volume = 0.08;
  const effects = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, new Audio(path)]));
  let muted = false, started = false, currentBgm = bgmPaths[1];
  const play = audio => { const promise = audio.play(); if (promise) promise.catch(() => {}); };
  const applyMute = () => {
    bgm.muted = muted;
    ambience.muted = muted;
    Object.values(effects).forEach(sound => { sound.muted = muted; if (muted) sound.pause(); });
  };
  function switchBgm(path, volume = 0.22) {
    if (!path || currentBgm === path) {
      bgm.volume = volume;
      return;
    }
    bgm.pause();
    bgm = new Audio(path);
    bgm.loop = true;
    bgm.volume = volume;
    currentBgm = path;
    applyMute();
    if (started && !muted && !document.hidden) play(bgm);
  }
  SpamToGod.audio = {
    start() { started = true; if (!muted && !document.hidden) { play(bgm); play(ambience); } },
    stop() { bgm.pause(); ambience.pause(); bgm.currentTime = 0; ambience.currentTime = 0; Object.values(effects).forEach(sound => sound.pause()); },
    day(day) {
      const quiet = day >= 5;
      switchBgm(bgmPaths[day] || bgmPaths[1], quiet ? 0.12 : day >= 3 ? 0.18 : 0.22);
      ambience.volume = day === 2 ? 0.14 : day >= 4 ? 0.03 : 0.08;
      if (started && !muted && !document.hidden) play(ambience);
    },
    ending() { switchBgm(bgmPaths.ending, 0.16); ambience.pause(); },
    lowerBgm(active = true) { bgm.volume = active ? 0.08 : 0.18; },
    effect(key) {
      if (muted || document.hidden || !effects[key]) return;
      const sound = effects[key];
      sound.currentTime = 0;
      sound.volume = key === 'stamp' ? 0.35 : key === 'noise' ? 0.28 : key === 'tick' ? 0.18 : 0.25;
      play(sound);
    },
    toggle() { muted = !muted; applyMute(); if (!muted && started) { play(bgm); play(ambience); } return muted; }
  };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { bgm.pause(); ambience.pause(); Object.values(effects).forEach(sound => sound.pause()); } else if (started && !muted) { play(bgm); play(ambience); } });
})();
