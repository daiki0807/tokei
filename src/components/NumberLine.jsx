const addMinutes = (hour, minute, delta) => {
  const total = hour * 60 + minute + delta
  return {
    hour: Math.floor(total / 60) % 24,
    minute: total % 60,
  }
}

const fmt = (h, m) => `${h}:${String(m).padStart(2, '0')}`

export default function NumberLine({ baseTime, elapsedMinutes, currentTime, problemType = 'forward' }) {
  const totalRange = 60
  const barWidth = Math.min((elapsedMinutes / totalRange) * 100, 100)
  // forward: バーは左端から伸びる / backward: バーは右端から左へ伸びる
  const barLeft = problemType === 'forward' ? 0 : Math.max(0, 100 - barWidth)
  // 現在位置（分針先端）のパーセント
  const currentPercent = problemType === 'forward' ? barWidth : barLeft

  // windowの起点：forwardはbaseTimeから、backwardはbaseTimeの60分前から
  const windowStartDelta = problemType === 'forward' ? 0 : -60
  const marks = Array.from({ length: 7 }, (_, i) => {
    const delta = windowStartDelta + i * 10
    const t = addMinutes(baseTime.hour, baseTime.minute, delta)
    return { delta, percent: (i * 10 / totalRange) * 100, ...t }
  })

  // 現在位置ラベル
  const currentLabel = fmt(currentTime.hour, currentTime.minute)
  const baseLabel = fmt(baseTime.hour, baseTime.minute)

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <p className="text-center text-xs font-bold text-gray-400 mb-3 tracking-wide">
        すうじのせん（タイムライン）
      </p>

      {/* トラック */}
      <div className="relative mx-2">
        <div className="relative h-12 bg-blue-100 rounded-full border-2 border-blue-200 overflow-hidden">
          {/* 進行バー */}
          <div
            className="absolute top-0 h-full rounded-full transition-all duration-300 ease-out"
            style={{
              left: `${barLeft}%`,
              width: `${barWidth}%`,
              background: 'linear-gradient(90deg, #fde68a 0%, #fb923c 100%)',
            }}
          />
          {/* 先端インジケーター（currentTime位置） */}
          {elapsedMinutes > 0 && elapsedMinutes < 60 && (
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-red-500 rounded-full transition-all duration-300"
              style={{ left: `calc(${currentPercent}% - 3px)` }}
            />
          )}
          {/* 目盛り線（10分ごと） */}
          {marks.slice(1, -1).map((m) => (
            <div
              key={m.delta}
              className="absolute top-0 bottom-0 w-px bg-blue-300 opacity-60"
              style={{ left: `${m.percent}%` }}
            />
          ))}
        </div>

        {/* 目盛りラベル */}
        <div className="relative h-10 mt-0.5">
          {marks.map((m) => (
            <div
              key={m.delta}
              className="absolute flex flex-col items-center"
              style={{
                left: `${m.percent}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="w-px h-2 bg-gray-400" />
              <span
                className="text-center leading-tight"
                style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}
              >
                {m.hour}:{String(m.minute).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 現在地ラベルバッジ（forward: はじまり→いま, backward: でた→ついた） */}
      <div className="flex justify-between items-center mt-2 px-1">
        {problemType === 'forward' ? (
          <>
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span className="text-xs font-bold text-blue-700">はじまり {baseLabel}</span>
            </div>
            {elapsedMinutes > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                <span>＋{elapsedMinutes}ふん</span>
                <span className="text-gray-400">▶</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
              <span className="text-xs font-bold text-orange-700">いま {currentLabel}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
              <span className="text-xs font-bold text-orange-700">でた {currentLabel}</span>
            </div>
            {elapsedMinutes > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold text-purple-600">
                <span>{elapsedMinutes}ふん あるく</span>
                <span className="text-gray-400">▶</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span className="text-xs font-bold text-blue-700">ついた {baseLabel}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
