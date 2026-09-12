import {readSession,isAdmin,json} from '../../../_lib/auth.js';
import {setWhitelistRole,sendDm} from '../../../_lib/discord.js';

export async function onRequestPost({request,env,params}){
  const user=await readSession(request,env);
  if(!isAdmin(env,user))return json({error:'Staff access required.'},403);
  if(!env.DB)return json({error:'Database not configured'},503);
  let b;try{b=await request.json()}catch{return json({error:'Invalid request'},400)}
  if(!['approved','rejected','revoked'].includes(b.status))return json({error:'Invalid status'},400);
  const reason=String(b.reason||'').trim();
  if((b.status==='rejected'||b.status==='revoked')&&!reason)return json({error:b.status==='revoked'?'Revocation reason required':'Rejection reason required'},400);
  const app=await env.DB.prepare('SELECT * FROM applications WHERE id=?').bind(params.id).first();
  if(!app)return json({error:'Application not found'},404);

  const now=new Date().toISOString();
  const result=await env.DB.prepare('UPDATE applications SET status=?,review_reason=?,reviewed_by=?,reviewed_at=?,updated_at=? WHERE id=?')
    .bind(b.status,reason,user.id,now,now,params.id).run();
  if(!result.success)return json({error:'Update failed'},500);

  const warnings=[];
  const role=await setWhitelistRole(env,app.discord_id,b.status==='approved');
  if(!role.ok&&!role.skipped)warnings.push(`Discord role sync failed: ${role.error}`);
  else if(role.skipped)warnings.push(role.error);

  const dmText=b.status==='approved'
    ? `✅ **PixelPH Whitelist Approved**\nYour application for **${app.character_name}** has been approved.\n\nCity address: \`play.pixelph.com:30120\`\nWebsite: https://pixelph.com\n\nWelcome to PixelPH.`
    : b.status==='revoked'
      ? `🚫 **PixelPH Whitelist Revoked**\nYour whitelist for **${app.character_name}** has been revoked by staff.\n\n**Reason:** ${reason}\n\nYou will no longer be able to join PixelPH while this status is active.\nWebsite: https://pixelph.com`
      : `❌ **PixelPH Whitelist Application Update**\nYour application for **${app.character_name}** was not approved.\n\n**Reason:** ${reason}\n\nYou can review your status at https://pixelph.com/pages/whitelist.html`;
  const dm=await sendDm(env,app.discord_id,dmText);
  if(!dm.ok&&!dm.skipped)warnings.push(`Discord DM failed: ${dm.error}`);
  else if(dm.skipped&&!warnings.includes(dm.error))warnings.push(dm.error);

  return json({
    ok:true,
    status:b.status,
    warnings,
    discord:{
      role:{ok:Boolean(role.ok),skipped:Boolean(role.skipped),status:role.status||null,error:role.error||null,body:role.body||null},
      dm:{ok:Boolean(dm.ok),skipped:Boolean(dm.skipped),status:dm.status||null,error:dm.error||null,body:dm.body||null}
    }
  });
}


export async function onRequestDelete({request,env,params}){
  const user=await readSession(request,env);
  if(!isAdmin(env,user))return json({error:'Staff access required.'},403);
  if(!env.DB)return json({error:'Database not configured'},503);
  const app=await env.DB.prepare('SELECT * FROM applications WHERE id=?').bind(params.id).first();
  if(!app)return json({error:'Application not found'},404);

  // Always remove the whitelist role before resetting the application.
  const role=await setWhitelistRole(env,app.discord_id,false);
  const result=await env.DB.prepare('DELETE FROM applications WHERE id=?').bind(params.id).run();
  if(!result.success)return json({error:'Delete failed'},500);

  const dm=await sendDm(env,app.discord_id,`🗑️ **PixelPH Whitelist Application Reset**\nYour whitelist application for **${app.character_name}** was reset by staff.\n\nYou may submit a new application at https://pixelph.com/pages/whitelist.html`);
  return json({ok:true,deleted:true,discord:{role:{ok:Boolean(role.ok),skipped:Boolean(role.skipped),status:role.status||null,error:role.error||null},dm:{ok:Boolean(dm.ok),skipped:Boolean(dm.skipped),status:dm.status||null,error:dm.error||null}}});
}
