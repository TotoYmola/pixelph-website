const API='https://discord.com/api/v10';
function configured(env){return Boolean(env.DISCORD_BOT_TOKEN)}
async function req(env,path,opts={}){
  if(!configured(env)) return {ok:false,skipped:true,error:'Discord bot not configured'};
  const r=await fetch(API+path,{...opts,headers:{authorization:`Bot ${env.DISCORD_BOT_TOKEN}`,'content-type':'application/json',...(opts.headers||{})}});
  let body=null; try{body=await r.json()}catch{}
  return {ok:r.ok,status:r.status,body,error:r.ok?null:(body?.message||`Discord API ${r.status}`)};
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
export function discordConfigured(env){return configured(env)&&env.DISCORD_GUILD_ID&&env.DISCORD_WHITELIST_ROLE_ID}
