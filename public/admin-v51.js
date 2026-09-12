console.info('PixelPH Whitelist Admin v5.1 - revoke/reset build 20260912-1120');
const $ = (id) => document.getElementById(id);
const msg = $('adminMessage');
const dash = $('adminDashboard');
const rows = $('adminRows');
const empty = $('adminEmpty');
const panel = $('reviewPanel');
const backdrop = $('reviewBackdrop');
const search = $('adminSearch');
let apps = [];
let currentFilter = 'pending';

function esc(s){return String(s ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function fmtDate(v){if(!v)return '—';const d=new Date(v);return Number.isNaN(d.getTime())?esc(v):d.toLocaleString()}
function statusBadge(s){const value=String(s||'pending').toLowerCase();return `<span class="admin-status ${esc(value)}">${esc(value)}</span>`}
function integrityBadge(score){const n=Number(score||0);const cls=n>=60?'high':n>=30?'medium':'low';return `<span class="integrity-badge ${cls}">${n>=60?'⚠ ':''}${n}/100</span>`}
function integrityDetails(a){
  let data=null;try{data=a.integrity_json?JSON.parse(a.integrity_json):null}catch{}
  if(!data)return '<p class="review-muted">No additional integrity signal details were stored.</p>';
  if(data.method==='behavior-and-similarity-heuristic'){
    const sum=data.summary||{}, reasons=Array.isArray(data.reasons)?data.reasons:[];
    return `<div class="integrity-v2">
      <div class="integrity-mini-grid">
        <div><span>Paste events</span><strong>${esc(sum.pasteCount??0)}</strong></div>
        <div><span>Typing events</span><strong>${esc(sum.inputEvents??0)}</strong></div>
        <div><span>Active time</span><strong>${Math.round(Number(sum.totalMs||0)/1000)}s</strong></div>
        <div><span>Copy similarity</span><strong>${esc(data.copySimilarity??0)}%</strong></div>
      </div>
      ${reasons.length?`<div class="signal-reasons"><b>Review signals</b>${reasons.map(r=>`<span>${esc(r)}</span>`).join('')}</div>`:'<p class="review-muted">No strong integrity signals detected.</p>'}
      <p class="review-muted">This is a behavior/copy-similarity heuristic, not a definitive AI detector. Staff makes the final decision.</p>
    </div>`;
  }
  const entries=Array.isArray(data)?data:Object.entries(data).map(([key,value])=>({key,value}));
  if(!entries.length)return '<p class="review-muted">No additional integrity signal details were stored.</p>';
  return `<div class="integrity-list">${entries.map(x=>{
    if(Array.isArray(data)) return `<div>${esc(typeof x==='string'?x:JSON.stringify(x))}</div>`;
    const val=typeof x.value==='object'?JSON.stringify(x.value):String(x.value);
    return `<div><b>${esc(x.key)}</b><span>${esc(val)}</span></div>`;
  }).join('')}</div>`;
}

async function loadAdmin(){
  msg.className='notice';msg.textContent='Checking staff access…';
  try{
    const r=await fetch('/api/admin/applications',{headers:{accept:'application/json'},cache:'no-store'});
    let j={};try{j=await r.json()}catch{}
    if(!r.ok) throw new Error(j.error || (r.status===403?'Staff access required. Make sure this Discord account is listed in ADMIN_DISCORD_IDS.':'Unable to load applications.'));
    apps=j.applications||[];
    msg.classList.add('hidden');dash.classList.remove('hidden');
    updateStats();renderRows();
  }catch(e){
    msg.className='notice danger admin-access-error';
    msg.innerHTML=`<strong>Staff dashboard unavailable.</strong><br>${esc(e.message)}<div class="hero-actions" style="margin-top:14px"><a class="primary-btn" href="/api/auth/login?admin=1">Staff Discord Login</a><a class="ghost-btn" href="/">Back to Website</a></div>`;
  }
}

function updateStats(){
  $('statPending').textContent=apps.filter(a=>a.status==='pending').length;
  $('statApproved').textContent=apps.filter(a=>a.status==='approved').length;
  $('statRejected').textContent=apps.filter(a=>a.status==='rejected').length;
  $('statRevoked').textContent=apps.filter(a=>a.status==='revoked').length;
  $('statFlagged').textContent=apps.filter(a=>Number(a.integrity_score)>=60).length;
}

function filteredApps(){
  const q=(search?.value||'').trim().toLowerCase();
  return apps.filter(a=>{
    const statusOK=currentFilter==='all'||(currentFilter==='flagged'?Number(a.integrity_score)>=60:a.status===currentFilter);
    if(!statusOK)return false;
    if(!q)return true;
    return [a.discord_username,a.discord_id,a.character_name].some(v=>String(v||'').toLowerCase().includes(q));
  });
}

function renderRows(){
  const list=filteredApps();
  empty.classList.toggle('hidden',list.length!==0);
  $('adminList').classList.toggle('hidden',list.length===0);
  rows.innerHTML=list.map(a=>`<tr>
    <td><div class="applicant-cell"><strong>${esc(a.discord_username||'Unknown')}</strong><small>${esc(a.discord_id)}</small></div></td>
    <td>${esc(a.character_name)}</td>
    <td>${statusBadge(a.status)}</td>
    <td>${integrityBadge(a.integrity_score)}</td>
    <td>${fmtDate(a.created_at)}</td>
    <td><button class="ghost-btn admin-review-btn" data-review="${esc(a.id)}">Review</button></td>
  </tr>`).join('');
  document.querySelectorAll('[data-review]').forEach(b=>b.addEventListener('click',()=>openApp(b.dataset.review)));
}

function answerBlock(title,text){return `<section class="answer-block"><h3>${esc(title)}</h3><p>${esc(text||'—')}</p></section>`}
function openApp(id){
  const a=apps.find(x=>String(x.id)===String(id));if(!a)return;
  panel.innerHTML=`
    <div class="review-head">
      <div><div class="section-kicker">APPLICATION REVIEW</div><h2>${esc(a.character_name)}</h2><p>${esc(a.discord_username)} • ${esc(a.discord_id)}</p></div>
      <button class="drawer-close" type="button" aria-label="Close review">×</button>
    </div>
    <div class="review-meta">
      <div><span>Status</span>${statusBadge(a.status)}</div>
      <div><span>Age</span><strong>${esc(a.age)}</strong></div>
      <div><span>Integrity</span>${integrityBadge(a.integrity_score)}</div>
      <div><span>Submitted</span><strong>${fmtDate(a.created_at)}</strong></div>
    </div>
    <div class="integrity-card"><div class="review-label">Integrity signals</div>${integrityDetails(a)}</div>
    ${answerBlock('Roleplay Experience',a.rp_experience)}
    ${answerBlock('Character Concept',a.character_concept)}
    ${answerBlock('Conflict Scenario',a.scenario_conflict)}
    ${answerBlock('Metagaming Scenario',a.scenario_meta)}
    ${answerBlock('Why PixelPH',a.why_pixelph)}
    ${a.reviewed_at?`<div class="previous-review"><b>Previous review</b><p>${statusBadge(a.status)} by ${esc(a.reviewed_by||'staff')} on ${fmtDate(a.reviewed_at)}</p>${a.review_reason?`<p>${esc(a.review_reason)}</p>`:''}</div>`:''}
    <div class="quick-reasons"><span>Quick reason</span><div><button type="button" data-reason="Low-effort application. Please provide more detailed, original answers.">Low effort</button><button type="button" data-reason="Your answers contain signs of copied or heavily pasted content. Please reapply using your own words.">Copied / pasted</button><button type="button" data-reason="Your scenario answers do not demonstrate sufficient understanding of PixelPH roleplay rules.">RP knowledge</button><button type="button" data-reason="Whitelist access revoked by PixelPH staff.">Revoke access</button></div></div>
    <div class="field review-note"><label for="reviewReason">Staff note / decision reason</label><textarea id="reviewReason" placeholder="Required for Reject or Revoke. Optional when approving.">${esc(a.review_reason||'')}</textarea></div>
    <div class="admin-actions review-actions">
      ${a.status==='pending'?`<button class="primary-btn" data-decision="approved" data-id="${esc(a.id)}"><i class="fa-solid fa-check"></i> Approve</button><button class="danger-btn" data-decision="rejected" data-id="${esc(a.id)}"><i class="fa-solid fa-xmark"></i> Reject</button>`:''}
      ${a.status==='approved'?`<button class="danger-btn" data-decision="revoked" data-id="${esc(a.id)}"><i class="fa-solid fa-ban"></i> Revoke Whitelist</button>`:''}
      ${a.status==='revoked'?`<button class="primary-btn" data-decision="approved" data-id="${esc(a.id)}"><i class="fa-solid fa-rotate-left"></i> Restore Whitelist</button>`:''}
      <button class="ghost-btn" data-delete="${esc(a.id)}"><i class="fa-solid fa-trash"></i> Delete / Reset Application</button>
    </div>`;
  panel.classList.remove('hidden');backdrop.classList.remove('hidden');document.body.classList.add('review-open');
  panel.querySelector('.drawer-close').addEventListener('click',closePanel);backdrop.addEventListener('click',closePanel,{once:true});
  panel.querySelectorAll('[data-decision]').forEach(b=>b.addEventListener('click',()=>decide(b.dataset.id,b.dataset.decision,b)));
  panel.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>deleteApplication(b.dataset.delete,b)));
  panel.querySelectorAll('[data-reason]').forEach(b=>b.addEventListener('click',()=>{const t=$('reviewReason');if(t)t.value=b.dataset.reason||''}));
}
function closePanel(){panel.classList.add('hidden');backdrop.classList.add('hidden');document.body.classList.remove('review-open')}

async function decide(id,status,button){
  const reason=$('reviewReason')?.value||'';
  if((status==='rejected'||status==='revoked')&&!reason.trim())return alert(`Add a ${status==='revoked'?'revocation':'rejection'} reason first.`);
  if(status==='revoked'&&!confirm('Revoke this player’s PixelPH whitelist? This will remove the Whitelisted Discord role and block FiveM access.'))return;
  const label=button.innerHTML;button.disabled=true;button.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Saving…';
  try{
    const r=await fetch(`/api/admin/applications/${encodeURIComponent(id)}`,{method:'POST',headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify({status,reason})});
    const j=await r.json();if(!r.ok)throw new Error(j.error||'Update failed');
    const a=apps.find(x=>String(x.id)===String(id));if(a){a.status=status;a.review_reason=reason;a.reviewed_at=new Date().toISOString()}
    closePanel();updateStats();renderRows();
    const role=j.discord?.role||{};
    const dm=j.discord?.dm||{};
    const roleText=role.ok?'SUCCESS':(role.skipped?'SKIPPED':'FAILED');
    const dmText=dm.ok?'SUCCESS':(dm.skipped?'SKIPPED':'FAILED');
    const details=[
      `Application: ${status.toUpperCase()}`,
      `Discord role: ${roleText}${role.status?` (HTTP ${role.status})`:''}${role.error?` — ${role.error}`:''}`,
      `Discord DM: ${dmText}${dm.status?` (HTTP ${dm.status})`:''}${dm.error?` — ${dm.error}`:''}`
    ].join('\n');
    msg.className='notice admin-flash';
    msg.textContent=details.replace(/\n/g,' | ');
    msg.classList.remove('hidden');
    alert(details);
  }catch(e){alert(e.message)}finally{button.disabled=false;button.innerHTML=label}
}

async function deleteApplication(id,button){
  const a=apps.find(x=>String(x.id)===String(id));
  if(!a)return;
  if(!confirm(`Delete/reset ${a.discord_username || a.character_name}'s application?\n\nThis removes the application record, removes the Whitelisted Discord role, and allows a fresh application.`))return;
  const label=button.innerHTML;button.disabled=true;button.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Deleting…';
  try{
    const r=await fetch(`/api/admin/applications/${encodeURIComponent(id)}`,{method:'DELETE',headers:{accept:'application/json'}});
    const j=await r.json();if(!r.ok)throw new Error(j.error||'Delete failed');
    apps=apps.filter(x=>String(x.id)!==String(id));
    closePanel();updateStats();renderRows();
    alert('Application deleted/reset. The player can submit a fresh application.');
  }catch(e){alert(e.message)}finally{button.disabled=false;button.innerHTML=label}
}

document.querySelectorAll('.admin-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.admin-tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');currentFilter=btn.dataset.filter;renderRows()}));
search?.addEventListener('input',renderRows);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanel()});
loadAdmin();

// v5.2.1 Discord staff-channel diagnostic
(() => {
  const btn=document.getElementById('testStaffNotifyBtn');
  if(!btn) return;
  btn.addEventListener('click', async()=>{
    const msg=document.getElementById('adminMessage');
    const old=btn.textContent;
    btn.disabled=true; btn.textContent='Testing Discord…';
    try{
      const r=await fetch('/api/admin/applications',{method:'POST',cache:'no-store',headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify({action:'test_staff_notify'})});
      const j=await r.json();
      if(j.ok){
        msg.className='notice success';
        msg.textContent=`Discord staff notification SUCCESS (HTTP ${j.discord_status||200}) — check channel ${j.channel_id}.`;
      }else{
        msg.className='notice';
        msg.textContent=`Discord staff notification FAILED (HTTP ${j.discord_status||r.status}) — ${j.discord_error||j.error||'Unknown error'}`;
      }
    }catch(e){
      msg.className='notice'; msg.textContent=`Discord staff notification TEST ERROR — ${e.message}`;
    }finally{btn.disabled=false;btn.textContent=old;}
  });
})();
