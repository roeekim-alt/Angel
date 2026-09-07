(function(){
'use strict';
var timer=null;
function q(s){return document.querySelector(s)}
function addQuickTools(){
  var hero=q('.hero');
  if(!hero||q('#angelQuickTools'))return;
  var tools=document.createElement('div');
  tools.id='angelQuickTools';
  tools.className='angel-quick-tools';
  tools.innerHTML='\
    <button class="angel-quick-tool" data-design-go="breathe"><span>〰️</span><span>לנשום</span></button>\
    <button class="angel-quick-tool" data-design-go="journal"><span>📝</span><span>יומן</span></button>\
    <button class="angel-quick-tool" data-design-go="learn"><span>📖</span><span>כלים</span></button>\
    <button class="angel-quick-tool" data-design-go="community"><span>🫶</span><span>קהילה</span></button>';
  hero.insertAdjacentElement('afterend',tools);
}
function go(where){
  if(where==='community'){
    var c=q('[data-a4-community]'); if(c)c.click(); return;
  }
  if(where==='journal'){
    var c=q('[data-a4-community]'); if(c){c.click();setTimeout(function(){var f=q('[data-a4-view="feed"]');if(f)f.click()},250)} return;
  }
  if(where==='learn'){
    var c=q('[data-a4-community]'); if(c){c.click();setTimeout(function(){var k=q('[data-a4-view="knowledge"]');if(k)k.click()},250)} return;
  }
  if(where==='breathe'){
    var btn=q('[data-id="cbt"],#cbtNavBtn,[data-cbt-open]');
    if(btn){btn.click();return}
    var learn=[].slice.call(document.querySelectorAll('[data-act="learn"]')).find(function(x){return x.textContent.indexOf('חרדה')>=0||x.textContent.indexOf('נשימ')>=0});
    if(learn){learn.click();return}
    var emergency=q('[data-act="sheet"][data-id="emergency"]');
    if(emergency){alert('נשימה קצרה: שאיפה 4 שניות, נשיפה 6 שניות, חמש פעמים ברצף.');}
  }
}
function bind(){
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-design-go]');if(!b)return;e.preventDefault();go(b.getAttribute('data-design-go'))},true)
}
function boot(){addQuickTools();bind();new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(addQuickTools,100)}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
