export default function StreakBar({ progress }) {
  const { streaks, bestStreaks, stats } = progress;

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-en-light border border-en rounded-lg p-3">
        <div className="text-xs font-semibold text-en-dark uppercase mb-1">
          English
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-en-dark">
            🔥 {streaks.en}
          </span>
          <span className="text-xs text-slate-500">серия</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          рекорд: {bestStreaks.en} · ✓ {stats.en.correct} · ✗ {stats.en.wrong}
        </div>
      </div>

      <div className="bg-de-light border border-de rounded-lg p-3">
        <div className="text-xs font-semibold text-de-dark uppercase mb-1">
          Deutsch
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-de-dark">
            🔥 {streaks.de}
          </span>
          <span className="text-xs text-slate-500">серия</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          рекорд: {bestStreaks.de} · ✓ {stats.de.correct} · ✗ {stats.de.wrong}
        </div>
      </div>
    </div>
  );
}