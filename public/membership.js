const statusBox=document.getElementById('membershipStatus');
const statusTitle=document.getElementById('membershipStatusTitle');
const statusCopy=document.getElementById('membershipStatusCopy');
const accountBtn=document.getElementById('membershipAccountBtn');
const fmt=d=>d?new Date(d).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'No expiry';
(async()=>{
  try{
    const r=await fetch('/api/membership/me',{cache:'no-store'});
    const j=await r.json();
    if(r.status===401||!j.authenticated){statusBox?.classList.add('signed-out');return}
    if(accountBtn)accountBtn.textContent='Open My PixelPH';
    const active=j.active||[];
    if(!active.length){statusTitle.textContent='No active membership';statusCopy.textContent='You are signed in. Active supporter packages will appear here once staff activates them.';statusBox?.classList.add('inactive');return}
    statusBox?.classList.add('active');
    statusTitle.textContent=active.map(x=>x.package?.name||x.package_key).join(' + ');
    statusCopy.textContent=active.map(x=>`${x.package?.name||x.package_key}: ${x.expires_at?`active until ${fmt(x.expires_at)}`:'active'}`).join(' • ');
  }catch{if(statusTitle)statusTitle.textContent='Membership status temporarily unavailable'}
})();
