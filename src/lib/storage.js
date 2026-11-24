const KEY = "bilingual-builder-v1";

const DEFAULT = {
  streaks: { en: 0, de: 0 },
  bestStreaks: { en: 0, de: 0 },
  stats: {
    en: { correct: 0, wrong: 0 },
    de: { correct: 0, wrong: 0 },
  },
  mistakes: [], // [{ itemId, topicId, lang, type, timestamp }]
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const parsed = JSON.parse(raw);
    // Мягкое слияние с дефолтом на случай старых версий
    return {
      ...structuredClone(DEFAULT),
      ...parsed,
      streaks: { ...DEFAULT.streaks, ...(parsed.streaks || {}) },
      bestStreaks: { ...DEFAULT.bestStreaks, ...(parsed.bestStreaks || {}) },
      stats: {
        en: { ...DEFAULT.stats.en, ...(parsed.stats?.en || {}) },
        de: { ...DEFAULT.stats.de, ...(parsed.stats?.de || {}) },
      },
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
    };
  } catch {
    return structuredClone(DEFAULT);
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // ignore quota errors
  }
}

export function recordAnswer(progress, lang, isCorrect) {
  const next = structuredClone(progress);
  if (isCorrect) {
    next.stats[lang].correct += 1;
    next.streaks[lang] += 1;
    if (next.streaks[lang] > next.bestStreaks[lang]) {
      next.bestStreaks[lang] = next.streaks[lang];
    }
  } else {
    next.stats[lang].wrong += 1;
    next.streaks[lang] = 0;
  }
  return next;
}

export function recordMistake(progress, { itemId, topicId, lang, type }) {
  const next = structuredClone(progress);
  // Не дублируем одну и ту же ошибку по одному и тому же itemId+type
  const exists = next.mistakes.find(
    (m) => m.itemId === itemId && m.type === type
  );
  if (!exists) {
    next.mistakes.unshift({
      itemId,
      topicId,
      lang,
      type,
      timestamp: Date.now(),
    });
    // Держим не больше 50 последних
    next.mistakes = next.mistakes.slice(0, 50);
  }
  return next;
}

export function clearMistakes(progress) {
  const next = structuredClone(progress);
  next.mistakes = [];
  return next;
}

export function resetAll() {
  return structuredClone(DEFAULT);
}