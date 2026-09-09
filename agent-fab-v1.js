(function(){
'use strict';
function ensure(){if(document.getElementById('angelAgentFab'))return;var b=document.createElement('button');b.id='angelAgentFab';b.className='angel-agent-fab';b.type='button';b.setAttribute('aria-label','פתיחת Angel האישי');b.innerHTML='<span class="spark" aria-hidden="true">✦</span><span>Angel האישי</span>';b.addEventListener('click',function(){window.dispatchEvent(new CustomEvent('angel:open-agent'))});document.body.appendChild(b)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
})();
