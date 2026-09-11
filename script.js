const PIXELPH = {
  discord: 'https://discord.gg/te5mRyvFVc',
  cfxJoin: 'https://cfx.re/join/zjja5ap',
  serverAddress: 'play.pixelph.com:30120',
  openingTime: '2026-09-18T20:00:00+08:00'
};

function toggleMobileMenu(){document.getElementById('mobileMenu')?.classList.toggle('hidden')}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-connect-link]').forEach(a=>a.href=PIXELPH.cfxJoin);
  document.querySelectorAll('[data-discord-link]').forEach(a=>a.href=PIXELPH.discord);
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});document.getElementById('mobileMenu')?.classList.add('hidden')}}));
  const io=new IntersectionObserver(entries=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
});
