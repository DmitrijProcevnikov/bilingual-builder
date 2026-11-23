import { useState } from "react";
import { topics } from "./data";
import SentenceBuilder from "./components/SentenceBuilder";
import ContrastScreen from "./components/ContrastScreen";

export default function App() {
  const [topic, setTopic] = useState(null);
  const [item, setItem] = useState(null);
  // Режим: null | "train" | "contrast"
  const [mode, setMode] = useState(null);
  const [lang, setLang] = useState("en");

  function startTraining(it) {
    setItem(it);
    setMode("train");
    setLang("en");
  }

  function exitTraining() {
    setMode(null);
    setItem(null);
    setLang("en");
  }

  // Экран: сборка предложения
    if (mode === "train" && item) {
    return (
        <SentenceBuilder
        key={`${item.id}-${lang}`}
        item={item}
        lang={lang}
        onBack={() => {
            if (lang === "en") exitTraining();
            else setLang("en");
        }}
        onDone={() => {
            if (lang === "en") setLang("de");
            else setMode("contrast");
        }}
        />
    );
    }
  // Экран: контраст
  if (mode === "contrast" && item) {
    return (
      <ContrastScreen
        item={item}
        onBack={() => {
          setLang("de");
          setMode("train");
        }}
        onDone={() => {
          setMode(null);
          setItem(null);
        }}
      />
    );
  }

  // Экран: карточка ситуации (просмотр)
  if (item) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => setItem(null)}
          className="text-sm text-slate-500 mb-4 hover:underline"
        >
          ← Назад к теме
        </button>
        <h2 className="text-xl font-bold mb-2">{item.situation}</h2>
        <div className="text-6xl mb-6">{item.image}</div>

        <div className="space-y-4">
          <div className="bg-en-light border-l-4 border-en rounded p-4">
            <div className="text-xs font-semibold text-en-dark mb-1">ENGLISH</div>
            <div className="text-lg">{item.en.target}</div>
          </div>
          <div className="bg-de-light border-l-4 border-de rounded p-4">
            <div className="text-xs font-semibold text-de-dark mb-1">DEUTSCH</div>
            <div className="text-lg">{item.de.target}</div>
          </div>
        </div>

        <button
          onClick={() => startTraining(item)}
          className="mt-6 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900"
        >
          🎯 Тренироваться
        </button>

        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-sm text-slate-600">Сравнение</h3>
          {item.contrast.map((c, i) => (
            <div
              key={i}
              className="text-sm bg-white rounded p-3 border border-slate-200"
            >
              <span className="font-mono text-xs text-slate-400 uppercase">
                {c.type}
              </span>
              <p className="mt-1">{c.note}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Экран: список ситуаций
  if (topic) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => setTopic(null)}
          className="text-sm text-slate-500 mb-4 hover:underline"
        >
          ← Все темы
        </button>
        <h2 className="text-xl font-bold mb-1">
          {topic.emoji} {topic.title}
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          {topic.items.length} ситуаций
        </p>

        <div className="space-y-3">
          {topic.items.map((it) => (
            <div
              key={it.id}
              className="bg-white rounded-lg p-4 border border-slate-200 hover:border-slate-400 transition"
            >
              <button
                onClick={() => setItem(it)}
                className="w-full text-left flex items-center gap-4"
              >
                <span className="text-3xl">{it.image}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{it.situation}</div>
                  <div className="text-xs text-slate-400 mt-1 truncate">
                    {it.en.target} · {it.de.target}
                  </div>
                </div>
              </button>
              <button
                onClick={() => startTraining(it)}
                className="mt-3 text-xs px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-900"
              >
                🎯 Тренироваться
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Экран: выбор темы
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Bilingual Builder</h1>
      <p className="text-slate-500 mb-6 text-sm">
        EN ↔ DE · параллельное изучение повседневных предложений
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setTopic(t)}
            className="text-left bg-white rounded-lg p-5 border border-slate-200 hover:border-slate-400 transition"
          >
            <div className="text-4xl mb-2">{t.emoji}</div>
            <div className="font-semibold">{t.title}</div>
            <div className="text-xs text-slate-400 mt-1">
              {t.items.length} ситуаций
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}