# Gamma Atlas · Gamma敞口结构图谱
## Visit：https://cavno.github.io/gamma-atlas/
> 14种典型市场博弈格局的可视化图谱 — 看涨6种 / 看跌6种 / 中性2种

一个**零依赖的单文件静态网站**,展示Gamma敞口的14种典型结构、机制和触发条件。

---

## ✨ 特性

- 📊 **14种结构**完整呈现,每种都有定制SVG图表 + 底层机制 + 触发条件 + 经典案例
- 🎨 **暗色/亮色双主题**,默认编辑研究风格
- 🔍 **方向筛选**:全部 / 看涨 / 看跌 / 中性
- 📐 **响应式设计**:桌面/平板/手机全适配
- 🚀 **零依赖**:单HTML文件,无构建步骤,无后端
- ♿ **无障碍优化**:语义化HTML、ARIA标签、`prefers-reduced-motion`支持

---

## 🚀 部署到 GitHub Pages(3分钟)

### 方法一:网页操作(最简单,推荐新手)

1. **创建仓库**
   - 登录 GitHub,点击右上角 `+` → `New repository`
   - 仓库名建议:`gamma-atlas`(或任何你喜欢的名字)
   - 设为 **Public**(GitHub Pages免费版要求公开仓库)
   - 勾选 `Add a README file`
   - 点击 `Create repository`

2. **上传文件**
   - 在新仓库页面,点击 `Add file` → `Upload files`
   - 把 `index.html` 拖进去(可以连同 `README.md` 一起拖)
   - 拉到底部点击 `Commit changes`

3. **启用 Pages**
   - 仓库页面 → `Settings` → 左侧 `Pages`
   - **Source** 选择:`Deploy from a branch`
   - **Branch** 选择:`main`(或 `master`),文件夹选 `/ (root)`
   - 点 `Save`

4. **访问网站**
   - 等 1-2 分钟,刷新 Pages 设置页
   - 顶部会出现:`Your site is live at https://你的用户名.github.io/gamma-atlas/`
   - 点开就能看到!

### 方法二:命令行(适合熟悉 Git 的用户)

```bash
# 1. 克隆或初始化你的仓库
git clone https://github.com/你的用户名/gamma-atlas.git
cd gamma-atlas

# 2. 把 index.html 复制进来
cp /path/to/index.html .

# 3. 提交
git add index.html
git commit -m "Add Gamma Atlas"
git push origin main

# 4. 在 GitHub 网页上启用 Pages(同方法一第3步)
```

---

## 📁 文件结构

```
gamma-atlas/
├── index.html      # 主文件 — 包含所有内容、样式、脚本
└── README.md       # 本文件
```

**没了。一个 HTML 文件,105KB,自给自足。**

---

## 🎨 自定义

整个站点的核心设计令牌都在 `index.html` 的 `:root` CSS 变量里,改一处即可全局调整。

### 调整颜色

打开 `index.html`,在 `<style>` 顶部找到:

```css
:root[data-theme="dark"] {
  --bg: #0c0c0d;          /* 背景色 */
  --accent: #e8a84a;       /* 强调色(琥珀) */
  --bull: #e35858;         /* 看涨柱(红 — 中式金融习惯) */
  --bear: #8dc15a;         /* 看跌柱(绿) */
  --gex: #5da3d9;          /* GEX 曲线(蓝) */
  /* ... */
}
```

把 `--bull` 改成绿色、`--bear` 改成红色,即可切换到欧美金融习惯。

### 替换字体

默认使用 Google Fonts 的 Fraunces(serif)+ Noto Sans/Serif SC(CJK)+ JetBrains Mono。
替换 `<head>` 里的 `<link href="...fonts.googleapis.com...">` 即可。

### 添加新结构

每个结构是一个 `<article class="pattern" data-direction="bull|bear|neutral">` 区块。
复制现有的一个,改 SVG 和文字内容即可。

---

## 🔧 本地预览

不需要任何构建工具,直接打开:

```bash
# 方法 1:用浏览器打开
open index.html      # macOS
xdg-open index.html  # Linux
start index.html     # Windows

# 方法 2:启动一个简单的本地服务器(推荐,避免某些字体加载问题)
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

---

## 📚 内容来源

本图谱的14种结构、机制描述和分类逻辑均来源于一系列围绕Gamma敞口分析的深度讨论。
理论基础参考:
- Gamma对冲机制(Black-Scholes Greeks)
- 做市商行为模型
- 期权OPEX(Option Expiration)周期效应
- Tail Hedging 与反脆弱思想(Taleb)

---

## ⚠️ 重要免责声明

本图谱**仅供学习参考,不构成任何投资建议**。

- Gamma敞口分析是众多市场分析工具之一,实际市场永远更复杂
- 任何结构在加入黑天鹅事件、流动性危机、监管干预后都可能瞬间失效
- 真正的风险管理永远来自:**对自己的诚实 + 对市场的敬畏 + 对仓位的纪律**

---

## 📝 许可

本项目内容采用 [MIT License](https://opensource.org/licenses/MIT) 开源。
可自由分发、修改、商用,保留版权声明即可。

---

**Built with care · 2026**
