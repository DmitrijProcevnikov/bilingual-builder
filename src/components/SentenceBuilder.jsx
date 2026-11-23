import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const LANG_META = {
  en: {
    label: "ENGLISH",
    tileBg: "bg-en-light",
    tileBorder: "border-en",
    tileText: "text-en-dark",
    dropBg: "bg-blue-50",
    dropBorder: "border-en",
    accent: "bg-en text-white hover:bg-en-dark",
  },
  de: {
    label: "DEUTSCH",
    tileBg: "bg-de-light",
    tileBorder: "border-de",
    tileText: "text-de-dark",
    dropBg: "bg-amber-50",
    dropBorder: "border-de",
    accent: "bg-de text-white hover:bg-de-dark",
  },
};

function SortableTile({ id, text, meta }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-3 py-2 rounded-lg border-2 font-medium select-none cursor-grab active:cursor-grabbing ${meta.tileBg} ${meta.tileBorder} ${meta.tileText}`}
    >
      {text}
    </button>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SentenceBuilder({ item, lang, onDone, onBack }) {
  const meta = LANG_META[lang];
  const target = item[lang].target;
  const rawTiles = item[lang].tiles;

  // Уникальные id для плиток (на случай повторов слов, как "I ... I")
    const tilesKey = rawTiles.join("|");
    const initialTiles = useMemo(() => {
    const withIds = rawTiles.map((word, i) => ({ id: `${i}-${word}`, word }));
    return shuffle(withIds);
    }, [tilesKey]);
    
  const [tiles, setTiles] = useState(initialTiles);
  const [checked, setChecked] = useState(null); // null | "correct" | "wrong"

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tiles.findIndex((t) => t.id === active.id);
    const newIndex = tiles.findIndex((t) => t.id === over.id);
    setTiles(arrayMove(tiles, oldIndex, newIndex));
    setChecked(null);
  }

  function normalize(str) {
    return str.toLowerCase().replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();
  }

  function handleCheck() {
    const assembled = tiles.map((t) => t.word).join(" ");
    if (normalize(assembled) === normalize(target)) {
      setChecked("correct");
    } else {
      setChecked("wrong");
    }
  }

  function handleReset() {
    setTiles(shuffle(initialTiles.map((t) => ({ ...t }))));
    setChecked(null);
  }

  const assembled = tiles.map((t) => t.word).join(" ");

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
      <p className="text-xs text-slate-500 mb-4">{item[lang].structure}</p>

      {/* Зона сборки */}
      <div
        className={`min-h-[60px] rounded-lg border-2 border-dashed p-3 mb-4 ${meta.dropBg} ${meta.dropBorder}`}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tiles.map((t) => t.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {tiles.map((t) => (
                <SortableTile
                  key={t.id}
                  id={t.id}
                  text={t.word}
                  meta={meta}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="text-sm text-slate-600 mb-4">
        <span className="text-xs uppercase font-mono text-slate-400">
          {meta.label}:
        </span>{" "}
        <span>{assembled || "…"}</span>
      </div>

      {checked === "correct" && (
        <div className="mb-4 p-3 rounded bg-green-50 border border-green-300 text-green-800 text-sm">
          ✅ Верно! {target}
        </div>
      )}
      {checked === "wrong" && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-red-800 text-sm">
          ❌ Пока не совпадает. Попробуйте переставить плитки или нажмите «Сброс».
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleCheck}
          className={`px-4 py-2 rounded-lg font-medium ${meta.accent}`}
        >
          Проверить
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
        >
          Сброс
        </button>
        {checked === "correct" && (
          <button
            onClick={onDone}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 ml-auto"
          >
            Далее →
          </button>
        )}
      </div>
    </div>
  );
}