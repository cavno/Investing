const STORAGE_KEY = 'household_bs_v1';
const BAR_MAX = 280; // 资产负债条最大高度 rpx
const SBAR_MAX = 150; // 压力测试对比条最大高度 rpx

// 资产科目（单位：万元）
const ASSET_FIELDS = [
  { key: 'cash',       label: '现金及活期',   hint: '随时可动用', liquid: true,  property: false },
  { key: 'invest',     label: '股票·基金·理财', hint: '风险资产',  liquid: true,  property: false },
  { key: 'house',      label: '自住房产（现值）', hint: '杠杆支点', liquid: false, property: true  },
  { key: 'gjj',        label: '公积金账户',   hint: '半流动',     liquid: false, property: false },
  { key: 'car',        label: '车辆',         hint: '消耗性资产', liquid: false, property: false },
  { key: 'otherAsset', label: '其他资产',     hint: '',           liquid: false, property: false }
];

// 负债科目（单位：万元）
const LIAB_FIELDS = [
  { key: 'mortgage',     label: '房贷余额',     hint: '长期 · 低息' },
  { key: 'carLoan',      label: '车贷',         hint: '' },
  { key: 'consumerLoan', label: '消费贷·经营贷', hint: '短期 · 高息' },
  { key: 'creditCard',   label: '信用卡欠款',   hint: '最贵的钱' },
  { key: 'otherDebt',    label: '其他负债',     hint: '' }
];

// 默认示例（一个中等杠杆的深圳家庭，单位：万元）
const DEFAULT_ASSETS = { cash: 20, invest: 50, house: 700, gjj: 15, car: 12, otherAsset: 3 };
const DEFAULT_LIABS  = { mortgage: 420, carLoan: 4, consumerLoan: 0, creditCard: 1, otherDebt: 0 };
const DEFAULT_FLOW   = { income: 60000, pay: 22000 }; // 元 / 月

function num(v) {
  const n = parseFloat(v);
  return isFinite(n) ? n : 0;
}

// 金额格式：万元，最多一位小数，去掉多余的 .0
function money(n) {
  if (!isFinite(n)) return '—';
  const r = Math.round(n * 10) / 10;
  return (Math.abs(r) < 1e-9 ? 0 : r).toString();
}

function pct(n, digits) {
  if (!isFinite(n)) return '—';
  return n.toFixed(digits === undefined ? 1 : digits) + '%';
}

function signedPct(n) {
  if (!isFinite(n)) return '—';
  const s = n >= 0 ? '+' : '';
  return s + n.toFixed(1) + '%';
}

Page({
  data: {
    assetRows: [],
    liabRows: [],
    income: '',
    pay: '',
    stressPct: 0,

    // 计算结果
    totalAsset: '0',
    totalLiab: '0',
    netWorth: '0',
    insolvent: false,

    debtRatio: '—',        debtTag: { text: '', cls: '' },
    leverage: '—',         levTag: { text: '', cls: '' },
    dti: '—',              dtiTag: { text: '', cls: '' },
    reserve: '—',

    // 资产负债双条（rpx 高度）
    bar: {
      liquidH: 0, illiquidH: 0,   // 左：资产
      liabH: 0, netH: 0,          // 右：负债 + 净资产
      liquidPct: '0', illiquidPct: '0', liabPct: '0', netPct: '0'
    },

    // 压力测试
    stress: {
      newNet: '0', changePct: '—', amp: '—', zeroPct: '—',
      hasHouse: false, hasNet: false, gain: false,
      origH: 0, newH: 0
    }
  },

  onLoad() {
    const saved = wx.getStorageSync(STORAGE_KEY) || {};
    const a = Object.assign({}, DEFAULT_ASSETS, saved.assets || {});
    const l = Object.assign({}, DEFAULT_LIABS, saved.liabs || {});
    const f = Object.assign({}, DEFAULT_FLOW, saved.flow || {});

    const assetRows = ASSET_FIELDS.map(ff => Object.assign({}, ff, { value: String(a[ff.key]) }));
    const liabRows  = LIAB_FIELDS.map(ff => Object.assign({}, ff, { value: String(l[ff.key]) }));

    this.setData({
      assetRows,
      liabRows,
      income: String(f.income),
      pay: String(f.pay)
    }, () => this.recompute());

    // 渐进增强：尝试加载思源宋体；失败则回退系统衬线
    try {
      wx.loadFontFace({
        global: true,
        family: 'Noto Serif SC',
        source: 'url("https://cdn.jsdelivr.net/fontsource/fonts/noto-serif-sc@latest/chinese-simplified-500-normal.woff2")',
        success: () => {},
        fail: () => {}
      });
    } catch (e) {}
  },

  onAssetInput(e) {
    const idx = e.currentTarget.dataset.index;
    const rows = this.data.assetRows;
    rows[idx].value = e.detail.value;
    this.setData({ assetRows: rows });
    this.recompute();
  },

  onLiabInput(e) {
    const idx = e.currentTarget.dataset.index;
    const rows = this.data.liabRows;
    rows[idx].value = e.detail.value;
    this.setData({ liabRows: rows });
    this.recompute();
  },

  onIncomeInput(e) { this.setData({ income: e.detail.value }); this.recompute(); },
  onPayInput(e)    { this.setData({ pay: e.detail.value });    this.recompute(); },

  onStress(e) {
    this.setData({ stressPct: e.detail.value });
    this.recomputeStress();
  },

  recompute() {
    const a = {}; this.data.assetRows.forEach(r => { a[r.key] = num(r.value); });
    const l = {}; this.data.liabRows.forEach(r => { l[r.key] = num(r.value); });
    const income = num(this.data.income);
    const pay = num(this.data.pay);

    const liquid = a.cash + a.invest;
    const totalAsset = ASSET_FIELDS.reduce((s, f) => s + a[f.key], 0);
    const illiquid = totalAsset - liquid;
    const totalLiab = LIAB_FIELDS.reduce((s, f) => s + l[f.key], 0);
    const netWorth = totalAsset - totalLiab;

    // 比率
    const debtRatio = totalAsset > 0 ? totalLiab / totalAsset * 100 : NaN;
    const leverage = netWorth > 0 ? totalAsset / netWorth : NaN; // 权益乘数
    const dti = income > 0 ? pay / income * 100 : NaN;
    const reserveMonths = pay > 0 ? (liquid * 10000) / pay : NaN;

    // 等比条：以总资产与总负债中较大者为基准
    const base = Math.max(totalAsset, totalLiab, 1);
    const h = v => Math.max(0, v) / base * BAR_MAX;

    // 持久化
    wx.setStorageSync(STORAGE_KEY, { assets: a, liabs: l, flow: { income, pay } });

    this.setData({
      totalAsset: money(totalAsset),
      totalLiab: money(totalLiab),
      netWorth: money(netWorth),
      insolvent: netWorth < 0,

      debtRatio: pct(debtRatio),
      debtTag: this.bandDebt(debtRatio),
      leverage: isFinite(leverage) ? leverage.toFixed(2) + '×' : '—',
      levTag: this.bandLeverage(leverage),
      dti: pct(dti),
      dtiTag: this.bandDti(dti),
      reserve: isFinite(reserveMonths) ? reserveMonths.toFixed(0) + ' 个月' : '—',

      bar: {
        liquidH: h(liquid), illiquidH: h(illiquid),
        liabH: h(totalLiab), netH: h(Math.max(netWorth, 0)),
        liquidPct: totalAsset > 0 ? (liquid / totalAsset * 100).toFixed(0) : '0',
        illiquidPct: totalAsset > 0 ? (illiquid / totalAsset * 100).toFixed(0) : '0',
        liabPct: totalAsset > 0 ? (totalLiab / totalAsset * 100).toFixed(0) : '0',
        netPct: totalAsset > 0 ? (Math.max(netWorth, 0) / totalAsset * 100).toFixed(0) : '0'
      }
    }, () => this.recomputeStress());
  },

  recomputeStress() {
    const a = {}; this.data.assetRows.forEach(r => { a[r.key] = num(r.value); });
    const l = {}; this.data.liabRows.forEach(r => { l[r.key] = num(r.value); });
    const totalAsset = ASSET_FIELDS.reduce((s, f) => s + a[f.key], 0);
    const totalLiab = LIAB_FIELDS.reduce((s, f) => s + l[f.key], 0);
    const netWorth = totalAsset - totalLiab;
    const house = a.house;
    const p = this.data.stressPct / 100;

    const newNet = netWorth + house * p;                       // 负债不变，房产变动全部砸到净资产
    const changePct = netWorth > 0 ? (newNet - netWorth) / netWorth * 100 : NaN;
    const amp = netWorth > 0 ? house / netWorth : NaN;          // 房价波动被放大进净资产的倍数
    const zeroPct = (house > 0 && netWorth > 0) ? netWorth / house * 100 : NaN; // 房价跌多少净资产清零

    const sbase = Math.max(netWorth, newNet, 1);
    const sh = v => Math.max(0, v) / sbase * SBAR_MAX;

    this.setData({
      stress: {
        newNet: money(newNet),
        changePct: signedPct(changePct),
        amp: isFinite(amp) ? amp.toFixed(2) + '×' : '—',
        zeroPct: isFinite(zeroPct) ? zeroPct.toFixed(1) + '%' : '—',
        hasHouse: house > 0,
        hasNet: netWorth > 0,
        gain: this.data.stressPct >= 0,
        origH: sh(netWorth),
        newH: sh(newNet)
      }
    });
  },

  bandDebt(v) {
    if (!isFinite(v)) return { text: '', cls: '' };
    if (v < 50) return { text: '稳健', cls: 'ok' };
    if (v < 70) return { text: '偏高', cls: 'warn' };
    return { text: '危险', cls: 'bad' };
  },
  bandLeverage(v) {
    if (!isFinite(v)) return { text: '资不抵债', cls: 'bad' };
    if (v < 2) return { text: '低杠杆', cls: 'ok' };
    if (v < 4) return { text: '中等', cls: 'warn' };
    return { text: '高杠杆', cls: 'bad' };
  },
  bandDti(v) {
    if (!isFinite(v)) return { text: '', cls: '' };
    if (v < 30) return { text: '健康', cls: 'ok' };
    if (v <= 50) return { text: '偏紧', cls: 'warn' };
    return { text: '危险', cls: 'bad' };
  },

  resetExample() {
    wx.showModal({
      title: '恢复示例数据',
      content: '将用一个中等杠杆家庭的示例覆盖当前数据。',
      confirmText: '恢复',
      cancelText: '取消',
      success: (res) => {
        if (!res.confirm) return;
        wx.removeStorageSync(STORAGE_KEY);
        const assetRows = ASSET_FIELDS.map(ff => Object.assign({}, ff, { value: String(DEFAULT_ASSETS[ff.key]) }));
        const liabRows  = LIAB_FIELDS.map(ff => Object.assign({}, ff, { value: String(DEFAULT_LIABS[ff.key]) }));
        this.setData({
          assetRows, liabRows,
          income: String(DEFAULT_FLOW.income),
          pay: String(DEFAULT_FLOW.pay),
          stressPct: 0
        }, () => this.recompute());
      }
    });
  },

  clearAll() {
    wx.showModal({
      title: '清空全部',
      content: '所有金额将归零，方便录入你自己的数据。',
      confirmText: '清空',
      cancelText: '取消',
      success: (res) => {
        if (!res.confirm) return;
        wx.removeStorageSync(STORAGE_KEY);
        const assetRows = ASSET_FIELDS.map(ff => Object.assign({}, ff, { value: '' }));
        const liabRows  = LIAB_FIELDS.map(ff => Object.assign({}, ff, { value: '' }));
        this.setData({ assetRows, liabRows, income: '', pay: '', stressPct: 0 }, () => this.recompute());
      }
    });
  },

  onShareAppMessage() {
    return { title: '家庭资产负债表 · 看清你的杠杆', path: '/pages/index/index' };
  }
});
