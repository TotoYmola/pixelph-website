(()=>{
  const target=new Date('2026-09-18T20:00:00+08:00').getTime();
  const root=document.getElementById('cityOpeningCountdown');
  const live=document.getElementById('cityOpenMessage');
  const ids=['cdDays','cdHours','cdMinutes','cdSeconds'].map(id=>document.getElementById(id));
  const connects=[...document.querySelectorAll('[data-connect-link]')];
  const pad=n=>String(n).padStart(2,'0');
  let timer;

  function lock(){
    connects.forEach(a=>{
      a.classList.add('countdown-connect-locked');
      if(!a.dataset.realHref) a.dataset.realHref=a.getAttribute('href')||'#';
      a.setAttribute('href','#');
      a.setAttribute('aria-disabled','true');
      a.setAttribute('title','PixelPH opens September 18, 2026 at 8:00 PM PHT');
    });
  }

  function unlock(){
    connects.forEach(a=>{
      a.classList.remove('countdown-connect-locked');
      if(a.dataset.realHref) a.setAttribute('href',a.dataset.realHref);
      a.removeAttribute('aria-disabled');
      a.removeAttribute('title');
    });
  }

  function tick(){
    const remaining=target-Date.now();
    if(remaining<=0){
      if(root){ root.hidden=true; root.style.display='none'; }
      if(live){ live.hidden=false; live.style.display='flex'; }
      unlock();
      clearInterval(timer);
      return;
    }

    lock();
    if(live){ live.hidden=true; live.style.display='none'; }
    if(root){ root.hidden=false; root.style.display='block'; }
    if(!root) return;

    const seconds=Math.floor(remaining/1000);
    const values=[
      Math.floor(seconds/86400),
      Math.floor((seconds%86400)/3600),
      Math.floor((seconds%3600)/60),
      seconds%60
    ];

    values.forEach((n,i)=>{
      if(ids[i]){
        const next=pad(n);
        if(ids[i].textContent!==next){
          ids[i].textContent=next;
          ids[i].animate([{opacity:.45,transform:'translateY(-2px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
        }
      }
    });
  }

  tick();
  timer=setInterval(tick,1000);
})();
