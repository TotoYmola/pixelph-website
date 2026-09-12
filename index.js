import {readSession,json} from '../../_lib/auth.js';
import {sendDm} from '../../_lib/discord.js';
function text(v,min,max){v=String(v||'').trim();if(v.length<min||v.length>max)throw new Error(`Answer length must be ${min}-${max} characters.`);return v}
function words(s){return String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(x=>x.length>2)}
function shingles(s,n=4){const w=words(s),out=new Set();for(let i=0;i<=w.length-n;i++)out.add(w.slice(i,i+n).join(' '));return out}
function similarity(a,b){const A=shingles(a),B=shingles(b);if(!A.size||!B.size)return 0;let hit=0;for(const x of A)if(B.has(x))hit++;return Math.round((hit/Math.min(A.size,B.size))*100)}
function clientSignals(i){const total=Number(i?.totalMs||0),paste=Number(i?.pasteCount||0),fields=Object.values(i?.fields||{});const events=fields.reduce((s,x)=>s+Number(x.inputEvents||0),0),focus=fields.reduce((s,x)=>s+Number(x.focusMs||0),0);return{totalMs:total,pasteCount:paste,inputEvents:events,focusMs:focus,fieldCount:fields.length}}
function riskFromSignals(s,copy){let score=0;const reasons=[];
  if(s.totalMs&&s.totalMs<120000){score+=28;reasons.push('Very fast completion time')}
  else if(s.totalMs&&s.totalMs<240000){score+=14;reasons.push('Fast completion time')}
  if(s.pasteCount>=6){score+=35;reasons.push('Heavy paste activity')}
  else if(s.pasteCount>=3){score+=24;reasons.push('Multiple paste events')}
  else if(s.pasteCount>0){score+=8;reasons.push('Paste activity detected')}
  if(s.inputEvents<40){score+=20;reasons.push('Low typing/input activity')}
  if(s.focusMs&&s.focusMs<90000){score+=15;reasons.push('Low active field focus time')}
  if(copy>=70){score+=45;reasons.push(`High similarity to an existing application (${copy}%)`)}
  else if(copy>=45){score+=25;reasons.push(`Moderate similarity to an existing application (${copy}%)`)}
  return {score:Math.min(100,score),reasons}
}
export async function onRequestPost({request,env}){
  if(!env.DB)return json({error:'Database not configured'},503);
  const user=await readSession(request,env);if(!user)return json({error:'Sign in with Discord first.'},401);
  let b;try{b=await request.json()}catch{return json({error:'Invalid request'},400)}
  const latest=await env.DB.prepare('SELECT status,updated_at,created_at FROM applications WHERE discord_id=? ORDER BY created_at DESC LIMIT 1').bind(user.id).first();
  if(latest?.status==='pending'||latest?.status==='approved')return json({error:'You already have an active application.'},409);
  if(latest?.status==='rejected'&&Date.now()-new Date(latest.updated_at||latest.created_at).getTime()<7*86400000)return json({error:'You can reapply 7 days after a rejection.'},429);
  try{
    const clean={
      character_name:text(b.character_name,3,60),age:Number(b.age),rp_experience:text(b.rp_experience,120,1500),character_concept:text(b.character_concept,180,1800),scenario_conflict:text(b.scenario_conflict,140,1600),scenario_meta:text(b.scenario_meta,120,1400),why_pixelph:text(b.why_pixelph,120,1400)
    };
    if(!Number.isFinite(clean.age)||clean.age<16||clean.age>100)throw new Error('Enter a valid character age.');
    const combined=[clean.rp_experience,clean.character_concept,clean.scenario_conflict,clean.scenario_meta,clean.why_pixelph].join('\n');
    const prior=await env.DB.prepare('SELECT discord_id,rp_experience,character_concept,scenario_conflict,scenario_meta,why_pixelph FROM applications WHERE discord_id<>? ORDER BY created_at DESC LIMIT 200').bind(user.id).all();
    let maxCopy=0,matchDiscord=null;
    for(const x of prior.results||[]){const other=[x.rp_experience,x.character_concept,x.scenario_conflict,x.scenario_meta,x.why_pixelph].join('\n');const sim=similarity(combined,other);if(sim>maxCopy){maxCopy=sim;matchDiscord=x.discord_id}}
    const cs=clientSignals(b.integrity||{}),risk=riskFromSignals(cs,maxCopy);
    const integrity={client:b.integrity||{},summary:cs,copySimilarity:maxCopy,matchedDiscordId:maxCopy>=45?matchDiscord:null,reasons:risk.reasons,method:'behavior-and-similarity-heuristic'};
    const id=crypto.randomUUID(),now=new Date().toISOString();
    await env.DB.prepare(`INSERT INTO applications (id,discord_id,discord_username,character_name,age,rp_experience,character_concept,scenario_conflict,scenario_meta,why_pixelph,status,integrity_score,integrity_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?, 'pending',?,?,?,?)`)
      .bind(id,user.id,user.username,clean.character_name,clean.age,clean.rp_experience,clean.character_concept,clean.scenario_conflict,clean.scenario_meta,clean.why_pixelph,risk.score,JSON.stringify(integrity),now,now).run();
    const dm=await sendDm(env,user.id,`📨 **PixelPH Whitelist Application Received**\nYour application for **${clean.character_name}** is now under staff review.\n\nCheck your status anytime: https://pixelph.com/pages/whitelist.html`);
    return json({ok:true,id,status:'pending',notification:dm.ok?'sent':'skipped'},201)
  }catch(e){return json({error:e.message||'Unable to submit'},400)}
}
