import {readSession,json} from '../../_lib/auth.js';

const PACKAGES={
  city_priority:{name:'City Priority',category:'priority',queue_weight:200,reserved:false},
  prime_access:{name:'Prime Access',category:'priority',queue_weight:500,reserved:true},
  business_patron:{name:'Business Patron',category:'supporter'},
  signature_look:{name:'Signature Look',category:'cosmetic'},
  signature_vehicle:{name:'Signature Vehicle',category:'cosmetic'},
  signature_ped:{name:'Signature Ped',category:'cosmetic'}
};

export async function onRequestGet({request,env}){
  if(!env.DB)return json({error:'Database not configured'},503);
  const user=await readSession(request,env);
  if(!user)return json({authenticated:false},401);
  try{
    const now=new Date().toISOString();
    const result=await env.DB.prepare(`
      SELECT id,package_key,status,starts_at,expires_at,metadata_json,granted_by,created_at,updated_at
      FROM membership_entitlements
      WHERE discord_id=?
      ORDER BY created_at DESC
      LIMIT 50
    `).bind(user.id).all();
    const history=(result.results||[]).map(row=>({
      ...row,
      package:PACKAGES[row.package_key]||{name:row.package_key,category:'other'},
      metadata:(()=>{try{return row.metadata_json?JSON.parse(row.metadata_json):null}catch{return null}})(),
      is_active:row.status==='active'&&(!row.starts_at||row.starts_at<=now)&&(!row.expires_at||row.expires_at>now)
    }));
    const active=history.filter(x=>x.is_active);
    return json({authenticated:true,user,active,history,packages:PACKAGES});
  }catch(err){
    const msg=String(err?.message||err||'');
    if(msg.includes('no such table'))return json({authenticated:true,user,active:[],history:[],packages:PACKAGES,setup_required:true});
    return json({error:'Unable to load membership',detail:msg},500);
  }
}
