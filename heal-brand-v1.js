(function(){
'use strict';

var MISSION='המטרה שלנו היא לעזור להציל חיים, לעזור לאנשים שנמצאים במצוקה למצוא שוב איכות חיים טובה יותר, לחבר בין מטפלים לאנשים שזקוקים לטיפול, ולחבר בין אנשים כדי שאף אחד לא יצטרך להתמודד לבד.';

function q(s,r){return (r||document).querySelector(s)}
function ensureHero(){
  var hero=q('.wrap>.hero:first-of-type')||q('main.wrap .hero');if(!hero)return;
  var lock=q('#healBrandLockup');
  if(!lock){
    lock=document.createElement('div');
    lock.id='healBrandLockup';
    lock.className='heal-lockup';
    lock.setAttribute('aria-label','heal — התמודדות יחד');
    lock.innerHTML='<img src="heal-icon.svg?v=20261007-heal1" alt="" aria-hidden="true"><span class="heal-lockup-copy"><span class="heal-word">heal</span><span class="heal-mini">התמודדות יחד</span></span>';
    hero.insertBefore(lock,hero.firstChild);
  }
  var h=hero.querySelector('h2');if(h&&h.textContent.trim().indexOf('התמודדות יחד')<0)h.textContent='התמודדות יחד.';
  var vision=hero.querySelector('.angel-vision');if(vision){vision.classList.add('heal-mission');vision.textContent=MISSION}
  var count=hero.querySelector('.count');if(count){
    var b=count.querySelector('b'),num=b?b.textContent.trim():'';
    count.innerHTML=(num?'<b>'+num+'</b> ':'')+'אנשים מחוברים עכשיו';
  }
  var cta=hero.querySelector('.cta');if(cta&&/מלאך/.test(cta.textContent||''))cta.innerHTML='<span aria-hidden="true">♡</span><span>חברו אותי למישהו</span>';
}
function replaceVisible(root){
  if(!root)return;
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[],n;
  while((n=walker.nextNode()))nodes.push(n);
  nodes.forEach(function(t){
    var p=t.parentElement;if(!p||/^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION)$/.test(p.tagName))return;
    var x=t.nodeValue,y=x;
    y=y.replace(/אנג[׳']ל/g,'heal')
       .replace(/Angel האישי/g,'heal האישי')
       .replace(/Angel אישי/g,'heal אישי')
       .replace(/\bAngel\b/g,'heal')
       .replace(/מלאכים מחוברים עכשיו/g,'אנשים מחוברים עכשיו')
       .replace(/כל המלאכים/g,'כל הקהילה')
       .replace(/שלחו לי מלאך/g,'חברו אותי למישהו')
       .replace(/מלאכים עם ההילה דלוקה עכשיו/g,'אנשים מחוברים עכשיו');
    if(y!==x)t.nodeValue=y;
  });
  if(root.querySelectorAll)root.querySelectorAll('[aria-label]').forEach(function(el){
    var a=el.getAttribute('aria-label')||'',b=a.replace(/אנג[׳']ל/g,'heal').replace(/Angel האישי/g,'heal האישי').replace(/Angel אישי/g,'heal אישי').replace(/\bAngel\b/g,'heal');
    if(a!==b)el.setAttribute('aria-label',b);
  });
}
function metadata(){
  document.title='heal — מתמודדים יחד';
  var m=q('meta[name="description"]');
  if(m)m.setAttribute('content','heal — התמודדות יחד. קהילה תומכת שמחברת בין אנשים ובין מטפלים למי שזקוקים לטיפול, כדי לעזור לאנשים במצוקה למצוא שוב קשר, תקווה ואיכות חיים טובה יותר.');
}
function sync(root){metadata();replaceVisible(root||document.body);ensureHero()}
function boot(){
  sync(document.body);
  new MutationObserver(function(ms){
    ms.forEach(function(m){m.addedNodes&&m.addedNodes.forEach(function(n){if(n.nodeType===1)sync(n);else if(n.nodeType===3&&n.parentElement)replaceVisible(n.parentElement)})});
    ensureHero();
  }).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();