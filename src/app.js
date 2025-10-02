document.addEventListener('DOMContentLoaded', () => {
  const current = location.pathname.replace(/\/index\.html?$/, '/');
  document.querySelectorAll('header nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === '/' || current.endsWith(href))) a.classList.add('active');
  });
  console.log('Build:', document.documentElement.getAttribute('data-build') || 'dev');
});