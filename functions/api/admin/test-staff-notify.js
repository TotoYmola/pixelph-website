import {readSession,json,isAdmin} from '../../_lib/auth.js';
import {sendChannelMessage} from '../../_lib/discord.js';

export async function onRequestPost({request,env}){
  const user=await readSession(request,env);
  if(!isAdmin(env,user)) return json({error:'Staff access required.'},403);

  const channelId='1548176627446321172';
  const result=await sendChannelMessage(env,channelId,
    `🧪 **PixelPH Staff Notification Test**\nTriggered by **${user.username||user.id}**.\nIf you can read this, the whitelist bot can post new-application alerts in this channel.`
  );

  return json({
    ok:result.ok,
    channel_id:channelId,
    discord_status:result.status||null,
    discord_error:result.error||null,
    discord_body:result.body||null,
    skipped:Boolean(result.skipped)
  }, result.ok?200:502);
}
