# 古希腊哲学：16组对立中的底层原理

一个用 16 组核心二元对立重新组织整个古希腊哲学（前 6 世纪—公元 3 世纪）的交互式单页阅读应用。
## Visit：https://cavno.github.io/greek-philosophy/

## 这是什么

讲义末尾那张"16 组核心概念二元对立总表"被作为整个 500 年希腊思想的**骨架**。这套程序把它重组成一条逻辑链：

- **5 个历史阶段**：起点 → 本原 → 巴门尼德冲击 → 形而上学 → 希腊化转向
- **16 组对立**：每一对都是一道"应力点"，每位哲学家由他在这些应力点上的姿态被精确定位
- **3 条底层原理**：把 16 组连起来后浮现的深层语法
- **24 位思想家**：从荷马到普罗提诺，可点击查看其在所有对立中的姿态地图

## 交互能力

- **顶部星座网格**：16 对一目了然，点击任意一对直接跳转
- **展开式对立卡**：核心问题 / 两极对照 / 哲学家光谱 / 深度解释 / 利害关系 / 相关对立
- **哲学家定位光谱**：每位哲学家在该对立上是偏左、调和、还是偏右一望而知
- **哲学家档案弹窗**：点击任何哲学家芯片，看到他在 16 对中的全部姿态
- **相关对立跳转**：每张卡片底部的相关链接可直接跳到目标对立并自动展开
- **阶段导航 + 滚动追踪**：顶部导航实时高亮当前所在阶段
- **URL 锚点支持**：`#duality-7` 这样的链接可以直接打开并定位到指定对立

## 部署到 GitHub Pages

### 方法 A：最简（推荐）

1. 新建仓库（比如叫 `greek-philosophy`）
2. 把 `index.html` 推到 `main` 分支根目录：
   ```bash
   git init
   git add index.html
   git commit -m "init"
   git branch -M main
   git remote add origin git@github.com:<你的用户名>/greek-philosophy.git
   git push -u origin main
   ```
3. 进入仓库 **Settings → Pages**，把 Source 设为 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，保存
4. 等 1–2 分钟，访问 `https://<你的用户名>.github.io/greek-philosophy/`

### 方法 B：用 `gh-pages` 分支

如果你的 `main` 不想被静态文件污染：
```bash
git checkout --orphan gh-pages
git rm -rf .
# 把 index.html 放进来
git add index.html
git commit -m "deploy"
git push origin gh-pages
```
然后 Settings → Pages 里选 `gh-pages` 分支即可。

### 自定义域名

Settings → Pages → Custom domain 填上你的域名（如 `philo.yourname.com`），然后在 DNS 服务商加一条 `CNAME` 记录指向 `<你的用户名>.github.io`。

## 技术说明

- **单文件**：所有 CSS / JS / 数据都内嵌在 `index.html`，约 80KB，无需构建工具
- **唯一外部依赖**：Google Fonts（Cormorant Garamond / EB Garamond / GFS Didot / Noto Serif SC / JetBrains Mono），用于呈现古希腊文与中文衬线
- **零框架**：原生 HTML / CSS / JS。任何浏览器（含手机）即开即用
- **响应式**：880px / 500px 两个断点，移动端自适应

## 修改内容

所有内容都在 `<script>` 标签内的三个数组里：
- `phases` — 5 个阶段的标题、副标题、引言
- `dualities` — 16 组对立的全部内容
- `philosophers` — 24 位思想家的姓名、生卒、学派
- `principles` — 3 条底层原理

改完直接刷新即可，无需重新构建。

---

> 这 16 组对立不是答案，而是问题的结构。
> 希腊哲学最终给出的，不是关于世界的真理，而是面对世界的姿态。
