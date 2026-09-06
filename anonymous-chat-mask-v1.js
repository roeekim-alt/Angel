(function(){
'use strict';
var sb=null,targetUid=null,targetAnon=false,timer=null;
function q(s){return document.querySelector(s)}
function shared(){var c=window.ANGEL_SUPABASE;if(!c||!window.supabase)return null;return window.AngelSupabaseClient||(window.AngelSupabaseClient=window.supabase.createClient(c.url,c.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}))}
async function load(uid){targetUid=uid;targetAnon=false;if(!sb||!uid)return;var r=await sb.from('profiles').select('is_anonymous').eq('id',uid).maybeSingle();targetAnon=!!(r.data&&r.data.is_anonymous);setTimeout(mask,120)}
function mask(){if(!targetAnon)return;var h=q('.a4top h1')||q('.twtop h1');if(h&&h.textContent.trim()!=='שיחות'&&h.textContent.trim()!=='קהילה'&&h.textContent.trim()!=='מטפלים')h.textContent='חבר/ת קהילה';var n=q('.twhero .twname');if(n&&!n.querySelector('.twverified'))n.textContent='חבר/ת קהילה'}
function bind(){document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-a4-chat],[data-tw-chat],[data-tw-profile]');if(!t)return;var uid=t.getAttribute('data-a4-chat')||t.getAttribute('data-tw-chat')||t.getAttribute('data-tw-profile');if(uid)load(uid)},true);new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(mask,80)}).observe(document.body,{childList:true,subtree:true})}
function boot(){sb=shared();if(!sb)return setTimeout(boot,100);bind()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();