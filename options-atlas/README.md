# Options Strategy Atlas · 期权策略图谱
# Visit：https://cavno.github.io/options-atlas/
An interactive reference site for **65 options strategies**, generated from `期权策略.xlsx`.

For each strategy you get:
- Full Greeks exposure (Δ, Γ, V, Θ) with color-coded direction
- Initial cash flow, trader role, purpose, structure, skill level
- Every leg with its construction and strategic effect
- A canonical **at-expiry payoff diagram** (auto-generated from the legs)

Static, no build step, no dependencies — just three files (`index.html`, `style.css`, `app.js`, `data.js`).
Vanilla HTML/CSS/JS. Drops straight onto GitHub Pages.

---

## Local preview

Just open `index.html` in any browser. Or run a local server:

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Deploy to GitHub Pages

### Option A — root of `main` branch (simplest)

1. Create a new repo on GitHub (e.g. `options-atlas`).
2. Copy these files into it:
   ```
   index.html
   style.css
   app.js
   data.js
   README.md
   ```
3. Commit & push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Options Strategy Atlas"
   git branch -M main
   git remote add origin https://github.com/<your-username>/options-atlas.git
   git push -u origin main
   ```
4. On GitHub, go to **Settings → Pages**.
5. Under **Source**, select **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**, then **Save**.
6. Wait ~30 seconds. Your site will be live at `https://<your-username>.github.io/options-atlas/`.

### Option B — `docs/` folder

If you want to keep other code in the same repo:

1. Put the four files in a `docs/` subfolder.
2. Settings → Pages → branch **`main`**, folder **`/docs`**.

### Option C — GitHub Actions

For automated deploys (e.g. if you re-generate `data.js` from the Excel):

```yaml
# .github/workflows/deploy.yml
name: Deploy to Pages
on:
  push: { branches: [main] }
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

Then in Settings → Pages, switch the source to **GitHub Actions**.

---

## Regenerating `data.js` from the Excel file

If you update `期权策略.xlsx`, regenerate `data.js`:

```bash
pip install pandas openpyxl
python3 - <<'PY'
import pandas as pd, json
df = pd.read_excel('期权策略.xlsx').fillna('')
out = []
for name in df['Strategy Name'].drop_duplicates():
    rows = df[df['Strategy Name'] == name]
    f = rows.iloc[0]
    legs = [{'construction': str(r['Leg Construction']), 'effect': str(r['Effect'])}
            for _, r in rows.iterrows() if r['Leg Construction'] or r['Effect']]
    out.append({
        'name': name, 'nickname': f['Strategy Nickame'],
        'delta': f['Delta'], 'gamma': f['Gamma'], 'vega': f['Vega'], 'theta': f['Theta'],
        'cash_flow': f['Initial Cash Flow'], 'trader_role': f['Trader Role'],
        'purpose': f['By Purpose'], 'structure': f['By Structure'],
        'skill': f['Stage of Skill Acquisition'], 'legs': legs,
    })
with open('data.js', 'w', encoding='utf-8') as fp:
    fp.write('const STRATEGIES = ' + json.dumps(out, ensure_ascii=False, indent=2) + ';\n')
PY
```

---

## Notes on the payoff diagrams

- Strikes are **inferred** from moneyness labels in the leg construction (`ITM ≈ 90`, `ATM = 100`, `OTM ≈ 115`, `Further OTM ≈ 130` for calls; mirrored for puts). For inner/outer condor legs, additional offsets are applied.
- Premium offsets (the vertical translation that determines breakeven) are **omitted** so each diagram shows the canonical **shape** centered around P/L = 0.
- For **Calendar / Diagonal** strategies, both legs are plotted at the same expiration as a stand-in. The actual P/L profile depends on residual time value in the longer-dated leg. The diagram caption notes this.
- Multi-leg ratios (e.g. Call Ratio Backspread) are plotted at **1:1**, since the source data doesn't encode leg ratios numerically.

These diagrams are **for visual intuition only** — not for sizing real trades.

---

## License

The site code is free to use, modify, and redistribute. The underlying strategy taxonomy is from the user's own reference file.
