/* Angel legacy social loader — v2 is the single active social layer */
(function(){
  var fix=document.createElement('style');
  fix.id='angel-v2-mobile-fix';
  fix.textContent='\n#v2mount .v2btn, #v2mount button.v2btn{flex:0 0 auto!important;height:auto!important;max-height:52px!important;min-height:42px!important;align-self:auto!important;}\n#v2mount [data-v2-save-profile]{display:block!important;width:100%!important;height:48px!important;min-height:48px!important;max-height:48px!important;flex:none!important;margin-top:12px!important;}\n#v2mount .v2form{display:block!important;}\n#v2mount .v2form input,#v2mount .v2form textarea,#v2mount .v2form select{box-sizing:border-box!important;}\n';
  document.head.appendChild(fix);
  if(document.querySelector('script[src^="social-v2.js"]')) return;
  var s=document.createElement('script');
  s.src='social-v2.js?v=3';
  document.head.appendChild(s);
})();
