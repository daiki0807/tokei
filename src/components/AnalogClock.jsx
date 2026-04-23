const toRad = (deg) => (deg * Math.PI) / 180

const handPoint = (cx, cy, angleDeg, length) => ({
  x: cx + length * Math.sin(toRad(angleDeg)),
  y: cy - length * Math.cos(toRad(angleDeg)),
})

export default function AnalogClock({ currentTime, baseTime, elapsedMinutes }) {
  const cx = 150
  const cy = 150
  const r = 118

  // 角度 (12時を0°として時計回り)
  const currentMinuteAngle = currentTime.minute * 6
  const currentHourAngle = ((currentTime.hour % 12) * 60 + currentTime.minute) / 2
  const baseMinuteAngle = baseTime.minute * 6

  const minuteEnd = handPoint(cx, cy, currentMinuteAngle, 82)
  const hourEnd = handPoint(cx, cy, currentHourAngle, 54)
  const baseMarker = handPoint(cx, cy, baseMinuteAngle, r - 10)

  // 経過時間を示すアーク（分針のトラック上）
  const arcR = r - 6
  const arcStart = handPoint(cx, cy, baseMinuteAngle, arcR)
  const arcEnd = handPoint(cx, cy, currentMinuteAngle, arcR)
  const largeArc = elapsedMinutes > 30 ? 1 : 0

  let arcPath = null
  if (elapsedMinutes >= 60) {
    // 全周
    arcPath = `M ${cx} ${cy - arcR} A ${arcR} ${arcR} 0 1 1 ${cx - 0.01} ${cy - arcR}`
  } else if (elapsedMinutes > 0) {
    arcPath = `M ${arcStart.x} ${arcStart.y} A ${arcR} ${arcR} 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`
  }

  return (
    <div className="relative inline-block">
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
      >
        {/* 外枠 */}
        <circle cx={cx} cy={cy} r={r + 8} fill="#bfdbfe" stroke="#93c5fd" strokeWidth="3" />

        {/* 文字盤 */}
        <circle cx={cx} cy={cy} r={r} fill="white" />

        {/* 経過時間アーク */}
        {arcPath && (
          <path
            d={arcPath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.75"
          />
        )}

        {/* 目盛り（60本） */}
        {Array.from({ length: 60 }, (_, i) => {
          const isHour = i % 5 === 0
          const angle = toRad(i * 6 - 90)
          const r1 = r - 3
          const r2 = isHour ? r - 20 : r - 11
          return (
            <line
              key={i}
              x1={cx + r1 * Math.cos(angle)}
              y1={cy + r1 * Math.sin(angle)}
              x2={cx + r2 * Math.cos(angle)}
              y2={cy + r2 * Math.sin(angle)}
              stroke={isHour ? '#1e40af' : '#bfdbfe'}
              strokeWidth={isHour ? 2.5 : 1.2}
            />
          )
        })}

        {/* 時数字 */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = toRad(i * 30 - 90)
          const nr = r - 34
          return (
            <text
              key={num}
              x={cx + nr * Math.cos(angle)}
              y={cy + nr * Math.sin(angle)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="16"
              fontWeight="800"
              fill="#1e40af"
              fontFamily="'M PLUS Rounded 1c', sans-serif"
            >
              {num}
            </text>
          )
        })}

        {/* 基準時刻マーカー（青い丸） */}
        <circle
          cx={baseMarker.x}
          cy={baseMarker.y}
          r={5.5}
          fill="#3b82f6"
          stroke="white"
          strokeWidth="2"
        />

        {/* 短針（時針） */}
        <line
          x1={cx}
          y1={cy}
          x2={hourEnd.x}
          y2={hourEnd.y}
          stroke="#1e3a8a"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* 長針（分針） */}
        <line
          x1={cx}
          y1={cy}
          x2={minuteEnd.x}
          y2={minuteEnd.y}
          stroke="#2563eb"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* 中心キャップ */}
        <circle cx={cx} cy={cy} r={9} fill="#1e3a8a" />
        <circle cx={cx} cy={cy} r={4} fill="white" />

        {/* 現在時刻ラベル（盤面下部） */}
        <rect
          x={cx - 44}
          y={cy + 62}
          width={88}
          height={30}
          rx={10}
          fill="#eff6ff"
          stroke="#bfdbfe"
          strokeWidth="1.5"
        />
        <text
          x={cx}
          y={cy + 80}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="17"
          fontWeight="800"
          fill="#1e40af"
          fontFamily="'M PLUS Rounded 1c', monospace"
        >
          {String(currentTime.hour).padStart(2, '0')}:{String(currentTime.minute).padStart(2, '0')}
        </text>
      </svg>

      {/* 凡例 */}
      <div className="flex justify-center gap-4 mt-1 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
          はじめのじこく
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-5 h-2 rounded-full bg-yellow-400 opacity-80" />
          けいかじかん
        </span>
      </div>
    </div>
  )
}
