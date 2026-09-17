/* Calls our own Cloudflare Pages Function (functions/api/server-status.js),
   which proxies the FXServer's /dynamic.json server-side. Never calls the
   FiveM master-list API or the game server directly from the browser. */
async function fetchServerInfo(){
  const count=document.getElementById('playerCount'), max=document.getElementById('maxPlayers'), pill=document.getElementById('serverStatusPill');
  if(!count&&!max&&!pill)return;
  try{
    const r=await fetch('/api/server-status',{headers:{Accept:'application/json'},cache:'no-store'});
    if(!r.ok)throw new Error(String(r.status));
    const d=await r.json();
    if(!d||typeof d.online!=='boolean')throw new Error('Invalid data');
    if(d.online){
      if(count)count.textContent=d.players??0; if(max)max.textContent=d.maxPlayers??100;
      if(pill){pill.classList.remove('offline');pill.innerHTML='<span class="live-dot"></span> ONLINE'}
    }else{
      if(count)count.textContent='—'; if(max)max.textContent='—';
      if(pill){pill.classList.add('offline');pill.textContent='OFFLINE'}
    }
  }catch(e){
    if(count)count.textContent='—'; if(max)max.textContent='—';
    if(pill){pill.classList.add('offline');pill.textContent='OFFLINE'}
    console.warn('PixelPH server status unavailable',e);
  }
}
fetchServerInfo(); setInterval(fetchServerInfo,30000);
