/**
 * Load each widget into its grid square as an isolated iframe document.
 * Widgets are standalone HTML files that centre themselves via widget-base.css,
 * so this works over http(s) and when index.html is opened straight from disk.
 */
function loadWidgets() {
  for (const item of document.querySelectorAll('[data-widget]')) {
    const iframe = document.createElement('iframe');
    iframe.src = `src/widgets/${item.getAttribute('data-widget')}.html`;
    iframe.title = item.getAttribute('data-widget');
    iframe.loading = 'lazy';
    item.appendChild(iframe);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadWidgets);
} else {
  loadWidgets();
}
