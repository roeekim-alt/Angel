(function(){
'use strict';
var timer=null,index=0,root=null,slides=[];
function q(s){return document.querySelector(s)}
function readHeroImage(){var hero=q('.hero');if(!hero)return '';try{var bg=getComputedStyle(hero,'::before').backgroundImage;return bg&&bg!=='none'?bg:''}catch(_e){return ''}}
function build(){if(q('#angelSunriseBackdrop'))return true;var bg=readHeroImage();if(!bg)return false;root=document.createElement('div');root.id='angelSunriseBackdrop';root.setAttribute('aria-hidden','true');for(var i=0;i<4;i++){var s=document.createElement('div');s.className='angel-sunrise-slide'+(i===0?' is-active':'');s.setAttribute('data-scene',String(i));s.style.backgroundImage=bg;root.appendChild(s);slides.push(s)}document.body.insertBefore(root,document.body.firstChild);document.documentElement.classList.add('angel-sunrise-ready');return true}
function show(n){if(!slides.length)return;slides.forEach(function(s,i){s.classList.toggle('is-active',i===n)});index=n}
function next(){show((index+1)%slides.length)}
function start(){if(!build()){setTimeout(start,120);return}if(matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;clearInterval(timer);timer=setInterval(function(){if(!document.hidden)next()},7200);document.addEventListener('visibilitychange',function(){if(!document.hidden&&slides.length)show(index)},false)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
