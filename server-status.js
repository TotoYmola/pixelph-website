const SERVER_ID='zjja5ap';
async function fetchServerInfo(){
  const count=document.getElementById('playerCount'), max=document.getElementById('maxPlayers'), pill=document.getElementById('serverStatusPill');
  if(!count&&!max&&!pill)return;
  try{
    const r=await fetch(`https://servers-frontend.fivem.net/api/servers/single/${SERVER_ID}`,{headers:{Accept:'application/json'}});
    if(!r.ok)throw new Error(String(r.status));
    const j=await r.json(); const d=j?.Data; if(!d)throw new Error('Invalid data');
    if(count)count.textContent=d.clients??0; if(max)max.textContent=d.sv_maxclients??0;
    if(pill){pill.classList.remove('offline');pill.innerHTML='<span class="live-dot"></span> SERVER ONLINE'}
  }catch(e){
    if(count)count.textContent='—'; if(max)max.textContent='—';
    if(pill){pill.classList.add('offline');pill.textContent='STATUS UNAVAILABLE'}
    console.warn('PixelPH server status unavailable',e);
  }
}
fetchServerInfo(); setInterval(fetchServerInfo,30000);
