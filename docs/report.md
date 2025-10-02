# Отчёт по выполнению задания

Ниже приведено подробное описание проделанной работы: архитектура темы, фронтенд-пайплайн, CI/CD и инструкции по локальной проверке.

## Описание темы

- Шаблон: `theme/main.html` (Jinja2). В шаблоне реализованы кастомные `header` и `footer`, а также контейнер для страницы (`.content`).
- Минимальные требования к теме выполнены: есть кастомный header, footer и стилизованная главная страница.
- Метаданные сайта (`site_name`, `site_description`, `site_author`) заданы в `mkdocs.yml` и выводятся в meta-тегах шаблона.

## Фронтенд-пайплайн

Файлы и инструменты:

- Исходники стилей: `src/styles.css` — теперь использует Tailwind (`@tailwind base; @tailwind components; @tailwind utilities;`) и дополнительные компоненты через `@apply`.
- Конфиг Tailwind: `tailwind.config.cjs` (content указывает `docs/`, `theme/` и `src/`).
- PostCSS конфиг: `postcss.config.js` подключает `tailwindcss`, `autoprefixer`, `cssnano`.
- JS: `src/app.js` собирается `esbuild` в `site/assets/app.js`.

Скрипты (в `package.json`):

- `npm run site:build` — `mkdocs build --strict --site-dir site`
- `npm run css:build` — `postcss src/styles.css -o site/assets/styles.css`
- `npm run js:build` — `esbuild src/app.js --bundle --minify --outfile=site/assets/app.js`
- `npm run html:validate` — `htmlhint` для локальной валидации HTML
- `npm run html:minify` — `html-minifier-terser` для минификации
- `npm run typograf:cli` — (новый) `node scripts/typograf.js` — применяет типографику к HTML в `site/`
- `npm run build` — выполняет site build, css, js, validate, w3c validate и minify
- `npm run build:typograf` — выполняет `build` и затем `typograf:cli` (CI использует эту команду)

## CI/CD (GitHub Actions)

Workflow: `.github/workflows/pages.yml`

- Триггер: push в `main` и `workflow_dispatch`.
- На runner `ubuntu-latest` выполняются шаги:
	1. Checkout
	2. Setup Node (v20) и Python (3.x)
	3. `pip install mkdocs`
	4. `npm ci` (воспроизводимая установка по `package-lock.json`)
	5. `npm run build:typograf` — полная сборка + типографика
	6. upload artifact `site/` и deploy через `actions/deploy-pages@v4`

## Валидация и качество

- HTML валидируется с помощью `htmlhint` (сконфигурирован через `.htmlhintrc`).
- Для строгой проверки предусмотрен W3C Nu Validator (через Docker в локальной конфигурации).
- Минификация происходит через `html-minifier-terser`.

## Типографика

- Реализована опция типографики: `typograf` пакет установлен, и для надёжного запуска создан `scripts/typograf.js` (использует API Typograf и рекурсивно меняет HTML-файлы в `site/`).

## Как проверить локально (быстрая инструкция)

1. Убедитесь, что у вас установлен Node.js и Python.
2. Установите зависимости:

```bash
npm ci
python -m pip install --upgrade pip mkdocs
```

3. Соберите сайт локально (как CI):

```bash
/path/to/.venv/bin/mkdocs build --strict --site-dir site
npm run css:build
npm run js:build
npm run html:validate
npm run html:minify
npm run typograf:cli
open site/index.html
```

## Файлы в репозитории, представляющие работу

- `mkdocs.yml` — конфигурация MkDocs и навигация
- `theme/` — кастомная тема (main.html)
- `src/` — исходники стилей и JS
- `docs/` — Markdown-контент (index.md, report.md)
- `.github/workflows/pages.yml` — CI/CD pipeline
- `package.json`, `package-lock.json` — npm скрипты и зависимости

