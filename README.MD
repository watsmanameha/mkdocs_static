# Custom MkDocs + GitHub Pages

Кастомная тема MkDocs (Jinja2), сборка фронтенда (PostCSS + esbuild), валидация HTML (HTMLHint + W3C v.NU), минификация и деплой на GitHub Pages через Actions.

## Локальная сборка
```bash
python -m venv .venv && source .venv/bin/activate
pip install -U pip mkdocs
npm ci
npm run build     # или npm run build:typograf
mkdocs serve
```

## CI/CD

Workflow: .github/workflows/pages.yml
Этапы: MkDocs → PostCSS → esbuild → HTMLHint → W3C → Minify → Pages.