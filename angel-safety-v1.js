(function(){
  'use strict';

  function safeText(value, fallback){
    if (value == null) return fallback == null ? '' : fallback;
    var text = String(value).trim();
    return text || (fallback == null ? '' : fallback);
  }

  function isAllowedURLScheme(url){
    if (!url) return false;
    try {
      var parsed = new URL(String(url).trim(), window.location.href);
      return ['http:', 'https:', 'mailto:', 'tel:'].indexOf(parsed.protocol.toLowerCase()) >= 0;
    } catch (_e) {
      return false;
    }
  }

  function sanitizeUrl(value){
    var raw = safeText(value, '');
    if (!raw) return '#';

    var candidate = raw.replace(/[\u0000-\u001F\u007F]/g, '');
    var lower = candidate.toLowerCase();

    if (/^(javascript|data|vbscript):/i.test(lower)) return '#';
    if (isAllowedURLScheme(candidate)) return candidate;
    if (candidate.charAt(0) === '/' || candidate.charAt(0) === '#') return candidate;

    return '#';
  }

  function applySafeLinks(root){
    var scope = root || document;
    if (!scope.querySelectorAll) return;

    scope.querySelectorAll('a[href]').forEach(function(anchor){
      var original = anchor.getAttribute('href');
      var safe = sanitizeUrl(original);
      if (safe !== original) {
        anchor.setAttribute('href', safe);
      }
    });
  }

  function guardClick(event){
    var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;

    var href = link.getAttribute('href');
    if (sanitizeUrl(href) === '#') {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function boot(){
    applySafeLinks(document);
    document.addEventListener('click', guardClick, true);
  }

  window.ANGEL_SAFETY = window.ANGEL_SAFETY || {
    safeText: safeText,
    sanitizeUrl: sanitizeUrl,
    isAllowedURLScheme: isAllowedURLScheme,
    applySafeLinks: applySafeLinks
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, {once: true});
  } else {
    boot();
  }
})();
