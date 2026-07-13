# Jane Street 操纵 BANKNIFTY/NIFTY 指数 · 策略可视化拆解
Visit：https://cavno.github.io/jane-street-viz/

基于 SEBI（印度证券交易委员会）2025 年 7 月 3 日发布的临时禁令文件 `WTM/AN/MRD/MRD-SEC-3/31516/2025-26`（共 105 页），独立重构的交互式可视化拆解程序。

把 SEBI 调查认定的两套操纵策略与 21 个违规交易日整合成可点击切换的结构化界面，支持浅色 / 深色模式，无外部依赖。

## 在线预览

部署到 GitHub Pages 后，访问：`https://<your-username>.github.io/<repo-name>/`

## 内容概览

程序由三个标签页组成：

1. **策略一：日内拉抬-砸盘**（15 天）
   - 以 2024-01-17（单日获利 ₹734.93 Cr）为样本
   - 含指数走势图、四步动作分解、市场规模不对称对比、LTP 攻击性证据、当日盈亏拆解
2. **策略二：延伸式收盘价操纵**（6 天）
   - 以 2024-07-10 为 BANKNIFTY 样本
   - 含 2025-05-15 NIFTY 持续违规（警告函后）案例
3. **21 日全景**
   - 全部违规日的违法所得条形图
   - 按策略类型着色，点击任一行查看明细

## 项目结构

```
jane-street-viz/
├── index.html      # 单页入口，含所有可视化内容与 SVG 图表
├── styles.css      # 主题与布局；自动适配 prefers-color-scheme
├── app.js          # 标签页切换 + 21 日数据渲染
├── README.md       # 当前文件
├── LICENSE         # MIT
└── .gitignore
```

零依赖、零构建步骤——纯 HTML / CSS / JavaScript，浏览器直接打开即可。

## 本地运行

只需要任意静态文件服务器。最简单的方式：

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

python3 -m http.server 8000
# 或
npx serve .
```

然后打开 `http://localhost:8000`。

也可以直接双击 `index.html` 在浏览器中打开（无服务器亦可工作）。

## 部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库，上传以上文件到 `main` 分支根目录。
2. 进入仓库 **Settings → Pages**。
3. 在 **Build and deployment → Source** 下选择 `Deploy from a branch`。
4. 在 **Branch** 下选择 `main` 分支、`/ (root)` 目录，点击 **Save**。
5. 等待 1-2 分钟，访问 `https://<your-username>.github.io/<repo-name>/`。

后续 push 到 `main` 分支会自动重新部署。

### 使用 GitHub Actions 部署（可选）

如果要更精细地控制部署，可在 `.github/workflows/deploy.yml` 中加入：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

并在 **Settings → Pages → Source** 选择 `GitHub Actions`。

## 数据来源与说明

- 全部数据、表格、时间线、订单簿分析均来自 SEBI 临时禁令的公开文本。
- 金额单位 `Cr`（crore，1,000 万 INR ≈ 12 万美元）与原文一致，未做币种或量级转换。
- 2024-01-17 指数走势图是基于禁令中描述的开盘价、日内高 / 低、收盘价以及关键时间点行为重构的示意图，并非分钟级 OHLC 数据；曲线形状与方向准确，绝对水平为示意。
- 2024-07-10 走势图为完全示意性图形，用于呈现"上午平稳—收盘前急跌"的形态。

## 已知数据要点

| 指标 | 数值 | 来源段落 |
|---|---|---|
| 违规交易日总数 | 21 | 第 14, 19, 21 段 |
| 累计违法所得 | ₹4,843.57 Cr | 第 67 段 |
| 涉案 JS Group 实体 | 4 个 | 第 9 段 |
| 期权 / 现货+期货 现金等值规模比 | ≈ 98 倍 | 第 24 段 Table 1 |
| 期权 / 现货 单一比例 | 353 倍 | 第 24 段 |
| 调查样本日期权交易者总数 | 161.5 万 | 第 24 段 |
| 调查样本日现货交易者总数 | 4,675 | 第 24 段 |

## 免责声明

- 本程序为基于公开法律文件的独立学习与研究项目，**不构成任何投资建议、法律意见或对涉案当事人的事实判断**。
- SEBI 的禁令为**临时性**（interim order）；最终结论待裁决程序完成后由 SEBI 与司法机关决定。
- 本程序与 Anthropic、SEBI、NSE、BSE、Jane Street 集团及其关联实体无任何关联。

## 许可证

MIT License — 详见 [LICENSE](./LICENSE)。
