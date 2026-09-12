import {readSession,json} from '../../_lib/auth.js';
export async function onRequestGet({request,env}){
  if(!env.DB)return json({error:'Database not configured'},503);
  const user=await readSession(request,env);if(!user)return json({authenticated:false},401);
  const r=await env.DB.prepare('SELECT id,character_name,status,review_reason,created_at,updated_at,reviewed_at FROM applications WHERE discord_id=? ORDER BY created_at DESC LIMIT 20').bind(user.id).all();
  return json({authenticated:true,user,applications:r.results||[]});
}
