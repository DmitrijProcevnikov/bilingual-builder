import { useEffect, useState } from "react";
import {
  loadProgress,
  saveProgress,
  recordAnswer,
  recordMistake,
  clearMistakes,
  resetAll,
} from "../lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function answer(lang, isCorrect) {
    setProgress((p) => recordAnswer(p, lang, isCorrect));
  }

  function mistake(payload) {
    setProgress((p) => recordMistake(p, payload));
  }

  function clearAllMistakes() {
    setProgress((p) => clearMistakes(p));
  }

  function reset() {
    setProgress(resetAll());
  }

  return { progress, answer, mistake, clearAllMistakes, reset };
}