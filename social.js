/* Angel social network prototype layer — peer-to-peer community UI */
(function(){
  'use strict';
  var state={
    screen:null,
    profile:{name:'עומר',bio:'לומד לשתף קצת יותר, יום אחד בכל פעם.',topics:['בדידות','חרדה','התחלה מחדש'],photo:null,anonymous:false},
    posts:[
      {id:1,author:'תמר',ini:'ת',time:'לפני 18 דק׳',topic:'בדידות',text:'היום יצאתי לבד לקפה. פעם זה היה מרגיש לי כמו הוכחה שאין לי אף אחד. היום ניסיתי לראות את זה כשעה שאני נותנת לעצמי.',likes:14,liked:false,comments:[{author:'דנה',text:'זה נשמע קטן אבל זה ממש לא קטן 💛'}]},
      {id:2,author:'שגיא',ini:'ש',time:'לפני שעה',topic:'פוסט טראומה',text:'לילה לא פשוט. במקום להילחם בזה שלחתי הודעה למישהו שמבין. רק רציתי להזכיר שגם לבקש שמישהו יהיה איתך לכמה דקות זו התקדמות.',likes:31,liked:false,comments:[{author:'רוני',text:'מכיר את הלילות האלה. שמח שכתבת.'},{author:'אמיר',text:'תודה ששיתפת.'}]}
    ],
    chats:{},
    chatUser:null
  };

  function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function icon(path){return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>'}
  var ICONS={
    community:'<circle cx="9" cy="7" r="4"/><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>',
    heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    msg:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>'
  };

  function injectStyle(){
    if(document.getElementById('angel-social-style')) return;
    var s=document.createElement('style');s.id='angel-social-style';s.textContent=`
      .social-wrap{max-width:440px;margin:0 auto;padding:0 16px calc(112px + env(safe-area-inset-bottom));color:var(--ink)}
      .social-top{display:flex;justify-content:space-between;align-items:center;padding:20px 0 12px}.social-top h1{font-family:'Suez One','Assistant',serif;font-size:24px;margin:0}.social-sub{font-size:13px;color:var(--ink-soft);margin:2px 0 0}
      .social-card{background:#fff;border:1px solid var(--line);border-radius:22px;padding:16px;margin-bottom:12px}.composer textarea{width:100%;min-height:86px;resize:vertical;border:0;background:#F7F8FD;border-radius:16px;padding:12px 14px;font:inherit;color:var(--ink);outline:none}.composer-actions{display:flex;gap:8px;margin-top:10px}.social-btn{min-height:44px;border-radius:14px;padding:0 14px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:7px}.social-btn.primary{background:var(--ink);color:#fff;flex:1}.social-btn.light{background:#F2F4FB;color:var(--ink-soft)}
      .post-head{display:flex;align-items:center;gap:10px}.social-avatar{width:44px;height:44px;border-radius:15px;background:#EEF1FB;display:grid;place-items:center;font-weight:700;overflow:hidden;flex:none}.social-avatar img{width:100%;height:100%;object-fit:cover}.post-meta{flex:1}.post-name{font-weight:700}.post-time{font-size:12px;color:var(--ink-soft)}.post-topic{font-size:12px;background:#F2F4FB;color:var(--ink-soft);border-radius:99px;padding:4px 8px}.post-text{margin:12px 0;line-height:1.6}.post-image{width:100%;max-height:280px;object-fit:cover;border-radius:16px;margin:4px 0 10px;background:#EEF1FB}.post-actions{display:flex;gap:6px;border-top:1px solid var(--line);padding-top:10px}.post-actions button{flex:1;min-height:40px;border-radius:12px;background:#F7F8FD;display:flex;align-items:center;justify-content:center;gap:6px;font-weight:600;color:var(--ink-soft)}.post-actions button.liked{color:#C94F70;background:#FFF0F4}.comments{margin-top:10px;display:grid;gap:7px}.comment{background:#F7F8FD;border-radius:13px;padding:9px 11px;font-size:14px}.comment b{margin-left:5px}.comment-compose{display:flex;gap:7px;margin-top:9px}.comment-compose input{flex:1;min-width:0;border:1px solid var(--line);border-radius:13px;padding:9px 11px;font:inherit}.comment-compose button{border-radius:13px;background:var(--ink);color:#fff;padding:0 14px;font-weight:700}
      .social-upload{display:none}.upload-preview{display:flex;align-items:center;gap:8px;margin-top:8px;font-size:13px;color:var(--grass)}
      .profile-hero{text-align:center;padding:20px 16px}.profile-photo{width:90px;height:90px;border-radius:28px;background:#EEF1FB;display:grid;place-items:center;font-size:34px;font-weight:700;margin:0 auto 10px;overflow:hidden}.profile-photo img{width:100%;height:100%;object-fit:cover}.profile-tags{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:10px}.profile-tag{font-size:12px;padding:5px 9px;border-radius:99px;background:#F2F4FB;color:var(--ink-soft)}.profile-form label{display:block;font-size:13px;font-weight:700;margin:11px 0 5px}.profile-form input,.profile-form textarea{width:100%;border:1px solid var(--line);border-radius:14px;padding:11px 12px;font:inherit;color:var(--ink);background:#fff}.profile-form textarea{min-height:90px;resize:vertical}.anon-row{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#F7F8FD;border-radius:14px;padding:12px;margin-top:12px}.profile-actions{display:flex;gap:8px;margin-top:12px}
      .chat-list-item{width:100%;display:flex;align-items:center;gap:11px;text-align:right;padding:13px 0;border-bottom:1px solid var(--line)}.chat-list-item:last-child{border-bottom:0}.online-pill{font-size:12px;color:var(--grass)}.chat-thread{display:flex;flex-direction:column;gap:8px;min-height:280px}.chat-bubble{max-width:82%;padding:10px 12px;border-radius:15px}.chat-bubble.me{align-self:flex-start;background:var(--ink);color:#fff}.chat-bubble.them{align-self:flex-end;background:#F2F4FB}.chat-compose-social{display:flex;gap:7px;margin-top:12px}.chat-compose-social input{flex:1;min-width:0;border:1px solid var(--line);border-radius:14px;padding:11px 12px;font:inherit}.chat-compose-social button{border-radius:14px;background:var(--halo);padding:0 16px;font-weight:700}
      nav button[data-social-community]{color:#98A1BE}.social-current{color:var(--ink)!important}
      .social-empty{text-align:center;padding:30px 16px;color:var(--ink-soft)}
    `;document.head.appendChild(s);
  }

  function nav(){return document.querySelector('nav')}
  function ensureNav(){
    var n=nav();if(!n)return;
    if(!n.querySelector('[data-social-community]')){
      var b=document.createElement('button');b.setAttribute('data-social-community','1');b.innerHTML=icon(ICONS.community)+'<span>קהילה</span>';
      var chats=n.querySelector('[data-id="chats"]');n.insertBefore(b,chats||null);
    }
  }
  function setCurrent(id){
    var n=nav();if(!n)return;n.querySelectorAll('button').forEach(function(b){b.classList.remove('social-current');b.setAttribute('aria-current','false')});
    var target=id==='community'?n.querySelector('[data-social-community]'):n.querySelector('[data-id="'+id+'"]');if(target){target.classList.add('social-current');target.setAttribute('aria-current','true')}
  }
  function mount(html,id){
    var main=document.querySelector('main.wrap');if(!main)return;main.outerHTML='<main class="social-wrap" id="socialMount">'+html+'</main>';setCurrent(id);state.screen=id;
  }
  function top(title,sub){return '<header class="social-top"><div><h1>'+esc(title)+'</h1><p class="social-sub">'+esc(sub||'')+'</p></div></header>'}

  function communityHTML(){
    return top('הקהילה','אנשים שמבינים מבפנים, לא רק מבחוץ')+
      '<section class="social-card composer"><div style="display:flex;gap:10px;align-items:center;margin-bottom:10px"><div class="social-avatar">'+(state.profile.photo?'<img src="'+state.profile.photo+'">':esc(state.profile.name.charAt(0)))+'</div><b>מה עובר עליך היום?</b></div><textarea id="postText" placeholder="אפשר לשתף משהו קטן, שאלה, מחשבה או רגע שעבר עליך…"></textarea><div id="postPreview"></div><div class="composer-actions"><label class="social-btn light" for="postImage">'+icon(ICONS.image)+'תמונה</label><input class="social-upload" id="postImage" type="file" accept="image/*"><button class="social-btn primary" data-social-act="publish">פרסום לקהילה</button></div></section>'+state.posts.map(postHTML).join('');
  }
  function postHTML(p){
    return '<article class="social-card" data-post="'+p.id+'"><div class="post-head"><div class="social-avatar">'+esc(p.ini||p.author.charAt(0))+'</div><div class="post-meta"><div class="post-name">'+esc(p.author)+'</div><div class="post-time">'+esc(p.time)+'</div></div><span class="post-topic">'+esc(p.topic||'שיתוף')+'</span></div><div class="post-text">'+esc(p.text)+'</div>'+(p.image?'<img class="post-image" src="'+p.image+'" alt="תמונה שצורפה לפוסט">':'')+'<div class="post-actions"><button class="'+(p.liked?'liked':'')+'" data-social-act="like" data-id="'+p.id+'">'+icon(ICONS.heart)+'<span>'+p.likes+'</span></button><button data-social-act="focus-comment" data-id="'+p.id+'">'+icon(ICONS.msg)+'<span>'+p.comments.length+' תגובות</span></button><button data-social-act="report" data-id="'+p.id+'">דיווח</button></div><div class="comments">'+p.comments.map(function(c){return '<div class="comment"><b>'+esc(c.author)+'</b>'+esc(c.text)+'</div>'}).join('')+'</div><div class="comment-compose"><input id="comment-'+p.id+'" placeholder="כתבו תגובה…"><button data-social-act="comment" data-id="'+p.id+'">שלח</button></div></article>';
  }
  function renderCommunity(){mount(communityHTML(),'community');bindFileInputs()}

  function profileHTML(){
    var p=state.profile;return top('הפרופיל שלי','איך אחרים בקהילה יכירו אותך')+'<section class="social-card profile-hero"><div class="profile-photo">'+(p.photo?'<img src="'+p.photo+'" alt="תמונת פרופיל">':esc(p.name.charAt(0)))+'</div><h2 style="margin:0;font-size:20px">'+esc(p.anonymous?'חבר/ת קהילה':p.name)+'</h2><p class="small muted" style="margin:6px 0 0">'+esc(p.bio)+'</p><div class="profile-tags">'+p.topics.map(function(t){return '<span class="profile-tag">'+esc(t)+'</span>'}).join('')+'</div></section><section class="social-card profile-form"><label for="profileName">שם / כינוי</label><input id="profileName" value="'+esc(p.name)+'"><label for="profileBio">כמה מילים עליי</label><textarea id="profileBio">'+esc(p.bio)+'</textarea><label for="profileTopics">נושאים שמדברים אליי</label><input id="profileTopics" value="'+esc(p.topics.join(', '))+'" placeholder="בדידות, חרדה, החלמה…"><label class="social-btn light" for="profileImage" style="margin-top:12px">'+icon(ICONS.image)+'העלאת תמונת פרופיל</label><input class="social-upload" id="profileImage" type="file" accept="image/*"><div id="profilePreview"></div><div class="anon-row"><span><b>פרופיל אנונימי</b><span class="small muted" style="display:block">הציגו לקהילה כינוי במקום השם</span></span><input id="profileAnon" type="checkbox" '+(p.anonymous?'checked':'')+'></div><div class="profile-actions"><button class="social-btn primary" data-social-act="save-profile">שמירת פרופיל</button></div></section>';
  }
  function renderProfile(){mount(profileHTML(),'me');bindFileInputs()}

  function onlineUsers(){return (window.ANGELS||[]).filter(function(x){return x.online})}
  function chatsHTML(){
    if(state.chatUser!=null)return threadHTML();
    var users=onlineUsers();return top('הודעות','שיחות פרטיות עם חברי הקהילה')+'<section class="social-card">'+users.map(function(u){return '<button class="chat-list-item" data-social-act="open-chat" data-id="'+u.id+'"><div class="social-avatar">'+esc(u.ini)+'</div><span style="flex:1"><b>'+esc(u.name)+'</b><span class="small muted" style="display:block">'+esc(u.been)+'</span></span><span class="online-pill">● מחובר/ת</span></button>'}).join('')+'</section>';
  }
  function threadHTML(){
    var u=(window.ANGELS||[]).filter(function(x){return x.id===state.chatUser})[0];if(!u){state.chatUser=null;return chatsHTML()}
    if(!state.chats[u.id])state.chats[u.id]=[{from:'them',text:'היי. ראיתי שאנחנו מתמודדים עם דברים דומים. מה שלומך?'}];
    return top('שיחה עם '+u.name,'צ׳אט פרטי בין חברי הקהילה')+'<button class="social-btn light" data-social-act="chat-back" style="margin-bottom:10px">חזרה לכל השיחות</button><section class="social-card"><div class="chat-thread">'+state.chats[u.id].map(function(m){return '<div class="chat-bubble '+m.from+'">'+esc(m.text)+'</div>'}).join('')+'</div><div class="chat-compose-social"><input id="socialChatInput" placeholder="כתבו הודעה…"><button data-social-act="send-chat">שלח</button></div></section>';
  }
  function renderChats(){mount(chatsHTML(),'chats')}

  function bindFileInputs(){
    var pi=document.getElementById('postImage');if(pi)pi.addEventListener('change',function(){readFile(pi,function(src){pi.dataset.preview=src;var box=document.getElementById('postPreview');if(box)box.innerHTML='<div class="upload-preview">✓ תמונה מוכנה לפרסום</div>'})});
    var pr=document.getElementById('profileImage');if(pr)pr.addEventListener('change',function(){readFile(pr,function(src){pr.dataset.preview=src;var box=document.getElementById('profilePreview');if(box)box.innerHTML='<div class="upload-preview">✓ תמונת פרופיל מוכנה לשמירה</div>'})});
  }
  function readFile(input,cb){var f=input.files&&input.files[0];if(!f)return;var r=new FileReader();r.onload=function(){cb(r.result)};r.readAsDataURL(f)}

  document.addEventListener('click',function(e){
    var community=e.target.closest&&e.target.closest('[data-social-community]');if(community){e.preventDefault();e.stopPropagation();renderCommunity();return}
    var tab=e.target.closest&&e.target.closest('nav [data-act="tab"]');if(tab){var id=tab.getAttribute('data-id');if(id==='chats'||id==='me'){e.preventDefault();e.stopPropagation();if(id==='chats'){state.chatUser=null;renderChats()}else renderProfile();return}if(id==='home'){state.screen=null;setTimeout(ensureNav,0)}}
    var el=e.target.closest&&e.target.closest('[data-social-act]');if(!el)return;var act=el.getAttribute('data-social-act'),id=+el.getAttribute('data-id');
    if(act==='publish'){var t=document.getElementById('postText'),text=t?t.value.trim():'';if(!text)return;var img=document.getElementById('postImage');state.posts.unshift({id:Date.now(),author:state.profile.anonymous?'חבר/ת קהילה':state.profile.name,ini:state.profile.name.charAt(0),time:'עכשיו',topic:state.profile.topics[0]||'שיתוף',text:text,image:img&&img.dataset.preview||null,likes:0,liked:false,comments:[]});renderCommunity()}
    else if(act==='like'){var p=state.posts.find(function(x){return x.id===id});if(p){p.liked=!p.liked;p.likes+=p.liked?1:-1;renderCommunity()}}
    else if(act==='focus-comment'){var input=document.getElementById('comment-'+id);if(input)input.focus()}
    else if(act==='comment'){var p2=state.posts.find(function(x){return x.id===id}),inp=document.getElementById('comment-'+id);var txt=inp?inp.value.trim():'';if(p2&&txt){p2.comments.push({author:state.profile.anonymous?'חבר/ת קהילה':state.profile.name,text:txt});renderCommunity()}}
    else if(act==='report'){alert('הדיווח התקבל בפרוטוטייפ. בגרסה המחוברת הוא יעבור למערכת המודרציה.')}
    else if(act==='save-profile'){var n=document.getElementById('profileName'),b=document.getElementById('profileBio'),tp=document.getElementById('profileTopics'),an=document.getElementById('profileAnon'),im=document.getElementById('profileImage');state.profile.name=(n&&n.value.trim())||state.profile.name;state.profile.bio=(b&&b.value.trim())||'';state.profile.topics=(tp&&tp.value?tp.value.split(',').map(function(x){return x.trim()}).filter(Boolean):[]);state.profile.anonymous=!!(an&&an.checked);if(im&&im.dataset.preview)state.profile.photo=im.dataset.preview;renderProfile()}
    else if(act==='open-chat'){state.chatUser=id;renderChats()}
    else if(act==='chat-back'){state.chatUser=null;renderChats()}
    else if(act==='send-chat'){var c=document.getElementById('socialChatInput'),tx=c?c.value.trim():'';if(tx&&state.chatUser!=null){if(!state.chats[state.chatUser])state.chats[state.chatUser]=[];state.chats[state.chatUser].push({from:'me',text:tx});renderChats()}}
  },true);

  document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&e.target.id==='socialChatInput'){e.preventDefault();var btn=document.querySelector('[data-social-act="send-chat"]');if(btn)btn.click()}});
  new MutationObserver(function(){injectStyle();ensureNav()}).observe(document.documentElement,{childList:true,subtree:true});
  injectStyle();ensureNav();
})();