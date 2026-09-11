export async function onRequestGet({request,env}){
  if(!env.DISCORD_CLIENT_ID||!env.DISCORD_CLIENT_SECRET||!env.SESSION_SECRET)return new Response('Discord OAuth is not configured.',{status:503});
  const url=new URL(request.url), intent=url.searchParams.get('admin')==='1'?'admin':'apply';
  const nonce=crypto.randomUUID();
  const redirect=`${url.origin}/api/auth/callback`;
  const q=new URLSearchParams({client_id:env.DISCORD_CLIENT_ID,response_type:'code',redirect_uri:redirect,scope:'identify',state:`${intent}.${nonce}`,prompt:'none'});
  return new Response(null,{status:302,headers:{location:`https://discord.com/oauth2/authorize?${q}`,'set-cookie':`pixelph_oauth=${nonce}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`}})
}
