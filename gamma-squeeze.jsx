
import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, BarChart, Bar, Legend } from "recharts";

const STAGES = [
  {
    id: 0,
    label: "初始状态",
    desc: "散户在社交媒体协调，集中大量买入价外看涨期权（OTM Call）",
    color: "#60a5fa",
  },
  {
    id: 1,
    label: "做市商被迫对冲",
    desc: "做市商卖出看涨期权后，必须买入正股进行 Delta 中性对冲，股价开始上涨",
    color: "#f59e0b",
  },
  {
    id: 2,
    label: "Gamma 加速效应",
    desc: "股价靠近行权价，Gamma 飙升，Delta 急剧增加，做市商被迫买入更多股票",
    color: "#f97316",
  },
  {
    id: 3,
    label: "正反馈循环爆发",
    desc: "股价上涨 → Delta 增加 → 做市商买股 → 股价再涨，雪球越滚越大！",
    color: "#ef4444",
  },
  {
    id: 4,
    label: "轧空叠加（GME式）",
    desc: "空头被迫回补仓位，买盘与 Gamma 效应叠加，股价爆炸性上涨",
    color: "#a855f7",
  },
];

function generateData(stage) {
  const points = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    let price = 20;
    let delta = 0.1 + t * 0.15;
    let gamma = 0.05 + t * 0.1;
    let shortPressure = 0;
    let buyPressure = 5 + t * 10;

    if (stage >= 1) {
      price = 20 + t * 15;
      delta = 0.15 + t * 0.25;
      gamma = 0.05 + t * 0.2;
      buyPressure = 10 + t * 20;
    }
    if (stage >= 2) {
      const acc = Math.pow(t, 1.5);
      price = 20 + acc * 40;
      delta = 0.1 + acc * 0.75;
      gamma = 0.05 + Math.sin(t * Math.PI) * 0.6 + t * 0.15;
      buyPressure = 15 + acc * 60;
    }
    if (stage >= 3) {
      const acc = Math.pow(t, 1.2);
      price = 20 + acc * 80 + Math.pow(t, 3) * 60;
      delta = Math.min(0.98, 0.1 + acc * 0.85);
      gamma = Math.max(0, 0.8 * Math.exp(-Math.pow((t - 0.55) * 3, 2)));
      buyPressure = 20 + acc * 120;
    }
    if (stage >= 4) {
      const acc = Math.pow(t, 1.1);
      shortPressure = acc * 80;
      price = 20 + acc * 150 + Math.pow(t, 2.5) * 150 + shortPressure * 0.8;
      delta = Math.min(0.99, 0.1 + acc * 0.88);
      gamma = Math.max(0, 0.9 * Math.exp(-Math.pow((t - 0.5) * 2.5, 2)));
      buyPressure = 20 + acc * 200 + shortPressure;
    }

    points.push({
      t: i,
      price: Math.round(price * 10) / 10,
      delta: Math.round(Math.min(delta, 0.99) * 100) / 100,
      gamma: Math.round(Math.max(gamma, 0) * 100) / 100,
      buyPressure: Math.round(buyPressure),
      shortPressure: Math.round(shortPressure),
    });
  }
  return points;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-600 rounded p-2 text-xs">
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GammaSqueeze() {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animData, setAnimData] = useState([]);
  const fullData = generateData(stage);
  const timerRef = useRef(null);
  const stageRef = useRef(stage);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    setProgress(0);
    setAnimData([]);
  }, [stage]);

  useEffect(() => {
    if (playing) {
      let p = 0;
      const data = generateData(stageRef.current);
      timerRef.current = setInterval(() => {
        p++;
        setProgress(p);
        setAnimData(data.slice(0, p + 1));
        if (p >= 60) {
          clearInterval(timerRef.current);
          setPlaying(false);
        }
      }, 40);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing]);

  const displayData = playing ? animData : fullData;
  const current = displayData[displayData.length - 1] || fullData[0];
  const stageInfo = STAGES[stage];

  const handlePlay = () => {
    setProgress(0);
    setAnimData([]);
    setPlaying(true);
  };

  const maxPrice = stage === 0 ? 50 : stage <= 2 ? 100 : stage === 3 ? 200 : 500;

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen p-4 font-sans">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">⚡ Gamma Squeeze 动态演示</h1>
        <p className="text-gray-400 text-sm mt-1">期权伽马挤压机制可视化 · 基于GME经典案例</p>
      </div>

      {/* Stage Selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {STAGES.map((s) => (
          <button
            key={s.id}
            onClick={() => { setStage(s.id); setPlaying(false); }}
            className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold border transition-all"
            style={{
              background: stage === s.id ? s.color + "33" : "transparent",
              borderColor: stage === s.id ? s.color : "#374151",
              color: stage === s.id ? s.color : "#9ca3af",
            }}
          >
            {s.id + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Stage Info */}
      <div className="rounded-xl p-3 mb-4 border" style={{ background: stageInfo.color + "15", borderColor: stageInfo.color + "50" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: stageInfo.color }} />
          <span className="font-bold text-sm" style={{ color: stageInfo.color }}>阶段 {stage + 1}：{stageInfo.label}</span>
        </div>
        <p className="text-gray-300 text-xs leading-relaxed">{stageInfo.desc}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "股价", value: `$${current?.price?.toFixed(1)}`, color: "#34d399" },
          { label: "Delta Δ", value: current?.delta?.toFixed(2), color: "#60a5fa" },
          { label: "Gamma Γ", value: current?.gamma?.toFixed(2), color: "#f97316" },
          { label: "买压指数", value: current?.buyPressure, color: "#f59e0b" },
        ].map((m) => (
          <div key={m.label} className="bg-gray-900 rounded-lg p-2 text-center border border-gray-800">
            <div className="text-gray-400 text-xs mb-1">{m.label}</div>
            <div className="font-bold text-sm" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Price Chart */}
      <div className="bg-gray-900 rounded-xl p-3 mb-3 border border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-semibold">📈 股价走势</span>
          <span className="text-xs" style={{ color: stageInfo.color }}>
            {stage >= 3 ? "爆炸性上涨 🚀" : stage >= 2 ? "加速上涨 ⬆️" : stage >= 1 ? "温和上涨 ↗️" : "震荡横盘 →"}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stageInfo.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={stageInfo.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="t" hide />
            <YAxis domain={[0, maxPrice]} tick={{ fontSize: 10, fill: "#6b7280" }} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={50} stroke="#374151" strokeDasharray="4 4" label={{ value: "行权价 $50", fill: "#6b7280", fontSize: 9 }} />
            <Area type="monotone" dataKey="price" stroke={stageInfo.color} fill="url(#priceGrad)" strokeWidth={2} dot={false} name="股价($)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Delta & Gamma */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
          <div className="text-xs text-gray-400 mb-2">📐 Delta 变化</div>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: "#6b7280" }} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="delta" stroke="#60a5fa" strokeWidth={2} dot={false} name="Delta" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-gray-500 text-xs mt-1">Delta 趋近 1 → 做市商买股需求暴增</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
          <div className="text-xs text-gray-400 mb-2">⚡ Gamma 峰值</div>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: "#6b7280" }} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="gamma" stroke="#f97316" strokeWidth={2} dot={false} name="Gamma" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-gray-500 text-xs mt-1">Gamma 在行权价附近达到峰值</p>
        </div>
      </div>

      {/* Buy Pressure */}
      <div className="bg-gray-900 rounded-xl p-3 mb-4 border border-gray-800">
        <div className="text-xs text-gray-400 mb-2">🔥 市场买盘压力（做市商对冲 + 空头回补）</div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={displayData.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="t" hide />
            <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} width={35} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="buyPressure" fill="#f59e0b" name="做市商买压" radius={[2, 2, 0, 0]} />
            {stage >= 4 && <Bar dataKey="shortPressure" fill="#a855f7" name="空头回补" radius={[2, 2, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback Loop Visual */}
      <div className="bg-gray-900 rounded-xl p-3 mb-4 border border-gray-800">
        <div className="text-xs text-gray-400 mb-3">🔄 正反馈循环机制</div>
        <div className="flex items-center justify-between text-center gap-1">
          {[
            { icon: "👥", label: "散户买\n看涨期权", active: stage >= 0 },
            { icon: "→", label: "", plain: true },
            { icon: "🏦", label: "做市商被迫\n买入正股", active: stage >= 1 },
            { icon: "→", label: "", plain: true },
            { icon: "📈", label: "股价\n上涨", active: stage >= 1 },
            { icon: "→", label: "", plain: true },
            { icon: "⚡", label: "Gamma\n飙升", active: stage >= 2 },
            { icon: "↩", label: "", plain: true },
          ].map((item, i) =>
            item.plain ? (
              <div key={i} className="text-gray-600 text-sm font-bold">{item.icon}</div>
            ) : (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all"
                  style={{
                    background: item.active ? stageInfo.color + "30" : "#1f2937",
                    border: `1px solid ${item.active ? stageInfo.color : "#374151"}`,
                  }}
                >
                  {item.icon}
                </div>
                <span className="text-gray-400 text-xs leading-tight whitespace-pre-wrap">{item.label}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handlePlay}
          disabled={playing}
          className="px-6 py-2 rounded-lg font-bold text-sm transition-all"
          style={{
            background: playing ? "#374151" : stageInfo.color,
            color: playing ? "#6b7280" : "#000",
            cursor: playing ? "not-allowed" : "pointer",
          }}
        >
          {playing ? "⏳ 播放中..." : "▶ 播放动画"}
        </button>
        <button
          onClick={() => { setPlaying(false); setProgress(60); setAnimData(fullData); }}
          className="px-4 py-2 rounded-lg text-sm border border-gray-700 text-gray-300 hover:border-gray-500"
        >
          ⏭ 跳至结尾
        </button>
      </div>

      {/* Progress Bar */}
      {playing && (
        <div className="mt-3 bg-gray-800 rounded-full h-1">
          <div
            className="h-1 rounded-full transition-all"
            style={{ width: `${(progress / 60) * 100}%`, background: stageInfo.color }}
          />
        </div>
      )}

      <p className="text-center text-gray-600 text-xs mt-4">⚠️ 仅供教育演示，不构成投资建议</p>
    </div>
  );
}
