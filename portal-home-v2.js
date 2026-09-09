(function(){
'use strict';
var sb=null,session=null,profile=null,timer=null;
function q(s){return document.querySelector(s)}
function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function shared(){var c=window.ANGEL_SUPABASE;if(!c||!window.supabase)return null;return window.AngelSupabaseClient||(window.AngelSupabaseClient=window.supabase.createClient(c.url,c.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}))}
async function loadProfile(){if(!sb||!session){profile=null;return}var r=await sb.from('profiles').select('id,display_name,bio,topics,is_anonymous').eq('id',session.user.id).maybeSingle();profile=r.data||null}
function greeting(){var n=profile&&!profile.is_anonymous&&profile.display_name?profile.display_name.split(/\s+/)[0]:'';return n?'המרחב של '+esc(n):'המרחב שלך'}
function portalHTML(){return '<section id="angelPortal" class="angel-portal" aria-label="המרחב האישי של Angel">'+
  '<section class="angel-portal-section"><div class="angel-portal-head"><div class="angel-portal-title-wrap"><h2 class="angel-portal-title">'+greeting()+'</h2><span class="angel-portal-line"></span></div><button class="angel-portal-link" data-portal-go="community">לכל הקהילה ‹</button></div>'+
  '<div class="angel-portal-strip">'+
    tile('agent','✨','Angel אישי','צ׳אט תמיכה אישי שמותאם למה שבחרת לשתף.')+
    tile('breathe','〰️','נשימה והרגעה','כלים קצרים לרגעים של הצפה או לחץ.')+
    tile('journal','📝','יומן','לכתוב מחשבות, לעקוב ולתת מקום למה שעובר עליך.')+
    tile('community','🫶','קהילה','אנשים אמיתיים שמקשיבים, משתפים ומבינים.')+
    tile('therapists','⚕️','מטפלים','פרופילים מאומתים של אנשי מקצוע בקהילה.')+
    tile('tools','📖','ידע וכלים','תוכן וכלים מעשיים להתמודדות יומיומית.')+
  '</div></section>'+
  '<section class="angel-portal-section"><div class="angel-portal-head"><div class="angel-portal-title-wrap"><h2 class="angel-portal-title">Angel האישי שלי</h2><span class="angel-portal-line"></span></div></div>'+
    '<article class="angel-agent-card"><div class="angel-agent-card-copy"><div class="angel-agent-kicker">מרחב תמיכה אישי</div><h3>מקום קבוע לדבר בו</h3><p>Angel האישי משתמש בפרופיל ובהעדפות שבחרת לשתף כדי לתת שיחה עקבית ועדינה יותר. הוא לא מחליף מטפל, אבחון או שירות חירום.</p><button class="angel-agent-open" data-portal-go="agent">פתחו את Angel האישי</button></div><div class="angel-agent-art" aria-hidden="true"><span>😇</span></div></article>'+
  '</section></section>'}
function tile(id,icon,title,desc){return '<button class="angel-portal-tile" data-portal-go="'+id+'"><span class="angel-portal-visual" aria-hidden="true">'+icon+'</span><span class="angel-portal-copy"><b>'+title+'</b><span>'+desc+'</span></span></button>'}
function inject(){var hero=q('main.wrap .hero')||q('.wrap > .hero:first-of-type');if(!hero||q('#angelPortal'))return;var box=document.createElement('div');box.innerHTML=portalHTML();hero.insertAdjacentElement('afterend',box.firstElementChild);labelLiveSection()}
function labelLiveSection(){var filters=q('.filters');if(!filters||q('#angelLiveTitle'))return;var h=document.createElement('div');h.id='angelLiveTitle';h.className='angel-portal angel-portal-head';h.style.marginTop='30px';h.innerHTML='<div class="angel-portal-title-wrap"><h2 class="angel-portal-title">מלאכים מחוברים עכשיו</h2><span class="angel-portal-line"></span></div>';filters.insertAdjacentElement('beforebegin',h)}
function openCommunity(view){var b=q('[data-a4-community]');if(!b)return false;b.click();if(view)setTimeout(function(){var x=q('[data-a4-view="'+view+'"]');if(x)x.click()},260);return true}
function go(id){if(id==='agent'){window.dispatchEvent(new CustomEvent('angel:open-agent'));return}
if(id==='community'){if(!openCommunity())q('nav [data-id="chats"]')?.click();return}
if(id==='journal'){if(openCommunity('feed'))setTimeout(function(){q('#a4post')?.focus()},420);return}
if(id==='tools'){if(openCommunity('knowledge'))return;var k=[].slice.call(document.querySelectorAll('[data-act="learn"]'))[0];if(k)k.click();return}
if(id==='therapists'){var t=q('#twNavBtn');if(t)t.click();else q('nav [data-id="me"]')?.click();return}
if(id==='breathe'){var b=q('[data-id="cbt"],#cbtNavBtn,[data-cbt-open]');if(b){b.click();return}var l=[].slice.call(document.querySelectorAll('[data-act="learn"]')).find(function(x){return /חרדה|נשימ/.test(x.textContent||'')});if(l)l.click();return}}
function bind(){document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-portal-go]');if(!b)return;e.preventDefault();go(b.getAttribute('data-portal-go'))},true)}
async function boot(){sb=shared();if(sb){var s=await sb.auth.getSession();session=s.data.session;if(session)await loadProfile();sb.auth.onAuthStateChange(async function(_e,ses){session=ses;if(session)await loadProfile();else profile=null;var old=q('#angelPortal');if(old)old.remove();inject()})}bind();inject();new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(function(){inject();labelLiveSection()},160)}).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
