
import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

const STAGES = [
  { id: 0, label: "巨量期权买单涌入", emoji: "💥", sub: "初始突袭",
    desc: "投资者突袭式买入10万手看涨期权，做市商被动接单，Delta 敞口瞬间形成", color: "#60a5fa" },
  { id: 1, label: "做市商形成空头敞口", emoji: "🏦", sub: "敞口暴露",
    desc: "做市商持有海量看涨期权空头，风控警报：承担 -400万股的负 Delta 敞口", color: "#f59e0b" },
  { id: 2, label: "被迫机械性买入正股", emoji: "🤖", sub: "强制对冲",
    desc: "算法自动触发对冲指令，价格不敏感地买入400万股正股，抽干市价卖单", color: "#f97316" },
  { id: 3, label: "股价被暴力推升", emoji: "🚀", sub: "价格挤压",
    desc: "400万股无脑买盘瞬间抽干流动性，供求失衡，正股价格被强行推高", color: "#ef4444" },
  { id: 4, label: "演变为伽马挤压", emoji: "🌀", sub: "螺旋升级",
    desc: "股价上涨 → Delta 从0.4升至0.6+ → 做市商需再买200万股 → 死亡螺旋启动", color: "#a855f7" },
];

function genData(stage) {
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    let price = 20, delta = 0.4, exposure = 0, hedgeBuy = 0, optionVolume = 0, askLiquidity = 100;

    if (stage >= 0) {
      optionVolume = Math.min(t * 2.5, 1) * 10;
      exposure = optionVolume * 100 * 0.4 / 10000;
    }
    if (stage >= 1) {
      exposure = optionVolume * 100 * 0.4 / 10000;
    }
    if (stage >= 2) {
      hedgeBuy = Math.min(t * 1.8, 1) * 400;
      askLiquidity = Math.max(5, 100 - hedgeBuy * 0.22);
    }
    if (stage >= 3) {
      const acc = Math.pow(t, 1.3);
      price = 20 + acc * 60 + Math.pow(t, 2) * 40;
      delta = Math.min(0.95, 0.4 + acc * 0.5);
      askLiquidity = Math.max(2, 100 - hedgeBuy * 0.24 - acc * 30);
    }
    if (stage >= 4) {
      const acc = Math.pow(t, 1.1);
      price = 20 + acc * 120 + Math.pow(t, 2.5) * 100;
      delta = Math.min(0.98, 0.4 + acc * 0.55);
      hedgeBuy = Math.min(400 + Math.min(t * 1.5, 1) * 200, 600);
      askLiquidity = Math.max(1, 5 - acc * 4);
      optionVolume = Math.min(t * 3, 1) * 15;
      exposure = optionVolume * 100 * delta / 10000;
    }

    pts.push({
      t: i,
      price: +price.toFixed(1),
      delta: +Math.min(delta, 0.98).toFixed(2),
      exposure: +exposure.toFixed(1),
      hedgeBuy: +hedgeBuy.toFixed(0),
      optionVolume: +optionVolume.toFixed(1),
      askLiquidity: +Math.max(askLiquidity, 0).toFixed(1),
    });
  }
  return pts;
}

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#111827", border: "1px solid #374151", borderRadius: 6, padding: "6px 10px" }}>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#fff", fontSize: 11 }}>{p.name}: <b>{p.value}</b></div>
      ))}
    </div>
  );
};

function AnimNum({ value = 0, dec = 0, pre = "", suf = "" }) {
  const [disp, setDisp] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const end = parseFloat(value);
    let cur = 0;
    const step = (end - cur) / 30;
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      cur += step;
      if ((step >= 0 && cur >= end) || (step < 0 && cur <= end)) { cur = end; clearInterval(ref.current); }
      setDisp(cur);
    }, 18);
    return () => clearInterval(ref.current);
  }, [value]);
  return <>{pre}{disp.toFixed(dec)}{suf}</>;
}

export default function DeltaSqueeze() {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [animData, setAnimData] = useState([]);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  const fullData = genData(stage);
  const displayData = playing ? animData : fullData;
  const cur = displayData[displayData.length - 1] || fullData[0];
  const info = STAGES[stage];
  const maxPrice = stage <= 2 ? 50 : stage === 3 ? 130 : 320;

  useEffect(() => { setProgress(0); setAnimData([]); }, [stage]);

  const handlePlay = () => {
    clearInterval(timerRef.current);
    setAnimData([]); setProgress(0); setPlaying(true);
    let p = 0;
    const data = genData(stageRef.current);
    timerRef.current = setInterval(() => {
      p++;
      setProgress(p);
      setAnimData(data.slice(0, p + 1));
      if (p >= 60) { clearInterval(timerRef.current); setPlaying(false); }
    }, 38);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);

  const FLOW = [
    { icon: "👥", label: "买入\n看涨期权", active: stage >= 0, color: "#60a5fa" },
    { icon: "🏦", label: "做市商\n负Delta敞口", active: stage >= 1, color: "#f59e0b" },
    { icon: "🤖", label: "强制买入\n正股", active: stage >= 2, color: "#f97316" },
    { icon: "💧", label: "流动性\n耗尽", active: stage >= 3, color: "#ef4444" },
    { icon: "📈", label: "股价\n爆拉", active: stage >= 3, color: "#ef4444" },
    { icon: "🌀", label: "Gamma\n螺旋", active: stage >= 4, color: "#a855f7" },
  ];

  return (
    <div style={{ background: "#030712", color: "#f3f4f6", minHeight: "100vh", padding: 16, fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>🔱 Delta Squeeze 动态演示</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>德尔塔挤压机制可视化 · 尾巴摇狗 Tail Wags the Dog</div>
      </div>

      {/* Stage tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
        {STAGES.map(s => (
          <button key={s.id} onClick={() => { setStage(s.id); setPlaying(false); }}
            style={{
              flexShrink: 0, padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer",
              border: `1.5px solid ${stage === s.id ? s.color : "#374151"}`,
              background: stage === s.id ? s.color + "22" : "transparent",
              color: stage === s.id ? s.color : "#9ca3af",
            }}>
            {s.emoji} {s.id + 1}. {s.sub}
          </button>
        ))}
      </div>

      {/* Stage card */}
      <div style={{ borderRadius: 12, padding: "10px 14px", marginBottom: 14, border: `1px solid ${info.color}40`, background: info.color + "10" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 18 }}>{info.emoji}</span>
          <span style={{ fontWeight: 700, fontSize: 13, color: info.color }}>步骤 {stage + 1}：{info.label}</span>
        </div>
        <p style={{ color: "#d1d5db", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "正股价格", value: cur?.price, pre: "$", dec: 1, color: "#34d399" },
          { label: "负Delta敞口", value: cur?.exposure, suf: "百万股", dec: 1, color: "#f59e0b" },
          { label: "对冲买入量", value: cur?.hedgeBuy, suf: "万股", dec: 0, color: "#f97316" },
        ].map(m => (
          <div key={m.label} style={{ background: "#111827", borderRadius: 10, padding: "8px 6px", textAlign: "center", border: "1px solid #1f2937" }}>
            <div style={{ color: "#6b7280", fontSize: 10, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: m.color }}>
              <AnimNum value={m.value ?? 0} dec={m.dec} pre={m.pre ?? ""} suf={m.suf ?? ""} />
            </div>
          </div>
        ))}
      </div>

      {/* Price */}
      <div style={{ background: "#111827", borderRadius: 12, padding: "10px 12px", marginBottom: 10, border: "1px solid #1f2937" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>📈 正股价格走势</span>
          <span style={{ fontSize: 11, color: info.color }}>
            {stage >= 4 ? "死亡螺旋 🌀" : stage >= 3 ? "暴力推升 🚀" : stage >= 2 ? "初步拉升 ↗️" : "横盘等待 →"}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={info.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={info.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="t" hide />
            <YAxis domain={[0, maxPrice]} tick={{ fontSize: 9, fill: "#6b7280" }} width={38} />
            <Tooltip content={<Tip />} />
            <ReferenceLine y={30} stroke="#374151" strokeDasharray="4 4"
              label={{ value: "行权价 $30", fill: "#6b7280", fontSize: 9 }} />
            <Area type="monotone" dataKey="price" stroke={info.color} fill="url(#pg2)" strokeWidth={2} dot={false} name="股价($)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Delta + Option Vol */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{ background: "#111827", borderRadius: 12, padding: "10px 12px", border: "1px solid #1f2937" }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>📐 Delta 值变化</div>
          <ResponsiveContainer width="100%" height={85}>
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: "#6b7280" }} width={26} />
              <Tooltip content={<Tip />} />
              <ReferenceLine y={0.4} stroke="#374151" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="delta" stroke="#60a5fa" strokeWidth={2} dot={false} name="Delta" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 10, color: "#4b5563", marginTop: 4 }}>0.4 → 0.9+ 触发追加对冲</div>
        </div>
        <div style={{ background: "#111827", borderRadius: 12, padding: "10px 12px", border: "1px solid #1f2937" }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>📊 期权成交量（万手）</div>
          <ResponsiveContainer width="100%" height={85}>
            <AreaChart data={displayData}>
              <defs>
                <linearGradient id="og2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="t" hide />
              <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} width={26} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="optionVolume" stroke="#f59e0b" fill="url(#og2)" strokeWidth={2} dot={false} name="期权量(万手)" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 10, color: "#4b5563", marginTop: 4 }}>巨量买单涌入催生对冲压力</div>
        </div>
      </div>

      {/* Hedge buy vs liquidity */}
      <div style={{ background: "#111827", borderRadius: 12, padding: "10px 12px", marginBottom: 10, border: "1px solid #1f2937" }}>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>🤖 对冲买入量 vs 市场卖单流动性</div>
        <ResponsiveContainer width="100%" height={105}>
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="t" hide />
            <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} width={34} />
            <Tooltip content={<Tip />} />
            <Line type="monotone" dataKey="hedgeBuy" stroke="#f97316" strokeWidth={2} dot={false} name="对冲买入(万股)" />
            <Line type="monotone" dataKey="askLiquidity" stroke="#34d399" strokeWidth={2} dot={false} strokeDasharray="4 3" name="卖单流动性(%)" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
          <span style={{ fontSize: 10, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#f97316" }}>●</span> 强制买入暴增
          </span>
          <span style={{ fontSize: 10, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#34d399" }}>- -</span> 流动性耗尽
          </span>
        </div>
      </div>

      {/* Flow chain */}
      <div style={{ background: "#111827", borderRadius: 12, padding: "10px 12px", marginBottom: 14, border: "1px solid #1f2937" }}>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>🔄 德尔塔挤压传导链</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {FLOW.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, flexShrink: 0, transition: "all 0.3s",
                background: item.active ? item.color + "25" : "#1f2937",
                border: `1.5px solid ${item.active ? item.color : "#374151"}`,
              }}>{item.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{ fontSize: 11, color: item.active ? item.color : "#4b5563", whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                  {item.label}
                </span>
                {i < FLOW.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: item.active ? item.color + "40" : "#1f2937" }} />
                )}
                {i < FLOW.length - 1 && (
                  <span style={{ color: item.active ? item.color : "#374151", fontSize: 11 }}>▶</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ background: "#111827", borderRadius: 12, padding: "10px 12px", marginBottom: 16, border: "1px solid #1f2937" }}>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>⚖️ Delta挤压 vs 轧空对比</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { title: "🔱 Delta 挤压", items: ["被挤：期权做市商", "触发：期权量暴增", "性质：价格不敏感买入", "指标：期权量 + IV"], color: "#60a5fa" },
            { title: "📉 轧空", items: ["被挤：融券空头方", "触发：空头比例高", "性质：止损性强制买入", "指标：Short Interest"], color: "#f97316" },
          ].map(c => (
            <div key={c.title} style={{ borderRadius: 8, padding: "8px 10px", border: `1px solid ${c.color}35`, background: c.color + "08" }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: c.color, marginBottom: 6 }}>{c.title}</div>
              {c.items.map((t, i) => (
                <div key={i} style={{ fontSize: 10, color: "#9ca3af", display: "flex", gap: 4, marginBottom: 2 }}>
                  <span style={{ color: c.color }}>·</span>{t}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={handlePlay} disabled={playing} style={{
          padding: "8px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, border: "none", cursor: playing ? "not-allowed" : "pointer",
          background: playing ? "#374151" : info.color, color: playing ? "#6b7280" : "#000",
        }}>
          {playing ? "⏳ 播放中..." : "▶ 播放动画"}
        </button>
        <button onClick={() => { setPlaying(false); setAnimData(fullData); setProgress(60); }} style={{
          padding: "8px 16px", borderRadius: 8, fontSize: 13, border: "1px solid #374151",
          background: "transparent", color: "#d1d5db", cursor: "pointer",
        }}>
          ⏭ 跳至结尾
        </button>
      </div>

      {playing && (
        <div style={{ marginTop: 10, background: "#1f2937", borderRadius: 4, height: 4 }}>
          <div style={{ height: 4, borderRadius: 4, background: info.color, width: `${(progress / 60) * 100}%`, transition: "width 0.04s linear" }} />
        </div>
      )}

      <div style={{ textAlign: "center", color: "#374151", fontSize: 10, marginTop: 14 }}>⚠️ 仅供教育演示，不构成投资建议</div>
    </div>
  );
}
