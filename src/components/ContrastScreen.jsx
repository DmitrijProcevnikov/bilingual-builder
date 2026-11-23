export default function ContrastScreen({ item, onDone, onBack }) {
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
      <p className="text-xs text-slate-500 mb-4">Сравнение</p>

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

      <div className="space-y-2 mb-6">
        <h3 className="font-semibold text-sm text-slate-600">Что важно</h3>
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

      {item.false_friends?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-sm text-slate-600 mb-2">
            ⚠️ Ложные друзья
          </h3>
          {item.false_friends.map((f, i) => (
            <div
              key={i}
              className="text-sm bg-red-50 rounded p-3 border border-red-200"
            >
              <span className="font-mono">
                {f.en} → {f.de}
              </span>{" "}
              <span className="text-red-600">(не «{f.trap}»)</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onDone}
        className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900"
      >
        Готово ✓
      </button>
    </div>
  );
}