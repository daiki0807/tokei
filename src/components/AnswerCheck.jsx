import { useState, useEffect } from 'react'

export default function AnswerCheck({ currentTime, onCheck, showWrong }) {
  const [answerHour, setAnswerHour] = useState(0)
  const [answerMinute, setAnswerMinute] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)

  // 不正解のたびにシェイクアニメーションを再トリガー
  useEffect(() => {
    if (showWrong) {
      setShakeKey((k) => k + 1)
    }
  }, [showWrong])

  const handleSubmit = () => {
    onCheck(answerHour, answerMinute)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md mt-4">
      <p className="text-center font-black text-gray-700 mb-4" style={{ fontSize: '1.15rem' }}>
        こたえは　なんじ　なんぷん？
      </p>

      {/* 入力エリア — 1行に収める */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <select
          value={answerHour}
          onChange={(e) => setAnswerHour(Number(e.target.value))}
          className="text-center text-2xl font-black rounded-xl py-2 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          style={{ border: '3px solid #93c5fd', width: '68px' }}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
        <span className="text-xl font-black text-gray-600 whitespace-nowrap">じ</span>

        <select
          value={answerMinute}
          onChange={(e) => setAnswerMinute(Number(e.target.value))}
          className="text-center text-2xl font-black rounded-xl py-2 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          style={{ border: '3px solid #93c5fd', width: '76px' }}
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
          ))}
        </select>
        <span className="text-xl font-black text-gray-600 whitespace-nowrap">ふん</span>
      </div>

      {/* こたえあわせボタン */}
      <button
        onClick={handleSubmit}
        className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black text-xl py-4 rounded-2xl transition-all shadow-md"
        style={{ letterSpacing: '0.05em' }}
      >
        こたえあわせ！ ✅
      </button>

      {/* 不正解メッセージ */}
      {showWrong && (
        <div
          key={shakeKey}
          className="wrong-shake mt-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 text-center"
        >
          <p className="text-xl font-black text-yellow-600 mb-1">もういちどやってみよう！</p>
          <p className="text-sm text-gray-500">
            スライダーをうごかして、じかんをたしかめてみてね ⏰
          </p>
        </div>
      )}
    </div>
  )
}
