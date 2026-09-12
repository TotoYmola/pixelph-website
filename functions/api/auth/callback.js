import {makeSession,sessionCookie} from '../../_lib/auth.js';
export async function onRequestGet({request,env}){
  const url=new URL(request.url),code=url.searchParams.get('code'),state=url.searchParams.get('state')||'';
  const [intent,nonce]=state.split('.'); const cookie=request.headers.get('cookie')||''; const m=cookie.match(/(?:^|;\s*)pixelph_oauth=([^;]+)/);
  if(!code||!nonce||!m||m[1]!==nonce)return new Response('Invalid OAuth state.',{status:400});
  const redirect=`${url.origin}/api/auth/callback`;
  const tokenRes=await fetch('https://discord.com/api/oauth2/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.DISCORD_CLIENT_ID,client_secret:env.DISCORD_CLIENT_SECRET,grant_type:'authorization_code',code,redirect_uri:redirect})});
  if(!tokenRes.ok)return new Response('Discord login failed.',{status:502});
  const token=await tokenRes.json(); const meRes=await fetch('https://discord.com/api/users/@me',{headers:{authorization:`Bearer ${token.access_token}`}}); if(!meRes.ok)return new Response('Discord profile lookup failed.',{status:502});
  const me=await meRes.json(); const session=await makeSession(env,me);
  return new Response(null,{status:302,headers:{location:intent==='admin'?'/admin':'/pages/whitelist.html','set-cookie':sessionCookie(session)}})
}
