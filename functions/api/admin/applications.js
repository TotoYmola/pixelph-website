import {readSession,isAdmin,json} from '../../_lib/auth.js';
async function requireAdmin(request,env){
  const user=await readSession(request,env);
  if(!isAdmin(env,user)) return {error:json({error:'Staff access required.'},403)};
  return {user};
}

export async function onRequestGet({request,env}){
  const auth=await requireAdmin(request,env);
  if(auth.error)return auth.error;
  if(!env.DB)return json({error:'Database not configured'},503);
  const r=await env.DB.prepare("SELECT * FROM applications ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, created_at DESC LIMIT 250").all();
  return json({applications:r.results||[]});
}
