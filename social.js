/* Angel legacy social loader — v2 is the single active social layer */
(function(){
  if(document.querySelector('script[src="social-v2.js"]')) return;
  var s=document.createElement('script');
  s.src='social-v2.js?v=2';
  document.head.appendChild(s);
})();
