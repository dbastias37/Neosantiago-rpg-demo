// New contracts use scarce payouts. Existing contracts keep their agreed terms.
const copy=x=>JSON.parse(JSON.stringify(x));
export const terms=m=>({reward:copy(m.reward),late_step_minutes:m.late_step_minutes,late_penalty:m.late_penalty});
export function prepareEconomy(d){
 d.previousTerms=Object.fromEntries(Object.entries(d.missions).map(([id,m])=>[id,terms(m)]));
 const rewards={'relevo-01':8,'romero-01':12,'morales-01':14,'ana-01':10,'beatriz-01':14,'guzman-01':20,'jimenez-01':20,'adasme-01':24};
 for(const [id,base]of Object.entries(rewards)){d.missions[id].reward={base,stealth_bonus:id==='adasme-01'?12:0};d.missions[id].late_penalty=1;}
 return d;
}
export function restoreTerms(d,w){
 const restore=(r,id)=>{
  if(!r||!d.missions[id])return;
  r.rewardTerms??=copy(r.corridorVersion===1&&d.legacyMissions[id]?terms(d.legacyMissions[id]):d.previousTerms[id]);
  const t=r.rewardTerms;
  if(!t.reward||!Number.isInteger(t.reward.base)||t.reward.base<0||!Number.isInteger(t.reward.stealth_bonus)||t.reward.stealth_bonus<0||!Number.isInteger(t.late_step_minutes)||t.late_step_minutes<=0||!Number.isInteger(t.late_penalty)||t.late_penalty<0)throw Error('Condiciones de pago inválidas.');
  if(r.checkpoint?.snapshot){r.checkpoint.snapshot.rewardTerms??=copy(t);restore(r.checkpoint.snapshot,id);}
 };
 restore(w.run,w.run?.mission);
 for(const [id,r]of Object.entries(w.completed||{}))if(r.rewardTerms)restore(r,id);
 return w;
}
