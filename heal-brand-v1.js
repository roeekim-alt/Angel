(function(){
'use strict';

var MISSION='המטרה שלנו היא לעזור להציל חיים, לעזור לאנשים שנמצאים במצוקה למצוא שוב איכות חיים טובה יותר, לחבר בין מטפלים לאנשים שזקוקים לטיפול, ולחבר בין אנשים כדי שאף אחד לא יצטרך להתמודד לבד.';

function q(s,r){return (r||document).querySelector(s)}
function hillMark(){
  return '<svg class="heal-mark-svg" viewBox="0 0 72 52" aria-hidden="true" focusable="false">'+
    '<path d="M7 41c8-4 13-12 18-19 3-5 6-9 11-12 5 3 8 7 11 12 5 7 10 15 18 19" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<path d="M18 41h36" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'+
    '<circle cx="36" cy="7" r="3.5" fill="currentColor"/>'+
  '</svg>'
}
function addCss(){
  if(q('#healBrandCss'))return;
  var s=document.createElement('style');s.id='healBrandCss';s.textContent=`
  :root{--heal-blue:#0B63F6;--heal-navy:#0B2E59;--heal-mint:#3AAE8C;--heal-cream:#F7F4EE}
  .wrap>.hero:first-of-type{position:relative!important}
  .heal-brand-lockup{position:absolute!important;top:calc(17px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:210!important;display:flex!important;align-items:center!important;gap:9px!important;padding:8px 13px!important;border-radius:999px!important;background:rgba(255,255,255,.90)!important;color:var(--heal-navy)!important;border:1px solid rgba(255,255,255,.96)!important;box-shadow:0 8px 24px rgba(13,46,79,.13)!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important;direction:ltr!important}
  .heal-brand-lockup .heal-mark-svg{width:31px;height:24px;display:block}
  .heal-brand-name{font:900 21px/1 system-ui,-apple-system,'Assistant',sans-serif;letter-spacing:-.035em}
  .wrap>.hero:first-of-type h2::after{content:"קהילה תומכת לכל מי שצריך את זה."!important;color:#FFE9A8!important;font-size:18px!important;line-height:1.35!important}
  .wrap>.hero:first-of-type .angel-vision{max-width:620px!important;font-size:15px!important;line-height:1.62!important}
  .heal-mission{color:rgba(255,255,255,.96)!important;text-shadow:0 2px 10px rgba(0,0,0,.45)!important}
  .heal-brand-inline{display:inline-flex;align-items:center;gap:7px;font-weight:900;color:var(--heal-navy)}
  .heal-brand-inline .heal-mark-svg{width:27px;height:20px}
  @media(max-width:390px){.heal-brand-lockup{top:calc(14px + env(safe-area-inset-top));padding:7px 11px!important}.heal-brand-name{font-size:19px}.heal-brand-lockup .heal-mark-svg{width:28px;height:22px}}
  `;document.head.appendChild(s)
}
function ensureHero(){
  var hero=q('.wrap>.hero:first-of-type')||q('main.wrap .hero');if(!hero)return;
  var lock=q('#healBrandLockup');
  if(!lock){lock=document.createElement('div');lock.id='healBrandLockup';lock.className='heal-brand-lockup';lock.setAttribute('aria-label','Heal — התמודדות יחד');lock.innerHTML=hillMark()+'<span class="heal-brand-name">Heal</span>';hero.insertBefore(lock,hero.firstChild)}
  var h=hero.querySelector('h2');if(h&&h.textContent.trim().indexOf('התמודדות יחד')<0){h.innerHTML='התמודדות יחד.'}
  var vision=hero.querySelector('.angel-vision');
  if(vision){vision.classList.add('heal-mission');vision.textContent=MISSION}
  var count=hero.querySelector('.count');if(count){count.innerHTML=count.innerHTML.replace(/מלאכים[^<]*/g,'אנשים מחוברים עכשיו').replace(/עם ההילה דלוקה עכשיו/g,'מחוברים עכשיו')}
  var cta=hero.querySelector('.cta');if(cta&&/מלאך/.test(cta.textContent||'')){cta.innerHTML='<span aria-hidden="true">♡</span><span>חברו אותי למישהו</span>'}
}
function replaceVisible(root){
  if(!root)return;
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  var nodes=[],n;while((n=walker.nextNode()))nodes.push(n);
  nodes.forEach(function(t){
    var p=t.parentElement;if(!p||/^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION)$/.test(p.tagName))return;
    var x=t.nodeValue, y=x;
    y=y.replace(/אנג[׳']ל/g,'Heal');
    y=y.replace(/Angel האישי/g,'Heal האישי');
    y=y.replace(/Angel אישי/g,'Heal אישי');
    y=y.replace(/מלאכים מחוברים עכשיו/g,'אנשים מחוברים עכשיו');
    y=y.replace(/כל המלאכים/g,'כל הקהילה');
    y=y.replace(/שלחו לי מלאך/g,'חברו אותי למישהו');
    y=y.replace(/מלאכים עם ההילה דלוקה עכשיו/g,'אנשים מחוברים עכשיו');
    if(y!==x)t.nodeValue=y;
  });
  root.querySelectorAll&&root.querySelectorAll('[aria-label]').forEach(function(el){
    var a=el.getAttribute('aria-label')||'',b=a.replace(/אנג[׳']ל/g,'Heal').replace(/Angel האישי/g,'Heal האישי').replace(/Angel אישי/g,'Heal אישי');if(a!==b)el.setAttribute('aria-label',b)
  })
}
function metadata(){
  document.title='Heal — התמודדות יחד';
  var m=q('meta[name="description"]');if(m)m.setAttribute('content','Heal — התמודדות יחד. קהילה תומכת שמחברת בין אנשים ובין מטפלים למי שזקוקים לטיפול, כדי לעזור לאנשים במצוקה למצוא שוב קשר, תקווה ואיכות חיים טובה יותר.')
}
function sync(root){addCss();metadata();replaceVisible(root||document.body);ensureHero()}
function boot(){
  sync(document.body);
  var obs=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1)sync(n);else if(n.nodeType===3&&n.parentElement)replaceVisible(n.parentElement)})});ensureHero()});
  obs.observe(document.body,{childList:true,subtree:true})
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();