(function () {
  'use strict';

  const VIOLATIONS = [
    { date: '2023-08-31', profit: 191.59, index: 'BANKNIFTY', strat: 'A' },
    { date: '2023-09-13', profit: 212.18, index: 'BANKNIFTY', strat: 'A' },
    { date: '2023-09-20', profit: 233.13, index: 'BANKNIFTY', strat: 'A' },
    { date: '2023-09-28', profit: 241.69, index: 'BANKNIFTY', strat: 'A' },
    { date: '2023-10-04', profit: 163.67, index: 'BANKNIFTY', strat: 'B' },
    { date: '2023-10-18', profit: 317.33, index: 'BANKNIFTY', strat: 'A' },
    { date: '2023-10-26', profit: 259.12, index: 'BANKNIFTY', strat: 'A' },
    { date: '2023-12-06', profit: 150.90, index: 'BANKNIFTY', strat: 'A' },
    { date: '2024-01-03', profit: 164.65, index: 'BANKNIFTY', strat: 'A' },
    { date: '2024-01-17', profit: 734.93, index: 'BANKNIFTY', strat: 'A' },
    { date: '2024-03-06', profit: 197.05, index: 'BANKNIFTY', strat: 'A' },
    { date: '2024-04-16', profit: 170.27, index: 'BANKNIFTY', strat: 'A' },
    { date: '2024-05-08', profit: 171.01, index: 'BANKNIFTY', strat: 'B' },
    { date: '2024-05-15', profit: 160.72, index: 'BANKNIFTY', strat: 'A' },
    { date: '2024-05-29', profit: 258.55, index: 'BANKNIFTY', strat: 'A' },
    { date: '2024-06-19', profit: 322.45, index: 'BANKNIFTY', strat: 'A' },
    { date: '2024-07-03', profit: 299.03, index: 'BANKNIFTY', strat: 'A' },
    { date: '2024-07-10', profit: 225.35, index: 'BANKNIFTY', strat: 'B' },
    { date: '2025-05-08', profit:   3.07, index: 'NIFTY',     strat: 'B' },
    { date: '2025-05-15', profit: 167.53, index: 'NIFTY',     strat: 'B' },
    { date: '2025-05-22', profit: 199.36, index: 'NIFTY',     strat: 'B' }
  ];

  const STRAT_LABEL = { A: '日内操纵', B: '收盘价操纵' };
  const STRAT_COLOR = { A: '#D85A30', B: '#BA7517' };

  const STRAT_FULL = {
    A: '<b>策略一：日内拉抬-砸盘</b>。两段式操作——上午（Patch I）大举买入成分股 + 期货以拉抬指数，' +
       '同时在期权市场上反向建立巨额空头头寸；下午（Patch II）反向卖出现货 / 期货使指数回落，' +
       '期权头寸按下跌方向结算获取暴利。现货 / 期货端的"亏损"是操纵成本，被期权端利润数倍覆盖。',
    B: '<b>策略二：延伸式收盘价操纵（Extended Marking the Close）</b>。集中在最后 1-2 小时单方向冲击成分股 + 期货，' +
       '把指数推向有利的到期结算价；同期持有相应方向的巨额到期期权敞口，结算时获利。' +
       '该策略是 2025 年 5 月 NIFTY 上违反 NSE 警告函时再次出现的形态。'
  };

  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.dataset.tab;
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const panel = document.getElementById('panel-' + target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  function buildDayChart() {
    const root = document.getElementById('dayChart');
    if (!root) return;

    const maxProfit = Math.max.apply(null, VIOLATIONS.map(function (d) { return d.profit; }));

    VIOLATIONS.forEach(function (d, i) {
      const row = document.createElement('div');
      row.className = 'day-row';
      row.dataset.idx = String(i);
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label',
        d.date + ' ' + d.index + ' 违法所得 ' + d.profit.toFixed(2) + ' Cr');

      const pct = (d.profit / maxProfit * 100).toFixed(1);

      row.innerHTML =
        '<div class="day-date">' + d.date + '</div>' +
        '<div class="day-bar-wrap"><div class="day-bar" style="width:' + pct +
          '%; background:' + STRAT_COLOR[d.strat] + ';"></div></div>' +
        '<div class="day-amt">₹' + d.profit.toFixed(2) + ' Cr</div>' +
        '<div class="day-strat">' + d.index + ' · ' + STRAT_LABEL[d.strat] + '</div>';

      const handleSelect = function () { selectDay(d, row); };
      row.addEventListener('click', handleSelect);
      row.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          handleSelect();
        }
      });

      root.appendChild(row);
    });
  }

  function selectDay(d, row) {
    document.querySelectorAll('.day-row').forEach(function (r) {
      r.classList.remove('selected');
    });
    row.classList.add('selected');

    const detail = document.getElementById('dayDetail');
    if (!detail) return;

    detail.hidden = false;
    detail.innerHTML =
      '<div class="detail-title">' + d.date + ' · ' + d.index + '（周到期日）</div>' +
      '<div class="detail-meta">违法所得：₹' + d.profit.toFixed(2) + ' Cr</div>' +
      '<div class="detail-body">' + STRAT_FULL[d.strat] + '</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initTabs();
      buildDayChart();
    });
  } else {
    initTabs();
    buildDayChart();
  }
})();
