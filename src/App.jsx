import { useState } from "react";
import { topics } from "./data";
import SentenceBuilder from "./components/SentenceBuilder";
import ContrastScreen from "./components/ContrastScreen";
import SwitchMode from "./components/SwitchMode";
import MistakesScreen from "./components/MistakesScreen";
import StreakBar from "./components/StreakBar";
import { useProgress } from "./hooks/useProgress";

export default function App() {
  const { progress, answer, mistake, clearAllMistakes } = useProgress();

  const [screen, setScreen] = useState("home"); // home | topic | item | train | contrast | switch | mistakes
  const [topic, setTopic] = useState(null);
  const [item, setItem] = useState(null);
  const [lang, setLang] = useState("en");

  // Тренировка: сборка EN → DE → контраст
  if (screen === "train" && item) {
    return (
      <SentenceBuilder
        key={`${item.id}-${lang}`}
        item={item}
        lang={lang}
        onBack={() => {
          if (lang === "en") setScreen("item");
          else setLang("en");
        }}
        onDone={() => {
          if (lang === "en") setLang("de");
          else setScreen("contrast");
        }}
        onAnswer={(isCorrect) => answer(lang, isCorrect)}
        onMistake={() =>
          mistake({
            itemId: item.id,
            topicId: topic?.id,
            lang,
            type: "builder_wrong_order",
          })
        }
      />
    );
  }

  if (screen === "contrast" && item) {
    return (
      <ContrastScreen
        item={item}
        onBack={() => {
          setLang("de");
          setScreen("train");
        }}
        onDone={() => setScreen("item")}
      />
    );
  }

  if (screen === "switch" && item && topic) {
    return (
      <SwitchMode
        item={item}
        allItems={topic.items}
        topicId={topic.id}
        onAnswer={(isCorrect) => answer("de", isCorrect)}
        onMistake={(type) =>
          mistake({ itemId: item.id, topicId: topic.id, lang: "de", type })
        }
        onNext={() => setScreen("item")}
        onBack={() => setScreen("item")}
      />
    );
  }

  if (screen === "mistakes") {
    return (
      <MistakesScreen
        progress={progress}
        onClear={clearAllMistakes}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "item" && item) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => setScreen("topic")}
          className="text-sm text-slate-500 mb-4 hover:underline"
        >
          ← Назад к теме
        </button>
        <h2 className="text-xl font-bold mb-2">{item.situation}</h2>
        <div className="text-6xl mb-6">{item.image}</div>

        <div className="space-y-4 mb-6">
          <div className="bg-en-light border-l-4 border-en rounded p-4">
            <div className="text-xs font-semibold text-en-dark mb-1">ENGLISH</div>
            <div className="text-lg">{item.en.target}</div>
          </div>
          <div className="bg-de-light border-l-4 border-de rounded p-4">
            <div className="text-xs font-semibold text-de-dark mb-1">DEUTSCH</div>
            <div className="text-lg">{item.de.target}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => {
              setLang("en");
              setScreen("train");
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900"
          >
            🎯 Собрать предложение
          </button>
          <button
            onClick={() => setScreen("switch")}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
          >
            🔄 Переключение
          </button>
        </div>

        <div className="space-y-2">
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

  if (screen === "topic" && topic) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => setScreen("home")}
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
        onClick={() => {
          setItem(it);
          setScreen("item");
        }}
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

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setItem(it);
            setLang("en");
            setScreen("train");
          }}
          className="text-xs px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-900"
        >
          🎯 Тренироваться
        </button>
        <button
          onClick={() => {
            setItem(it);
            setScreen("switch");
          }}
          className="text-xs px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-100"
        >
          🔄 Переключение
        </button>
      </div>
    </div>
  ))}
</div>      </div>
    );
  }

  // Главная
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-baseline justify-between mb-1">
        <h1 className="text-2xl font-bold">Bilingual Builder</h1>
        <button
          onClick={() => setScreen("mistakes")}
          className="text-sm text-slate-500 hover:underline"
        >
          Мои ошибки ({progress.mistakes.length})
        </button>
      </div>
      <p className="text-slate-500 mb-6 text-sm">
        EN ↔ DE · параллельное изучение повседневных предложений
      </p>

      <StreakBar progress={progress} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTopic(t);
              setScreen("topic");
            }}
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