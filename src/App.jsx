import { useState, useMemo } from 'react'
import AnalogClock from './components/AnalogClock'
import NumberLine from './components/NumberLine'
import AnswerCheck from './components/AnswerCheck'
import Celebration from './components/Celebration'

// 問題ランダム生成用データ
const PROBLEM_HOURS = [7, 8, 9, 10, 11, 1, 2, 3]
const PROBLEM_MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
const PROBLEM_ELAPSED = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function App() {
  // ===== 状態管理 =====
  const [baseHour, setBaseHour] = useState(8)
  const [baseMinute, setBaseMinute] = useState(40)
  const [elapsedMinutes, setElapsedMinutes] = useState(30)
  const [stepSize, setStepSize] = useState(5)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showWrong, setShowWrong] = useState(false)
  // 'forward' = じこく＋けいかじかん（あとのじこくをもとめる）
  // 'backward' = じこく－けいかじかん（まえのじこくをもとめる）
  const [problemType, setProblemType] = useState('forward')

  // currentTime は baseTime ± elapsedMinutes から導出
  const currentTime = useMemo(() => {
    const baseMins = baseHour * 60 + baseMinute
    const delta = problemType === 'forward' ? elapsedMinutes : -elapsedMinutes
    const total = (((baseMins + delta) % 1440) + 1440) % 1440
    return {
      hour: Math.floor(total / 60),
      minute: total % 60,
    }
  }, [baseHour, baseMinute, elapsedMinutes, problemType])

  const baseTime = { hour: baseHour, minute: baseMinute }

  // ===== ハンドラ =====
  const handleCheck = (answerHour, answerMinute) => {
    if (answerHour === currentTime.hour && answerMinute === currentTime.minute) {
      setShowCelebration(true)
      setShowWrong(false)
    } else {
      setShowWrong(true)
    }
  }

  const handleNext = () => {
    setShowCelebration(false)
    setShowWrong(false)
    // backwardの場合は baseTime >= elapsedMinutes となるよう調整
    const newElapsed = pick(PROBLEM_ELAPSED)
    let newHour = pick(PROBLEM_HOURS)
    const newMinute = pick(PROBLEM_MINUTES)
    if (problemType === 'backward' && newHour * 60 + newMinute < newElapsed) {
      newHour = Math.max(newHour, 2)
    }
    setBaseHour(newHour)
    setBaseMinute(newMinute)
    setElapsedMinutes(newElapsed)
  }

  const handleSliderChange = (e) => {
    setElapsedMinutes(Number(e.target.value))
    setShowWrong(false)
  }

  const handleBaseChange = () => {
    setShowWrong(false)
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: 'linear-gradient(160deg, #e0f2fe 0%, #f0fdf4 50%, #fef9c3 100%)' }}>

      {/* お祝いモーダル */}
      {showCelebration && <Celebration onClose={handleNext} />}

      {/* ===== ヘッダー ===== */}
      <div
        className="text-white text-center py-4 shadow-lg"
        style={{ background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)' }}
      >
        <h1 className="text-2xl font-black tracking-wider">⏰ じかんのけいさん</h1>
        <p className="text-sm opacity-80 mt-0.5">ながはりとすうじのせんでかんがえよう！</p>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-5 space-y-4">

        {/* ===== もんだい ===== */}
        <div className={`bg-white rounded-2xl p-4 shadow-md border-l-4 ${problemType === 'forward' ? 'border-blue-500' : 'border-purple-500'}`}>
          <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">
            もんだい {problemType === 'forward' ? '（じこく＋けいかじかん）' : '（じこく－けいかじかん）'}
          </p>
          {problemType === 'forward' ? (
            <>
              <p className="text-xl font-black text-gray-800 leading-snug">
                <span className="inline-block bg-blue-100 text-blue-700 rounded-xl px-2 py-0.5 mr-1">
                  {baseHour}じ {String(baseMinute).padStart(2, '0')}ふん
                </span>
                から
                <span className="inline-block bg-orange-100 text-orange-600 rounded-xl px-2 py-0.5 mx-1">
                  {elapsedMinutes}ふん
                </span>
                たったら、
              </p>
              <p className="text-xl font-black text-gray-800 mt-1">
                なんじ なんぷんですか？
              </p>
            </>
          ) : (
            <>
              <p className="text-xl font-black text-gray-800 leading-snug">
                <span className="inline-block bg-orange-100 text-orange-600 rounded-xl px-2 py-0.5 mr-1">
                  {elapsedMinutes}ふん
                </span>
                あるいて、
                <span className="inline-block bg-blue-100 text-blue-700 rounded-xl px-2 py-0.5 mx-1">
                  {baseHour}じ {String(baseMinute).padStart(2, '0')}ふん
                </span>
                に つきました。
              </p>
              <p className="text-xl font-black text-gray-800 mt-1">
                でたのは なんじ なんぷんですか？
              </p>
            </>
          )}
        </div>

        {/* ===== アナログ時計 ===== */}
        <div className="flex justify-center">
          <AnalogClock
            currentTime={currentTime}
            baseTime={baseTime}
            elapsedMinutes={elapsedMinutes}
            problemType={problemType}
          />
        </div>

        {/* ===== 数直線（タイムライン） ===== */}
        <NumberLine
          baseTime={baseTime}
          elapsedMinutes={elapsedMinutes}
          currentTime={currentTime}
          problemType={problemType}
        />

        {/* ===== スライダー ===== */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-700">
              けいかじかん：
              <span className="text-orange-500 text-2xl ml-1">{elapsedMinutes}</span>
              <span className="text-gray-700 text-lg">ふん</span>
            </p>
            {/* ステップ切り替え */}
            <div className="flex gap-1">
              {[1, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setStepSize(s)}
                  className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    stepSize === s
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {s}ふん
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="60"
            step={stepSize}
            value={elapsedMinutes}
            onChange={handleSliderChange}
          />

          {/* 目盛り表示 */}
          <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
            {[0, 15, 30, 45, 60].map((v) => (
              <span key={v}>{v}ふん</span>
            ))}
          </div>
        </div>

        {/* ===== こたえあわせ ===== */}
        <AnswerCheck
          currentTime={currentTime}
          onCheck={handleCheck}
          showWrong={showWrong}
        />

        {/* ===== もんだいをかえる（折りたたみ） ===== */}
        <details className="bg-white rounded-2xl shadow-md overflow-hidden">
          <summary className="px-5 py-4 cursor-pointer select-none font-bold text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            🔧 もんだいをかえる（せんせい・おうちのひとへ）
          </summary>
          <div className="px-5 py-4 border-t border-gray-100 space-y-5">

            {/* もんだいのタイプ */}
            <div>
              <p className="text-xs font-bold text-gray-400 mb-2">◎ もんだいのタイプ</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setProblemType('forward'); setShowWrong(false) }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                    problemType === 'forward'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  ➕ あとの じこく
                </button>
                <button
                  onClick={() => { setProblemType('backward'); setShowWrong(false) }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                    problemType === 'backward'
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  ➖ まえの じこく
                </button>
              </div>
            </div>

            {/* はじめのじこく / ついたじこく */}
            <div>
              <p className="text-xs font-bold text-gray-400 mb-2">
                ① {problemType === 'forward' ? 'はじめのじこく' : 'ついたじこく'}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={baseHour}
                  onChange={(e) => { setBaseHour(Number(e.target.value)); handleBaseChange() }}
                  className="border-2 border-blue-300 rounded-xl p-2 text-2xl font-black text-center w-20"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="text-xl font-black whitespace-nowrap">じ</span>
                <select
                  value={baseMinute}
                  onChange={(e) => { setBaseMinute(Number(e.target.value)); handleBaseChange() }}
                  className="border-2 border-blue-300 rounded-xl p-2 text-2xl font-black text-center w-24"
                >
                  {PROBLEM_MINUTES.map((m) => (
                    <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                  ))}
                </select>
                <span className="text-xl font-black whitespace-nowrap">ふん</span>
              </div>
            </div>

            {/* 何分後 */}
            <div>
              <p className="text-xs font-bold text-gray-400 mb-2">② なんぷんご（けいかじかん）</p>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={elapsedMinutes}
                  onChange={(e) => { setElapsedMinutes(Number(e.target.value)); setShowWrong(false) }}
                  className="border-2 border-orange-300 rounded-xl p-2 text-2xl font-black text-center w-24"
                >
                  {Array.from({ length: 12 }, (_, i) => (i + 1) * 5).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="text-xl font-black whitespace-nowrap">ふんご</span>
              </div>
            </div>

            {/* ランダムもんだいボタン */}
            <button
              onClick={handleNext}
              className="w-full bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-black text-base py-3 rounded-2xl transition-all shadow-md"
            >
              🎲 ランダムもんだいにする
            </button>
          </div>
        </details>

      </div>
    </div>
  )
}
