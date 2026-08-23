(function(){
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn);else fn();}
  ready(function(){
    var body=document.body;
    var app=document.getElementById('app');
    if(app){app.setAttribute('role','main');app.setAttribute('tabindex','-1');app.setAttribute('aria-label','התוכן הראשי');}

    var skip=document.createElement('a');
    skip.className='angel-skip';skip.href='#app';skip.textContent='דילוג לתוכן הראשי';
    body.insertBefore(skip,body.firstChild);

    function annotate(){
      document.querySelectorAll('svg').forEach(function(svg){svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');});
      document.querySelectorAll('button').forEach(function(btn){if(!btn.getAttribute('type'))btn.setAttribute('type','button');});
      var nav=document.querySelector('nav');if(nav)nav.setAttribute('aria-label','ניווט ראשי');
      var ticker=document.getElementById('ticker');if(ticker){ticker.setAttribute('role','status');ticker.setAttribute('aria-live','polite');ticker.setAttribute('aria-atomic','true');}
      document.querySelectorAll('.sheet').forEach(function(s){s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');});
      document.querySelectorAll('.overlay').forEach(function(o){o.setAttribute('aria-hidden','true');});
    }
    annotate();

    var btn=document.getElementById('angel-a11y-btn');
    var panel=document.getElementById('angel-a11y-panel');
    var close=document.getElementById('angel-a11y-close');
    if(!btn||!panel)return;

    function load(){
      try{
        var s=JSON.parse(localStorage.getItem('angelA11y')||'{}');
        body.classList.toggle('angel-high-contrast',!!s.contrast);
        body.classList.toggle('angel-reduce-motion',!!s.motion);
        body.classList.toggle('angel-underline-links',!!s.links);
        body.classList.remove('angel-text-lg','angel-text-xl');
        if(s.text===1)body.classList.add('angel-text-lg');
        if(s.text===2)body.classList.add('angel-text-xl');
      }catch(e){}
    }
    function save(){
      var s={contrast:body.classList.contains('angel-high-contrast'),motion:body.classList.contains('angel-reduce-motion'),links:body.classList.contains('angel-underline-links'),text:body.classList.contains('angel-text-xl')?2:body.classList.contains('angel-text-lg')?1:0};
      try{localStorage.setItem('angelA11y',JSON.stringify(s));}catch(e){}
    }
    function openPanel(){panel.hidden=false;btn.setAttribute('aria-expanded','true');setTimeout(function(){close.focus();},0);}
    function closePanel(){panel.hidden=true;btn.setAttribute('aria-expanded','false');btn.focus();}
    btn.addEventListener('click',function(){panel.hidden?openPanel():closePanel();});
    close.addEventListener('click',closePanel);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden)closePanel();});

    document.getElementById('a11y-text').addEventListener('click',function(){
      if(body.classList.contains('angel-text-xl'))body.classList.remove('angel-text-xl');
      else if(body.classList.contains('angel-text-lg')){body.classList.remove('angel-text-lg');body.classList.add('angel-text-xl');}
      else body.classList.add('angel-text-lg');
      save();
    });
    document.getElementById('a11y-contrast').addEventListener('click',function(){body.classList.toggle('angel-high-contrast');save();});
    document.getElementById('a11y-motion').addEventListener('click',function(){body.classList.toggle('angel-reduce-motion');save();});
    document.getElementById('a11y-links').addEventListener('click',function(){body.classList.toggle('angel-underline-links');save();});
    document.getElementById('a11y-reset').addEventListener('click',function(){body.classList.remove('angel-high-contrast','angel-reduce-motion','angel-underline-links','angel-text-lg','angel-text-xl');try{localStorage.removeItem('angelA11y');}catch(e){}});

    var observer=new MutationObserver(annotate);
    observer.observe(body,{childList:true,subtree:true});
    load();
  });
})();