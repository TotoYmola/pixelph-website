import {json} from '../../_lib/auth.js';

function bearer(request){
  const h=request.headers.get('authorization')||'';
  return h.startsWith('Bearer ')?h.slice(7).trim():'';
}

function isAdmin(env,id){
  return String(env.ADMIN_DISCORD_IDS||'')
    .split(',')
    .map(x=>x.trim())
    .filter(Boolean)
    .includes(String(id));
}

function responseFor(discordId, tier, priority, reservedClass, reservedSlots, expiresAt=null){
  const active = tier === 'prime_access' || tier === 'city_priority';
  return {
    discord_id: discordId,

    // Fields consumed by pixelph_queue v1.0
    tier,
    membership_tier: tier,
    active,
    status: active ? 'active' : 'inactive',

    // Extra descriptive fields for future integrations
    group: tier,
    priority,
    reserved_class: reservedClass,
    reserved_slots: reservedSlots,
    expires_at: expiresAt
  };
}

export async function onRequestGet({request,env}){
  if(!env.DB)return json({error:'Database not configured'},503);

  // Membership API uses its own secret, separate from the FiveM whitelist key.
  if(!env.MEMBERSHIP_API_KEY || bearer(request)!==env.MEMBERSHIP_API_KEY){
    return json({error:'Unauthorized'},401);
  }

  const url=new URL(request.url);
  const discordId=(url.searchParams.get('discord_id')||'').trim();
  if(!discordId)return json({error:'discord_id is required'},400);

  // Staff queue access is normally determined by ACE on the FiveM server.
  // This is retained as useful metadata/fallback for future integrations.
  if(isAdmin(env,discordId)){
    return json({
      discord_id:discordId,
      tier:'admin',
      membership_tier:'admin',
      active:true,
      status:'active',
      group:'admin',
      priority:1000,
      reserved_class:'admin',
      reserved_slots:10,
      expires_at:null
    });
  }

  const now=new Date().toISOString();

  try{
    const r=await env.DB.prepare(`
      SELECT package_key,expires_at
      FROM membership_entitlements
      WHERE discord_id=?
        AND status='active'
        AND (starts_at IS NULL OR starts_at<=?)
        AND (expires_at IS NULL OR expires_at>?)
        AND package_key IN ('prime_access','city_priority')
      ORDER BY CASE package_key
        WHEN 'prime_access' THEN 1
        WHEN 'city_priority' THEN 2
        ELSE 9
      END
      LIMIT 1
    `).bind(discordId,now,now).first();

    if(r?.package_key==='prime_access'){
      return json(responseFor(discordId,'prime_access',500,'prime',10,r.expires_at||null));
    }

    if(r?.package_key==='city_priority'){
      return json(responseFor(discordId,'city_priority',200,null,0,r.expires_at||null));
    }

    return json(responseFor(discordId,'regular',0,null,0,null));
  }catch(err){
    const msg=String(err?.message||err||'');

    if(msg.includes('no such table')){
      return json({
        ...responseFor(discordId,'regular',0,null,0,null),
        setup_required:true
      });
    }

    return json({error:'Membership lookup failed',detail:msg},500);
  }
}
