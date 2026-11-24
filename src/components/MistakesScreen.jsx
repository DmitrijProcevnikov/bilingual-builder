import { topics } from "../data";

export default function MistakesScreen({ progress, onClear, onBack }) {
  const { mistakes } = progress;

  // Собираем lookup itemId -> item + topicId
  const itemMap = {};
  for (const t of topics) {
    for (const it of t.items) {
      itemMap[it.id] = { item: it, topicId: t.id, topicTitle: t.title };
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onBack}
        className="text-sm text-slate-500 mb-4 hover:underline"
      >
        ← На главную
      </button>

      <h2 className="text-xl font-bold mb-1">Мои ошибки</h2>
      <p className="text-slate-500 text-sm mb-4">
        {mistakes.length === 0
          ? "Пока пусто — так держать!"
          : `${mistakes.length} записей. Это места, где вы путали языки.`}
      </p>

      {mistakes.length > 0 && (
        <>
          <div className="space-y-2 mb-4">
            {mistakes.map((m, i) => {
              const info = itemMap[m.itemId];
              if (!info) return null;
              return (
                <div
                  key={i}
                  className="bg-white rounded-lg p-3 border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{info.item.image}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {info.item.situation}
                      </div>
                      <div className="text-xs text-slate-400">
                        {info.topicTitle} ·{" "}
                        <span className="font-mono">{m.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs mt-2 space-y-1">
                    <div className="text-en-dark">
                      EN: {info.item.en.target}
                    </div>
                    <div className="text-de-dark">
                      DE: {info.item.de.target}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClear}
            className="text-sm px-3 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50"
          >
            Очистить список
          </button>
        </>
      )}
    </div>
  );
}