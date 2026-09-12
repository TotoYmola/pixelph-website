import {readSession,isAdmin,json} from '../../_lib/auth.js';
import {getChannel,sendChannelMessage} from '../../_lib/discord.js';

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

  const channel=await getChannel(env,STAFF_CHANNEL_ID);
  if(!channel.ok){
    return json({
      ok:false,
      phase:'channel_lookup',
      channel_id:STAFF_CHANNEL_ID,
      discord_status:channel.status??null,
      discord_error:channel.error||'Channel lookup failed',
      discord_body:channel.body??null,
      discord_raw:channel.raw??null
    },200);
  }

  const channelType=channel.body?.type;
  const channelName=channel.body?.name||null;
  // Discord text-capable common types: 0 guild text, 5 announcement, 10/11/12 threads.
  // Forum/media channels (15/16) require creating a thread/post rather than a plain message.
  if(channelType===15||channelType===16){
    return json({
      ok:false,
      phase:'channel_type',
      channel_id:STAFF_CHANNEL_ID,
      channel_name:channelName,
      channel_type:channelType,
      discord_status:400,
      discord_error:channelType===15?'Selected channel is a Forum channel. Use a normal Text channel for staff notifications.':'Selected channel is a Media channel. Use a normal Text channel for staff notifications.'
    },200);
  }

  const result=await sendChannelMessage(
    env,
    STAFF_CHANNEL_ID,
    `🧪 **PixelPH Staff Notification Test**\nStaff notification channel is connected successfully.\n\nTriggered by: **${auth.user.username}**\nAdmin: https://pixelph.com/admin`
  );

  return json({
    ok:Boolean(result.ok),
    phase:'message_send',
    channel_id:STAFF_CHANNEL_ID,
    channel_name:channelName,
    channel_type:channelType,
    discord_status:result.status??null,
    discord_error:result.error||null,
    discord_body:result.body??null,
    discord_raw:result.raw??null,
    skipped:Boolean(result.skipped)
  },200);
}
