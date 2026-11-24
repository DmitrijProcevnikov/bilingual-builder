import { useMemo, useState } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Собираем варианты ответа: правильный + 2 ловушки
function buildOptions(item, allItems) {
  const correct = item.de.target;

  // Ловушки: другие немецкие предложения из этой же темы
  const pool = allItems
    .filter((it) => it.id !== item.id)
    .map((it) => it.de.target);

  // Плюс явные ложные друзья из false_friends (если есть)
  const trapsFromFalseFriends = (item.false_friends || []).map(
    (ff) => `Ich brauche ${ff.trap}.` // искусственная, но понятная ловушка
  );

  const candidates = [...pool, ...trapsFromFalseFriends].filter(
    (t) => t !== correct
  );

  const picked = shuffle(candidates).slice(0, 2);
  // Если пул пуст — заглушки (маловероятно при >=3 items)
  while (picked.length < 2) picked.push("…");

  return shuffle([correct, ...picked]);
}

export default function SwitchMode({
  item,
  allItems,
  topicId,
  onAnswer,   // (isCorrect, chosenOption, correctOption) => void
  onMistake,  // (type) => void
  onNext,
  onBack,
}) {
  const options = useMemo(
    () => buildOptions(item, allItems),
    [item.id, allItems.length]
  );
  const [chosen, setChosen] = useState(null);

  function handlePick(option) {
    if (chosen) return;
    setChosen(option);
    const isCorrect = option === item.de.target;
    onAnswer(isCorrect);
    if (!isCorrect) onMistake("switch_wrong_translation");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onBack}
        className="text-sm text-slate-500 mb-4 hover:underline"
      >
        ← Назад
      </button>

      <div className="text-6xl mb-3">{item.image}</div>
      <h2 className="text-lg font-bold mb-1">{item.situation}</h2>
      <p className="text-xs text-slate-500 mb-4">
        Выберите правильный немецкий перевод
      </p>

      <div className="bg-en-light border-l-4 border-en rounded p-4 mb-4">
        <div className="text-xs font-semibold text-en-dark mb-1">ENGLISH</div>
        <div className="text-lg">{item.en.target}</div>
      </div>

      <div className="space-y-2 mb-4">
        {options.map((opt) => {
          const isCorrect = opt === item.de.target;
          const isChosen = chosen === opt;
          let cls =
            "w-full text-left p-3 rounded-lg border-2 transition bg-white border-slate-200 hover:border-slate-400";
          if (chosen) {
            if (isCorrect) cls = "w-full text-left p-3 rounded-lg border-2 bg-green-50 border-green-400";
            else if (isChosen) cls = "w-full text-left p-3 rounded-lg border-2 bg-red-50 border-red-400";
            else cls = "w-full text-left p-3 rounded-lg border-2 bg-white border-slate-200 opacity-60";
          }
          return (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              disabled={!!chosen}
              className={cls}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {chosen && (
        <div className="flex items-center gap-3">
          <div
            className={`text-sm flex-1 ${
              chosen === item.de.target ? "text-green-700" : "text-red-700"
            }`}
          >
            {chosen === item.de.target
              ? "✅ Верно!"
              : `❌ Правильно: ${item.de.target}`}
          </div>
          <button
            onClick={onNext}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900"
          >
            Далее →
          </button>
        </div>
      )}
    </div>
  );
}