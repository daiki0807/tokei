import { useEffect, useState } from 'react'

const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#da77f2', '#74c0fc']

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 1.8 + Math.random() * 1.2,
      size: 8 + Math.random() * 10,
      isCircle: Math.random() > 0.4,
    }))
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 60 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-30px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

const STARS = ['⭐', '🌟', '✨', '🎉', '🎊']

export default function Celebration({ onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Confetti />

      {/* オーバーレイ */}
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 50, background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      >
        {/* カード */}
        <div
          className="celebration-card bg-white rounded-3xl p-8 text-center mx-4 max-w-xs w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 回転する星 */}
          <div className="text-5xl mb-1 star-spin inline-block">⭐</div>

          <h2
            className="font-black mb-1"
            style={{ fontSize: '2.4rem', color: '#f59e0b', lineHeight: 1.1 }}
          >
            だいせいかい！
          </h2>

          <p className="text-4xl mb-4">🎉🎊🎉</p>

          <p className="text-lg font-bold text-gray-600 mb-6">
            すごいね！よくできました！
          </p>

          {/* ランダムなほめことば */}
          <p className="text-sm text-gray-400 mb-6">
            {
              [
                'あたまいい！',
                'かんぺき！',
                'てんさい！',
                'もんだいなし！',
                'ばっちり！',
              ][Math.floor(Math.random() * 5)]
            }
          </p>

          <button
            onClick={onClose}
            className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black text-xl py-3 rounded-2xl transition-all shadow-md"
          >
            つぎのもんだいへ 👉
          </button>
        </div>
      </div>
    </>
  )
}
