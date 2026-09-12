const API='https://discord.com/api/v10';
function configured(env){return Boolean(env.DISCORD_BOT_TOKEN)}

async function req(env,path,opts={}){
  if(!configured(env)) return {ok:false,skipped:true,status:null,error:'Discord bot not configured',body:null,raw:null,path};
  try{
    const r=await fetch(API+path,{
      ...opts,
      headers:{
        authorization:`Bot ${env.DISCORD_BOT_TOKEN}`,
        'content-type':'application/json',
        ...(opts.headers||{})
      }
    });
    const raw=await r.text();
    let body=null;
    if(raw){try{body=JSON.parse(raw)}catch{body=raw}}
    let error=null;
    if(!r.ok){
      if(body && typeof body==='object' && body.message) error=String(body.message);
      else if(typeof body==='string' && body.trim()) error=body.slice(0,500);
      else error=`Discord API ${r.status} ${r.statusText||''}`.trim();
    }
    return {ok:r.ok,status:r.status,statusText:r.statusText||'',body,raw:raw.slice(0,1000),error,path};
  }catch(e){
    return {ok:false,status:null,statusText:'',body:null,raw:null,error:`Discord fetch exception: ${e?.message||String(e)}`,path};
  }
}

export async function getChannel(env,channelId){
  if(!channelId) return {ok:false,skipped:true,error:'Discord channel not configured',status:null,body:null,raw:null};
  return req(env,`/channels/${encodeURIComponent(String(channelId))}`,{method:'GET'});
}

export async function setWhitelistRole(env,discordId,enabled){
  if(!env.DISCORD_GUILD_ID||!env.DISCORD_WHITELIST_ROLE_ID) return {ok:false,skipped:true,error:'Discord guild/role not configured'};
  const path=`/guilds/${encodeURIComponent(env.DISCORD_GUILD_ID)}/members/${encodeURIComponent(discordId)}/roles/${encodeURIComponent(env.DISCORD_WHITELIST_ROLE_ID)}`;
  return req(env,path,{method:enabled?'PUT':'DELETE'});
}

export async function sendDm(env,discordId,content){
  if(!configured(env)) return {ok:false,skipped:true,error:'Discord bot not configured'};
  const dm=await req(env,'/users/@me/channels',{method:'POST',body:JSON.stringify({recipient_id:String(discordId)})});
  if(!dm.ok||!dm.body?.id)return dm;
  return req(env,`/channels/${dm.body.id}/messages`,{method:'POST',body:JSON.stringify({content:String(content).slice(0,1900)})});
}

export async function sendChannelMessage(env,channelId,content){
  if(!configured(env)) return {ok:false,skipped:true,error:'Discord bot not configured'};
  if(!channelId) return {ok:false,skipped:true,error:'Discord channel not configured'};
  return req(env,`/channels/${encodeURIComponent(String(channelId))}/messages`,{method:'POST',body:JSON.stringify({content:String(content).slice(0,1900)})});
}

export function discordConfigured(env){return configured(env)&&env.DISCORD_GUILD_ID&&env.DISCORD_WHITELIST_ROLE_ID}
