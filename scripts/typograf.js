const fs = require('fs');
const path = require('path');
const Typograf = require('typograf');

const tp = new Typograf({locale: ['ru', 'en-US']});

function processFile(file) {
  try {
    const html = fs.readFileSync(file, 'utf8');
    const result = tp.execute(html);
    fs.writeFileSync(file, result, 'utf8');
    console.log('Processed', file);
  } catch (err) {
    console.error('Failed to process', file, err.message);
  }
}

function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const name of items) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (p.endsWith('.html')) processFile(p);
  }
}

const siteDir = path.resolve(process.cwd(), 'site');
if (!fs.existsSync(siteDir)) {
  console.error('site directory not found:', siteDir);
  process.exit(2);
}

walk(siteDir);
