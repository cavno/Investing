import { useState, useMemo } from "react";

const CATEGORIES = [
  { key:"1A", label:"第一类A", desc:"龙岗户籍 + 学区自购商品房", base:100, bonusType:"property", bonusNote:"按产权证发证时间每满1个月加0.05分" },
  { key:"1B", label:"第一类B", desc:"学区户籍 + 学区租屋", base:100, bonusType:"hukou_move", bonusNote:"按户籍迁入学区时间每满1个月加0.05分" },
  { key:"2", label:"第二类", desc:"深圳其他区户籍 + 学区自购商品房", base:95, bonusType:"property", bonusNote:"按产权证发证时间每满1个月加0.05分" },
  { key:"3", label:"第三类", desc:"学区户籍 + 特殊住房等", base:90, bonusType:"hukou_and_rent", bonusNote:"户籍迁入+租赁备案时间各每满1月加0.05分，可累计" },
  { key:"4", label:"第四类", desc:"非深圳户籍 + 学区自购商品房", base:80, bonusType:"social_insurance", bonusNote:"社保(养老+医疗)累计月数，超12个月后每月加0.05分" },
  { key:"5", label:"第五类", desc:"龙岗户籍 + 学区租房/特殊住房", base:75, bonusType:"hukou_and_rent", bonusNote:"户籍迁入+租赁备案时间各每满1月加0.05分，可累计" },
  { key:"6", label:"第六类", desc:"深圳其他区户籍 + 学区租房/特殊住房", base:70, bonusType:"hukou_and_rent", bonusNote:"户籍迁入+租赁备案时间各每满1月加0.05分，可累计" },
  { key:"7", label:"第七类", desc:"非深圳户籍 + 学区租房/特殊住房", base:60, bonusType:"rent_and_social", bonusNote:"租赁备案时间每满1月加0.05分 + 社保超12月后每月加0.05分，可累计" },
];

const SCHOOLS = [
  { area:"龙城", type:"公办", name:"实验学校(小学部)", s2024:92.05, s2023:92.8, s2022:92.15 },
  { area:"龙城", type:"公办", name:"港中文(深圳)附属知新学校", s2024:67.8, s2023:75, s2022:77.9 },
  { area:"龙城", type:"公办", name:"港中文(深圳)附属道远学校", s2024:91.7, s2023:94.7, s2022:92.2 },
  { area:"龙城", type:"公办", name:"外国语(集团)新亚洲学校", s2024:92.2, s2023:91.75, s2022:91 },
  { area:"龙城", type:"公办", name:"平安里学校(小学部)", s2024:95.85, s2023:93.2, s2022:93.5 },
  { area:"龙城", type:"公办", name:"深中龙岗(集团)兰著学校", s2024:75.6, s2023:78.3, s2022:68.7 },
  { area:"龙城", type:"公办", name:"外国语学校(小学部)", s2024:93.65, s2023:91.95, s2022:91.2 },
  { area:"龙城", type:"公办", name:"外国语(集团)星河学校", s2024:90.35, s2023:90.25, s2022:90.25 },
  { area:"龙城", type:"公办", name:"外国语(集团)致美学校", s2024:90.7, s2023:90.95, s2022:90.75 },
  { area:"龙城", type:"公办", name:"上外附属龙岗学校", s2024:91, s2023:91, s2022:90.6 },
  { area:"龙城", type:"公办", name:"深圳未来天成学校", s2024:69.6, s2023:84.85, s2022:86.5 },
  { area:"龙城", type:"公办", name:"龙城高级中学龙城创新学校", s2024:75.45, s2023:75, s2022:83.95 },
  { area:"龙城", type:"公办", name:"清林小学", s2024:92.45, s2023:93.3, s2022:90.25 },
  { area:"龙城", type:"公办", name:"龙城小学", s2024:93.5, s2023:96.35, s2022:91.2 },
  { area:"龙城", type:"公办", name:"深中龙岗(集团)依山郡小学", s2024:97.95, s2023:100.1, s2022:95 },
  { area:"龙城", type:"公办", name:"深圳中学龙岗学校", s2024:100.2, s2023:94, s2022:91.7 },
  { area:"龙城", type:"公办", name:"外国语(集团)爱联小学", s2024:75, s2023:84.1, s2022:75.15 },
  { area:"龙城", type:"公办", name:"盛平小学", s2024:76.7, s2023:75, s2022:75 },
  { area:"龙城", type:"公办", name:"悦澜山实验小学", s2024:71.55, s2023:75, s2022:69.55 },
  { area:"龙城", type:"公办", name:"天誉实验学校(政府资助)", s2024:91.2, s2023:90, s2022:75.6 },
  { area:"龙城", type:"公办", name:"华南师大附属大运学校", s2024:86.45, s2023:100, s2022:90.15 },
  { area:"龙城", type:"民办", name:"龙联学校", s2024:60, s2023:60, s2022:60.55 },
  { area:"龙城", type:"民办", name:"英才小学", s2024:60, s2023:60.05, s2022:60.25 },
  { area:"龙城", type:"民办", name:"华城学校", s2024:60, s2023:60, s2022:61.75 },
  { area:"龙城", type:"民办", name:"爱华学校", s2024:63.65, s2023:62.4, s2022:63.65 },
  { area:"龙城", type:"民办", name:"文龙学校", s2024:61.75, s2023:62.05, s2022:62.45 },
  { area:"龙城", type:"民办", name:"龙盛学校", s2024:60, s2023:60.7, s2022:61.05 },
  { area:"龙城", type:"民办", name:"兴泰实验学校", s2024:63.85, s2023:64.8, s2022:63.45 },
  { area:"布吉", type:"公办", name:"贤义外国语学校", s2024:105.15, s2023:105.1, s2022:104.55 },
  { area:"布吉", type:"公办", name:"华中师大附中可园学校", s2024:75.15, s2023:90, s2022:90.6 },
  { area:"布吉", type:"公办", name:"信义实验小学", s2024:102.8, s2023:102.85, s2022:100.7 },
  { area:"布吉", type:"公办", name:"华中师大附中木棉湾学校", s2024:86.1, s2023:75, s2022:102.6 },
  { area:"布吉", type:"公办", name:"文理学校(南门墩)", s2024:86.4, s2023:83.65, s2022:null },
  { area:"布吉", type:"公办", name:"吉祥小学", s2024:85.5, s2023:90, s2022:91.3 },
  { area:"布吉", type:"公办", name:"文景小学", s2024:103.45, s2023:102.95, s2022:102.95 },
  { area:"布吉", type:"公办", name:"龙园意境小学", s2024:90, s2023:96, s2022:88 },
  { area:"布吉", type:"公办", name:"德兴小学", s2024:70, s2023:85, s2022:75.15 },
  { area:"布吉", type:"公办", name:"中心小学", s2024:70, s2023:75, s2022:70 },
  { area:"布吉", type:"公办", name:"莲花小学", s2024:75, s2023:75, s2022:70 },
  { area:"布吉", type:"公办", name:"百外世纪小学公办班", s2024:107.25, s2023:107.9, s2022:107.35 },
  { area:"布吉", type:"公办", name:"龙岭学校公办班", s2024:95.95, s2023:100.5, s2022:96.75 },
  { area:"布吉", type:"民办", name:"东升学校", s2024:65.85, s2023:66.3, s2022:65.6 },
  { area:"布吉", type:"民办", name:"智民实验学校", s2024:94.1, s2023:84.1, s2022:70.15 },
  { area:"布吉", type:"民办", name:"百外春蕾小学", s2024:105.6, s2023:104.95, s2022:104.55 },
  { area:"布吉", type:"民办", name:"百外世纪小学(民办)", s2024:104.4, s2023:104.5, s2022:103.8 },
  { area:"布吉", type:"民办", name:"龙岭学校(民办)", s2024:63.75, s2023:68.05, s2022:67.3 },
  { area:"吉华", type:"公办", name:"怡翠实验学校", s2024:104.25, s2023:104.4, s2022:103.4 },
  { area:"吉华", type:"公办", name:"南师大附属龙岗学校", s2024:92.9, s2023:95.9, s2022:93.05 },
  { area:"吉华", type:"公办", name:"甘李学校", s2024:68.75, s2023:67.15, s2022:65.95 },
  { area:"吉华", type:"公办", name:"吉华实验学校(三联)", s2024:85.5, s2023:70, s2022:null },
  { area:"吉华", type:"公办", name:"阳光小学", s2024:91.2, s2023:93.75, s2022:90.2 },
  { area:"吉华", type:"公办", name:"水径小学", s2024:76.45, s2023:90, s2022:75 },
  { area:"吉华", type:"公办", name:"麓城外国语小学", s2024:94.8, s2023:104.05, s2022:103.2 },
  { area:"坂田", type:"公办", name:"外国语(集团)云和学校", s2024:90.25, s2023:90.2, s2022:null },
  { area:"坂田", type:"公办", name:"深圳实验学校坂田校区", s2024:100, s2023:100, s2022:93.05 },
  { area:"坂田", type:"公办", name:"深大附属坂田学校", s2024:93.35, s2023:92.25, s2022:92.65 },
  { area:"坂田", type:"公办", name:"科技城外国语学校", s2024:94.35, s2023:101.05, s2022:91.95 },
  { area:"坂田", type:"公办", name:"坂田实验学校", s2024:90, s2023:96.1, s2022:91.35 },
  { area:"坂田", type:"公办", name:"扬美实验学校", s2024:68.65, s2023:70, s2022:65.7 },
  { area:"坂田", type:"公办", name:"五和实验学校", s2024:75, s2023:88.3, s2022:75 },
  { area:"坂田", type:"公办", name:"广东实验中学深圳学校", s2024:95.6, s2023:102.35, s2022:102.75 },
  { area:"坂田", type:"公办", name:"云端学校(书香实验)", s2024:92.6, s2023:null, s2022:null },
  { area:"坂田", type:"公办", name:"花城小学", s2024:75.55, s2023:85, s2022:75 },
  { area:"坂田", type:"公办", name:"五园小学", s2024:60, s2023:75, s2022:68.35 },
  { area:"坂田", type:"公办", name:"华南师大附属雅宝小学", s2024:65.75, s2023:75, s2022:67.25 },
  { area:"坂田", type:"公办", name:"坂田小学", s2024:68.2, s2023:70, s2022:65.85 },
  { area:"坂田", type:"公办", name:"科技城外国语雪象小学", s2024:66.55, s2023:64.85, s2022:64.65 },
  { area:"坂田", type:"公办", name:"宝岗小学", s2024:65.3, s2023:66.75, s2022:65 },
  { area:"坂田", type:"公办", name:"外国语(集团)和美小学", s2024:90.35, s2023:91.05, s2022:90 },
  { area:"南湾", type:"公办", name:"南湾学校", s2024:102.75, s2023:102.85, s2022:102.4 },
  { area:"南湾", type:"公办", name:"石芽岭学校", s2024:75, s2023:87.9, s2022:60.8 },
  { area:"南湾", type:"公办", name:"沙塘布学校", s2024:90.55, s2023:90.5, s2022:85 },
  { area:"南湾", type:"公办", name:"南岭小学", s2024:92.9, s2023:92.4, s2022:91.75 },
  { area:"南湾", type:"公办", name:"沙西小学", s2024:90.4, s2023:90.3, s2022:75.9 },
  { area:"南湾", type:"公办", name:"下李朗小学", s2024:67.4, s2023:70, s2022:67.55 },
  { area:"南湾", type:"公办", name:"沙湾小学", s2024:87.65, s2023:85.35, s2022:75 },
  { area:"南湾", type:"公办", name:"丹竹头小学", s2024:90.25, s2023:90, s2022:90 },
  { area:"南湾", type:"公办", name:"南湾实验小学", s2024:101.4, s2023:101.5, s2022:86.1 },
  { area:"平湖", type:"公办", name:"平湖实验学校", s2024:94.8, s2023:91, s2022:95.45 },
  { area:"平湖", type:"公办", name:"平湖外国语学校", s2024:75, s2023:75, s2022:70 },
  { area:"平湖", type:"公办", name:"信德学校", s2024:81.9, s2023:97, s2022:90.65 },
  { area:"平湖", type:"公办", name:"平湖第二实验学校", s2024:64.25, s2023:70, s2022:66.9 },
  { area:"平湖", type:"公办", name:"华中师大附中平湖中心学校", s2024:90, s2023:90, s2022:85.05 },
  { area:"平湖", type:"公办", name:"华南师大附属平湖学校", s2024:64.75, s2023:69.9, s2022:67.95 },
  { area:"平湖", type:"公办", name:"深外龙岗学校(平湖)", s2024:103.15, s2023:null, s2022:null },
  { area:"平湖", type:"公办", name:"平湖凤凰山小学", s2024:93.2, s2023:92.65, s2022:92.25 },
];

const AREAS = [...new Set(SCHOOLS.map(s => s.area))];

function monthsBetween(dateStr, refDate) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const r = refDate ? new Date(refDate) : new Date();
  if (isNaN(d) || isNaN(r) || d >= r) return 0;
  return (r.getFullYear() - d.getFullYear()) * 12 + (r.getMonth() - d.getMonth());
}

function ScoreBar({ score, maxScore = 110 }) {
  const pct = Math.min(100, (score / maxScore) * 100);
  return (
    <div style={{ width:"100%", height:5, background:"rgba(0,0,0,0.06)", borderRadius:3 }}>
      <div style={{ width:`${pct}%`, height:"100%", borderRadius:3, background:"linear-gradient(90deg,#b8860b,#d4a017)", transition:"width 0.4s ease" }} />
    </div>
  );
}

function StatusBadge({ myScore, cutoff }) {
  if (!myScore || !cutoff) return null;
  const diff = myScore - cutoff;
  const configs = [
    { min:5, bg:"#d4edda", color:"#155724", text:"很稳" },
    { min:0, bg:"#fff3cd", color:"#856404", text:"较稳" },
    { min:-5, bg:"#ffe0b2", color:"#e65100", text:"有风险" },
    { min:-Infinity, bg:"#f8d7da", color:"#721c24", text:"较难" },
  ];
  const c = configs.find(x => diff >= x.min);
  return <span style={{ padding:"2px 8px", borderRadius:12, fontSize:11, fontWeight:700, background:c.bg, color:c.color, whiteSpace:"nowrap" }}>{c.text} {diff >= 0 ? "+" : ""}{diff.toFixed(2)}</span>;
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [propertyDate, setPropertyDate] = useState("");
  const [hukouMoveDate, setHukouMoveDate] = useState("");
  const [rentDate, setRentDate] = useState("");
  const [socialInsuranceMonths, setSocialInsuranceMonths] = useState("");
  const [refDate, setRefDate] = useState("2026-04-01");
  const [youxiang, setYouxiang] = useState(false);
  const [areaFilter, setAreaFilter] = useState("全部");
  const [typeFilter, setTypeFilter] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const [tab, setTab] = useState("calc");

  const cat = CATEGORIES.find(c => c.key === selected);

  const result = useMemo(() => {
    if (!cat) return null;
    let bonus = 0; const details = []; const rate = 0.05;
    if (cat.bonusType === "property") {
      const m = monthsBetween(propertyDate, refDate); bonus = +(m * rate).toFixed(2);
      details.push(`产权证已满 ${m} 个月，加分 ${bonus}`);
    } else if (cat.bonusType === "hukou_move") {
      const m = monthsBetween(hukouMoveDate, refDate); bonus = +(m * rate).toFixed(2);
      details.push(`户籍迁入已满 ${m} 个月，加分 ${bonus}`);
    } else if (cat.bonusType === "hukou_and_rent") {
      const m1 = monthsBetween(hukouMoveDate, refDate); const b1 = +(m1 * rate).toFixed(2);
      const m2 = monthsBetween(rentDate, refDate); const b2 = +(m2 * rate).toFixed(2);
      details.push(`户籍迁入 ${m1} 月，+${b1}`); details.push(`租赁备案 ${m2} 月，+${b2}`);
      bonus = +(b1 + b2).toFixed(2);
    } else if (cat.bonusType === "social_insurance") {
      const raw = parseInt(socialInsuranceMonths) || 0; const extra = Math.max(0, raw - 12);
      bonus = +(extra * rate).toFixed(2);
      details.push(`社保 ${raw} 月，超12月部分 ${extra} 月，+${bonus}`);
    } else if (cat.bonusType === "rent_and_social") {
      const m1 = monthsBetween(rentDate, refDate); const b1 = +(m1 * rate).toFixed(2);
      const raw = parseInt(socialInsuranceMonths) || 0; const extra = Math.max(0, raw - 12);
      const b2 = +(extra * rate).toFixed(2);
      details.push(`租赁备案 ${m1} 月，+${b1}`); details.push(`社保超12月 ${extra} 月，+${b2}`);
      bonus = +(b1 + b2).toFixed(2);
    }
    const yb = youxiang ? 2.5 : 0;
    if (youxiang) details.push(`优享学区加分 +2.5`);
    return { base:cat.base, bonus:+(bonus+yb).toFixed(2), total:+(cat.base+bonus+yb).toFixed(2), details };
  }, [cat, propertyDate, hukouMoveDate, rentDate, socialInsuranceMonths, refDate, youxiang]);

  const filteredSchools = useMemo(() => {
    return SCHOOLS.filter(s => {
      if (areaFilter !== "全部" && s.area !== areaFilter) return false;
      if (typeFilter !== "全部" && s.type !== typeFilter) return false;
      if (searchText && !s.name.includes(searchText)) return false;
      return true;
    });
  }, [areaFilter, typeFilter, searchText]);

  const needsProperty = cat && cat.bonusType === "property";
  const needsHukou = cat && ["hukou_move","hukou_and_rent"].includes(cat.bonusType);
  const needsRent = cat && ["hukou_and_rent","rent_and_social"].includes(cat.bonusType);
  const needsSocial = cat && ["social_insurance","rent_and_social"].includes(cat.bonusType);

  const inp = { width:"100%", padding:"10px 14px", border:"2px solid #d4c09e", borderRadius:8, fontSize:15, fontFamily:"inherit", background:"#fffdf7", color:"#3a2e1e", outline:"none" };

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Noto Serif SC',Georgia,serif", background:"linear-gradient(160deg,#fdf6ec 0%,#f5e6c8 50%,#ecdbb4 100%)", color:"#3a2e1e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus,select:focus{border-color:#8b6914!important;box-shadow:0 0 0 3px rgba(139,105,20,0.12)!important}
        .tb{padding:10px 20px;border:none;cursor:pointer;font-family:inherit;font-size:14px;font-weight:700;border-radius:10px 10px 0 0;transition:all 0.2s}
        .tb.on{background:rgba(255,255,255,0.85);color:#8b6914;box-shadow:0 -2px 8px rgba(0,0,0,0.06)}
        .tb:not(.on){background:transparent;color:#8a7a5a}
        .cc{border:2px solid #d4c09e;border-radius:10px;padding:12px 14px;cursor:pointer;background:rgba(255,255,255,0.55);transition:all 0.2s}
        .cc:hover{border-color:#b8860b;transform:translateY(-1px)}
        .cc.on{border-color:#8b6914;background:linear-gradient(135deg,#fff9ec,#fff3d6);box-shadow:0 3px 12px rgba(139,105,20,0.15)}
        .sr{padding:14px 16px;border-bottom:1px solid rgba(0,0,0,0.06);transition:background 0.15s}
        .sr:hover{background:rgba(139,105,20,0.04)}
        .ch{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;border:1.5px solid #d4c09e;background:transparent;color:#6a5a3a;font-family:inherit}
        .ch.on{background:#8b6914;color:#fff;border-color:#8b6914}
        select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%238a7a5a' stroke-width='1.5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px!important}
      `}</style>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 16px" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:12, letterSpacing:6, color:"#8b6914", fontWeight:700, marginBottom:6 }}>深圳市龙岗区</div>
          <h1 style={{ fontSize:26, fontWeight:900, letterSpacing:2 }}>义务教育积分入学计算器</h1>
          <p style={{ fontSize:12, color:"#8a7a5a", marginTop:6 }}>计算积分 · 对比历年录取线 · 评估录取机会</p>
        </div>

        <div style={{ display:"flex", gap:4 }}>
          <button className={`tb ${tab==="calc"?"on":""}`} onClick={() => setTab("calc")}>积分计算</button>
          <button className={`tb ${tab==="schools"?"on":""}`} onClick={() => setTab("schools")}>学校录取线</button>
        </div>

        <div style={{ background:"rgba(255,255,255,0.85)", borderRadius:"0 12px 12px 12px", padding:24, border:"1px solid rgba(212,192,158,0.5)" }}>

          {tab === "calc" && <>
            <h2 style={{ fontSize:15, fontWeight:700, marginBottom:12, color:"#5a4a2a" }}>选择积分类型</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:8, marginBottom:20 }}>
              {CATEGORIES.map(c => (
                <div key={c.key} className={`cc ${selected===c.key?"on":""}`} onClick={() => setSelected(c.key)}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>{c.label}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:selected===c.key?"#8b6914":"#a09070" }}>{c.base}分</span>
                  </div>
                  <div style={{ fontSize:11, color:"#7a6a4a", lineHeight:1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>

            {cat && <>
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:4, color:"#5a4a2a" }}>填写加分信息</h2>
              <p style={{ fontSize:11, color:"#8a7a5a", marginBottom:16 }}>{cat.bonusNote}</p>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12, marginBottom:16 }}>
                <div>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, fontSize:13, color:"#5a4a2a" }}>截止日期</label>
                  <input type="date" value={refDate} onChange={e => setRefDate(e.target.value)} style={inp} />
                </div>
                {needsProperty && <div>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, fontSize:13, color:"#5a4a2a" }}>产权证发证日期</label>
                  <input type="date" value={propertyDate} onChange={e => setPropertyDate(e.target.value)} style={inp} />
                </div>}
                {needsHukou && <div>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, fontSize:13, color:"#5a4a2a" }}>户籍迁入学区日期</label>
                  <input type="date" value={hukouMoveDate} onChange={e => setHukouMoveDate(e.target.value)} style={inp} />
                </div>}
                {needsRent && <div>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, fontSize:13, color:"#5a4a2a" }}>租赁凭证备案日期</label>
                  <input type="date" value={rentDate} onChange={e => setRentDate(e.target.value)} style={inp} />
                </div>}
                {needsSocial && <div>
                  <label style={{ display:"block", fontWeight:600, marginBottom:4, fontSize:13, color:"#5a4a2a" }}>社保累计月数</label>
                  <input type="number" min="0" placeholder="养老+医疗同时缴交" value={socialInsuranceMonths} onChange={e => setSocialInsuranceMonths(e.target.value)} style={inp} />
                </div>}
              </div>

              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:14, fontWeight:600, color:"#5a4a2a", marginBottom:16 }} onClick={() => setYouxiang(!youxiang)}>
                <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${youxiang?"#8b6914":"#d4c09e"}`, background:youxiang?"#8b6914":"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s", flexShrink:0 }}>
                  {youxiang && <span style={{ color:"#fff", fontSize:14 }}>✓</span>}
                </div>
                优享学区加分（+2.5分，仅试点片区）
              </label>

              {result && <>
                <div style={{ background:"linear-gradient(135deg,#8b6914,#a67c1a)", color:"#fff", borderRadius:14, padding:24, marginBottom:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
                    <div>
                      <div style={{ fontSize:12, opacity:0.8 }}>预估总积分</div>
                      <div style={{ fontSize:52, fontWeight:900, lineHeight:1 }}>{result.total}</div>
                    </div>
                    <div style={{ textAlign:"right", fontSize:13, opacity:0.85 }}>
                      <div>基础分 {result.base}</div><div>加分 {result.bonus}</div>
                    </div>
                  </div>
                  <div style={{ marginTop:12, borderTop:"1px solid rgba(255,255,255,0.2)", paddingTop:10 }}>
                    {result.details.map((d,i) => <div key={i} style={{ fontSize:12, opacity:0.9, marginBottom:2 }}>• {d}</div>)}
                  </div>
                </div>

                <h2 style={{ fontSize:15, fontWeight:700, marginBottom:4, color:"#5a4a2a" }}>录取机会评估</h2>
                <p style={{ fontSize:11, color:"#8a7a5a", marginBottom:12 }}>基于2024年录取积分线，对比您的预估积分，评估各学校的录取可能性</p>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12, alignItems:"center" }}>
                  {["全部",...AREAS].map(a => <button key={a} className={`ch ${areaFilter===a?"on":""}`} onClick={() => setAreaFilter(a)}>{a}</button>)}
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ ...inp, width:"auto", maxWidth:100, padding:"4px 28px 4px 10px", fontSize:12 }}>
                    <option value="全部">全部</option><option value="公办">公办</option><option value="民办">民办</option>
                  </select>
                </div>

                <div style={{ display:"flex", gap:12, marginBottom:12, fontSize:11, color:"#8a7a5a" }}>
                  <span><span style={{ display:"inline-block", width:8, height:8, borderRadius:4, background:"#d4edda", marginRight:4 }}/>很稳(≥+5)</span>
                  <span><span style={{ display:"inline-block", width:8, height:8, borderRadius:4, background:"#fff3cd", marginRight:4 }}/>较稳(+0~5)</span>
                  <span><span style={{ display:"inline-block", width:8, height:8, borderRadius:4, background:"#ffe0b2", marginRight:4 }}/>有风险(-5~0)</span>
                  <span><span style={{ display:"inline-block", width:8, height:8, borderRadius:4, background:"#f8d7da", marginRight:4 }}/>较难(&lt;-5)</span>
                </div>

                <div style={{ maxHeight:420, overflowY:"auto", borderRadius:10, border:"1px solid rgba(0,0,0,0.08)" }}>
                  {filteredSchools.filter(s => s.s2024).sort((a,b) => a.s2024 - b.s2024).map((s,i) => (
                    <div key={i} className="sr">
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <div style={{ flex:1, minWidth:140 }}>
                          <span style={{ fontWeight:700, fontSize:13 }}>{s.name}</span>
                          <span style={{ fontSize:10, color:"#a09070", marginLeft:4 }}>{s.area}·{s.type}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:13, fontWeight:700, color:"#5a4a2a", whiteSpace:"nowrap" }}>{s.s2024}分</span>
                          <StatusBadge myScore={result.total} cutoff={s.s2024} />
                        </div>
                      </div>
                      <div style={{ marginTop:5 }}><ScoreBar score={s.s2024} /></div>
                      <div style={{ fontSize:10, color:"#b0a080", marginTop:3 }}>
                        {s.s2023 != null && `2023: ${s.s2023}`}{s.s2022 != null ? ` | 2022: ${s.s2022}` : ""}
                        {s.s2023 != null && s.s2024 != null && (() => {
                          const d = s.s2024 - s.s2023;
                          return <span style={{ marginLeft:6, color: d > 0 ? "#c0392b" : "#27ae60" }}>{d > 0 ? "↑" : "↓"}{Math.abs(d).toFixed(2)}</span>;
                        })()}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop:16, padding:14, background:"rgba(139,105,20,0.06)", borderRadius:10, fontSize:12, color:"#6a5a3a", lineHeight:1.7 }}>
                  <strong>提示：</strong>录取积分线每年波动较大，以上评估仅基于2024年数据供参考。建议关注目标学校近3年趋势，合理填报志愿。同分情况下按优享学区→学区户籍→龙岗户籍→深圳其他区户籍→非深户排序录取。
                </div>
              </>}
            </>}
          </>}

          {tab === "schools" && <>
            <h2 style={{ fontSize:15, fontWeight:700, marginBottom:12, color:"#5a4a2a" }}>龙岗区小一录取积分线（2022-2024）</h2>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
              <input placeholder="搜索学校..." value={searchText} onChange={e => setSearchText(e.target.value)} style={{ ...inp, maxWidth:200 }} />
              <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} style={{ ...inp, maxWidth:120 }}>
                <option value="全部">全部片区</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ ...inp, maxWidth:100 }}>
                <option value="全部">全部</option><option value="公办">公办</option><option value="民办">民办</option>
              </select>
            </div>
            <div style={{ fontSize:12, color:"#a09070", marginBottom:8 }}>共 {filteredSchools.length} 所学校</div>
            <div style={{ maxHeight:540, overflowY:"auto", borderRadius:10, border:"1px solid rgba(0,0,0,0.08)" }}>
              {filteredSchools.sort((a,b) => (b.s2024||0) - (a.s2024||0)).map((s,i) => (
                <div key={i} className="sr">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div>
                      <span style={{ fontWeight:700, fontSize:13 }}>{s.name}</span>
                      <span style={{ fontSize:11, marginLeft:6, padding:"2px 8px", borderRadius:10, background:s.type==="公办"?"#e8f4e8":"#fef3e2", color:s.type==="公办"?"#2d6a2d":"#b8860b" }}>{s.type}</span>
                    </div>
                    <span style={{ fontSize:11, color:"#a09070" }}>{s.area}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                    {[{y:"2024",v:s.s2024},{y:"2023",v:s.s2023},{y:"2022",v:s.s2022}].map(({y,v}) => (
                      <div key={y} style={{ textAlign:"center" }}>
                        <div style={{ fontSize:10, color:"#a09070" }}>{y}</div>
                        <div style={{ fontSize:16, fontWeight:900, color:v?"#3a2e1e":"#ccc" }}>{v ?? "—"}</div>
                        {v && <div style={{ marginTop:3 }}><ScoreBar score={v} /></div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>}
        </div>

        <div style={{ textAlign:"center", marginTop:24, fontSize:11, color:"#a09070" }}>
          数据来源于公开信息，仅供参考，实际积分以龙岗区教育局官方为准
        </div>
      </div>
    </div>
  );
}
