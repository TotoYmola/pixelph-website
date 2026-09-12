import {readSession,isAdmin,json} from '../../_lib/auth.js';
import {sendChannelMessage} from '../../_lib/discord.js';

const STAFF_CHANNEL_ID='1548176627446321172';

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

export async function onRequestPost({request,env}){
  const auth=await requireAdmin(request,env);
  if(auth.error)return auth.error;
  let body={};
  try{body=await request.json()}catch{}
  if(body.action!=='test_staff_notify')return json({error:'Unknown admin action.'},400);

  const result=await sendChannelMessage(
    env,
    STAFF_CHANNEL_ID,
    `🧪 **PixelPH Staff Notification Test**\nStaff notification channel is connected successfully.\n\nTriggered by: **${auth.user.username}**\nAdmin: https://pixelph.com/admin`
  );

  return json({
    ok:Boolean(result.ok),
    channel_id:STAFF_CHANNEL_ID,
    discord_status:result.status||null,
    discord_error:result.error||null,
    discord_body:result.body||null,
    skipped:Boolean(result.skipped)
  },result.ok?200:502);
}
