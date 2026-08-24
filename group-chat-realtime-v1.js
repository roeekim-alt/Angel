(function(){
'use strict';
var sb=null,session=null,ch=null,currentGroup=null;
function q(s){return document.querySelector(s)}
function client(){var c=window.ANGEL_SUPABASE;if(!c||!window.supabase)return null;return window.AngelSupabaseClient||(window.AngelSupabaseClient=window.supabase.createClient(c.url,c.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}))}
function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function appendMessage(m){if(!currentGroup||m.group_id!==currentGroup)return;var chat=q('.a4card.a4chat');var composer=q('#a4gm');if(!chat||!composer)return;var bubble=document.createElement('div');bubble.className='a4bubble '+(session&&m.sender_id===session.user.id?'me':'them');bubble.innerHTML=esc(m.body);var compose=composer.closest('.a4compose');chat.insertBefore(bubble,compose||null);var empty=chat.querySelector('.a4empty');if(empty)empty.remove();chat.scrollTop=chat.scrollHeight}
function sub(){if(!sb||!session)return;if(ch){try{sb.removeChannel(ch)}catch(e){}}ch=sb.channel('angel-group-chat-'+session.user.id).on('postgres_changes',{event:'INSERT',schema:'public',table:'group_messages'},function(p){if(p.new&&(!session||p.new.sender_id!==session.user.id))appendMessage(p.new)}).subscribe()}
function bind(){document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-a4-group]');if(b)currentGroup=b.getAttribute('data-a4-group');var back=ev.target.closest&&ev.target.closest('[data-a4-gback]');if(back)currentGroup=null},true)}
async function boot(){bind();sb=client();if(!sb)return setTimeout(boot,120);var r=await sb.auth.getSession();session=r.data.session;if(session)sub();sb.auth.onAuthStateChange(function(_e,s){session=s;if(s)sub()})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();