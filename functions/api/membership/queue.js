import {json} from '../../_lib/auth.js';

function bearer(request){
  const h=request.headers.get('authorization')||'';
  return h.startsWith('Bearer ')?h.slice(7).trim():'';
}
function isAdmin(env,id){
  return String(env.ADMIN_DISCORD_IDS||'').split(',').map(x=>x.trim()).filter(Boolean).includes(String(id));
}
export async function onRequestGet({request,env}){
  if(!env.DB)return json({error:'Database not configured'},503);
  if(!env.FIVEM_API_KEY||bearer(request)!==env.FIVEM_API_KEY)return json({error:'Unauthorized'},401);
  const url=new URL(request.url),discordId=(url.searchParams.get('discord_id')||'').trim();
  if(!discordId)return json({error:'discord_id is required'},400);

  if(isAdmin(env,discordId))return json({discord_id:discordId,group:'admin',priority:1000,reserved_class:'admin',reserved_slots:10});

  const now=new Date().toISOString();
  try{
    const r=await env.DB.prepare(`
      SELECT package_key,expires_at FROM membership_entitlements
      WHERE discord_id=? AND status='active'
      AND (starts_at IS NULL OR starts_at<=?)
      AND (expires_at IS NULL OR expires_at>?)
      AND package_key IN ('prime_access','city_priority')
      ORDER BY CASE package_key WHEN 'prime_access' THEN 1 WHEN 'city_priority' THEN 2 ELSE 9 END
      LIMIT 1
    `).bind(discordId,now,now).first();
    if(r?.package_key==='prime_access')return json({discord_id:discordId,group:'prime_access',priority:500,reserved_class:'prime',reserved_slots:10,expires_at:r.expires_at||null});
    if(r?.package_key==='city_priority')return json({discord_id:discordId,group:'city_priority',priority:200,reserved_class:null,reserved_slots:0,expires_at:r.expires_at||null});
    return json({discord_id:discordId,group:'regular',priority:0,reserved_class:null,reserved_slots:0});
  }catch(err){
    const msg=String(err?.message||err||'');
    if(msg.includes('no such table'))return json({discord_id:discordId,group:'regular',priority:0,reserved_class:null,reserved_slots:0,setup_required:true});
    return json({error:'Membership lookup failed'},500);
  }
}
