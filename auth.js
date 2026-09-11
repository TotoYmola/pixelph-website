const te=new TextEncoder();
function b64u(bytes){let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function b64uText(s){return b64u(te.encode(s))}
function fromB64u(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return atob(s)}
async function hmac(secret,text){const key=await crypto.subtle.importKey('raw',te.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64u(new Uint8Array(await crypto.subtle.sign('HMAC',key,te.encode(text))))}
export async function makeSession(env,user){const payload={id:user.id,username:user.username,avatar:user.avatar||null,exp:Date.now()+7*86400000};const p=b64uText(JSON.stringify(payload));return `${p}.${await hmac(env.SESSION_SECRET,p)}`}
export async function readSession(request,env){try{const cookie=request.headers.get('cookie')||'';const m=cookie.match(/(?:^|;\s*)pixelph_session=([^;]+)/);if(!m)return null;const [p,sig]=decodeURIComponent(m[1]).split('.');if(!p||!sig||await hmac(env.SESSION_SECRET,p)!==sig)return null;const data=JSON.parse(fromB64u(p));if(!data.exp||data.exp<Date.now())return null;return data}catch{return null}}
export function sessionCookie(value,maxAge=604800){return `pixelph_session=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`}
export function clearSessionCookie(){return 'pixelph_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'}
export function isAdmin(env,user){if(!user)return false;return String(env.ADMIN_DISCORD_IDS||'').split(',').map(x=>x.trim()).filter(Boolean).includes(String(user.id))}
export function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json;charset=UTF-8','cache-control':'no-store',...headers}})}
