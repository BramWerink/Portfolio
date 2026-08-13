/**
 * Load widget HTML fragments into grid items
 */
async function loadWidgets() {
  const gridItems = document.querySelectorAll('[data-widget]');
  const isFileProtocol = location.protocol === 'file:';

  for (const item of gridItems) {
    const widgetName = item.getAttribute('data-widget');
    const widgetPath = `src/widgets/${widgetName}.html`;

    let loaded = false;

    // Try fetch when not opened via file:// first
    if (!isFileProtocol) {
      try {
        const response = await fetch(widgetPath);
        if (response.ok) {
          const html = await response.text();
          item.innerHTML = html;
          executeInlineScripts(item);
          loaded = true;
        }
      } catch (e) {
        console.warn(`Fetch failed for ${widgetPath}:`, e);
      }
    }

    // If not loaded yet, try fetch as a fallback (covers some local servers/security setups)
    if (!loaded) {
      try {
        const response = await fetch(widgetPath);
        if (response.ok) {
          const html = await response.text();
          item.innerHTML = html;
          executeInlineScripts(item);
          loaded = true;
        }
      } catch (e) {
        console.warn(`Second fetch attempt failed for ${widgetPath}:`, e);
      }
    }

    // Final fallback: iframe (works reliably when opening index.html via file://)
    if (!loaded) {
      const iframe = document.createElement('iframe');
      iframe.src = widgetPath;
      iframe.loading = 'lazy';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      // when iframe loads, inject CSS to center its body content
      iframe.addEventListener('load', () => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          if (doc) {
            // ensure full height
            doc.documentElement.style.height = '100%';
            doc.body.style.height = '100%';
            doc.body.style.margin = '0';
            // center content
            doc.body.style.display = 'flex';
            doc.body.style.justifyContent = 'center';
            doc.body.style.alignItems = 'center';
          }
        } catch (e) {
          // ignore cross-origin or other access issues
          console.warn('Could not inject centering styles into iframe:', e);
        }
      });
      item.appendChild(iframe);
    }
  }
}

// Load widgets when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadWidgets);
} else {
  loadWidgets();
}

function executeInlineScripts(container) {
  const scripts = container.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    if (oldScript.src) newScript.src = oldScript.src;
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}
