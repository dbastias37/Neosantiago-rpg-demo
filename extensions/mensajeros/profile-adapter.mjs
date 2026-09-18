import * as E from './production.mjs';

// Exploration supplies the renderer and dialogs; the courier engine owns the save.
const host = parent.NeoCourierProfileHost;
if (!host) throw Error('Abre el equipo desde Encargos.');
const data = host.data, $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = path => new URL(path, import.meta.url).href;
const definition = id => data.crew.find(p => p.id === id);
const current = () => host.world();
const party = () => current().run?.status === 'active' ? current().run.party : current().crew;
const canLearn = () => !current().run || current().run.status !== 'active' || (!current().run.pending && E.here(data,current()).checkpoint);
let selected = 0, toastTimer;
const sounds = JSON.parse($('audioRoutes').textContent);
function script(path) {
  return new Promise((resolve,reject) => {
    const node = document.createElement('script'); node.src = new URL('../../'+path,import.meta.url).href;
    node.onload=resolve; node.onerror=()=>reject(Error('No se pudo cargar '+path)); document.body.append(node);
  });
}
function playSfx(id) {
  const routes = sounds?.[id], path = Array.isArray(routes) ? routes[0] : routes;
  if (!path) return;
  try { const audio=new Audio(new URL(path,document.baseURI).href);audio.volume=.22;audio.play().catch(()=>{}); } catch {}
}
function toast(message) {
  $('toast').textContent=message;$('toast').classList.remove('hidden');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.add('hidden'),3500);host.announce(message);
}
function sync() {
  window.state.party = party().map(p => ({...p,...{name:definition(p.id).name,role:definition(p.id).role},
    equipment:{...p.equipment,backpack:'courierPack'},categories:['firearm','melee'],
    hunger:current().run?.status==='active'?current().run.condition:100}));
  window.state.factionPoints=E.skillPoints(party()[selected]);
}
function refresh(index=selected,feedback) { selected=index;sync();window.renderProfile(index,feedback);host.refresh(); }
function transact(fn,...args) {return host.transact(fn,...args);}
function gear(id) {
  if(id==='courierPack')return {name:'Mochila de mensajero',desc:E.bagCapacity(data,party()[selected])+' espacios · aumenta con el nivel.',image:'../../items/packExpedition.webp',capacity:E.bagCapacity(data,party()[selected])};
  const d=data.items[id];return d?{...d,desc:d.description,category:d.weapon,stack:d.stack!==false,defense:d.armor}:null;
}
function assetImage(path,alt,cls='',width=590,height=885) {
  const id=path.split('/').pop().replace(/-loadout\.webp$|\.webp$/g,''),person=definition(id);
  return `<img src="${esc(person?asset(person.image):new URL(path,document.baseURI).href)}" alt="${esc(alt)}" class="${cls}" width="${width}" height="${height}" decoding="async">`;
}
Object.assign(window, {
  $,esc,gear,assetImage,toast,playSfx,state:{party:[],factionPoints:0,profileEnergyLabel:'Resistencia',profileMindLabel:'Estado',profilePointsLabel:'Puntos de habilidad',profilePointUnit:'PH',profilePointsNote:'Cada Mensajero gana un punto por nivel. Aprende habilidades en un punto de control.'},
  battleState:null,profileTab:'inventory',psychPanelExpanded:false,transferDraft:null,discardDraft:null,
  xpNeeded:()=>60,bagUsed:E.bagUsed,bagCapacity:p=>E.bagCapacity(data,p),bagFree:p=>E.bagCapacity(data,p)-E.bagUsed(p),
  canReceive:(p,id,qty)=>E.bagCapacity(data,p)-E.bagUsed(p)>=qty,
  repairCost:()=>0,gearDefense:p=>data.items[p.equipment.body]?.armor||0,psychDefenseBonus:()=>0,
  canEquip:(p,d)=>!!d?.slot,
  profileCanDiscard:(p,id)=>data.items[id]?.kind!=='cargo'&&data.items[id]?.discard!==false,
  profileItemUsable:(p,id)=>(data.items[id]?.kind==='medical'||id==='medkit')&&p.hp<p.maxHp,
  profileDisassembleAction:()=>'',
  psychState:p=>({name:p.hp<=0?'Agotado':p.hp<10?'Crítico':'Listo'}),
  psychPanelHtml(p) {
    const open=window.psychPanelExpanded;
    return `<aside class="psych-panel ${open?'expanded':'compact'}"><header><span>Especialidad</span><strong>${esc(definition(p.id).skill)}</strong><button class="psych-panel-toggle" data-psych-toggle aria-expanded="${open}" aria-label="${open?'Contraer':'Expandir'} especialidad">${open?'−':'+'}</button></header><div class="psych-panel-body"><p>${esc(definition(p.id).description)}</p><small>La resistencia pertenece al grupo y se recupera al descansar.</small></div></aside>`;
  },
  professionWorkshopHtml:()=>'<section class="workshop"><div class="workshop-head"><span><b>Suministros del refugio</b><small>Los Mensajeros no tienen una profesión de fabricación. Mara y el Armero venden suministros en Los Héroes.</small></span></div></section>',
  skillTrees:Object.fromEntries(data.crew.map(p=>[p.id,data.skillTrees[p.id].map(s=>({...s,desc:s.description,branch:definition(p.id).skill,tier:s.requires?2:1,cost:1}))])),
  hasSkill:(p,id)=>p.skills.includes(id),
  hasUnspentSkill:p=>E.skillPoints(p)>0&&data.skillTrees[p.id].some(s=>!p.skills.includes(s.id)&&(!s.requires||p.skills.includes(s.requires))),
  canUnlockSkill:(p,s)=>canLearn()&&E.skillPoints(p)>0&&!p.skills.includes(s.id)&&(!s.requires||p.skills.includes(s.requires)),
  skillRequirement(p,s){return p.skills.includes(s.id)?'Adquirida':s.requires&&!p.skills.includes(s.requires)?'Requiere '+data.skillTrees[p.id].find(n=>n.id===s.requires).name:!canLearn()?'Necesitas un punto de control':E.skillPoints(p)<1?'Sin puntos disponibles':'Disponible';},
  itemArt(id,alt,extra='',inspectable=false){
    const d=gear(id);if(!d)return `<span class="item-art empty-art ${extra}" aria-hidden="true">—</span>`;
    const attrs=inspectable?`data-item-detail="${id}" role="button" tabindex="0" aria-haspopup="dialog" aria-controls="itemDetailModal" aria-label="Ver ficha de ${esc(d.name)}"`:'';
    return `<span ${attrs} class="item-art ${extra}"><img src="${asset(d.image)}" alt="${esc(alt||d.name)}" width="256" height="256"></span>`;
  },
  equipBagItem(i,index) {const p=party()[i],entry=p.bag[index];if(entry&&transact(E.equip,p.id,entry.id)){refresh(i);playSfx('loadout-equip');}},
  useProfileItem(i,index) {const p=party()[i],entry=p.bag[index],hp=p.hp;if(entry&&transact(E.useItem,p.id,entry.id)){const next=party()[i];refresh(i,{kind:'hp',from:hp,to:next.hp,delta:next.hp-hp});playSfx('hp-medical-use');}},
  transferBagItem(from,index,to,qty) {
    const entry=party()[from]?.bag[index];if(!entry)return false;
    const ok=transact(E.transfer,party()[from].id,party()[to].id,entry.id,qty);
    if(ok){refresh(from);playSfx('loadout-transfer');}return ok;
  },
  confirmDiscardProfileItem() {
    const draft=window.discardDraft;if(!draft)return;const p=party()[draft.pIndex],entry=p?.bag[draft.bagIndex];
    if(entry&&transact(E.discardItem,p.id,entry.id,entry.qty)){window.closeDiscardModal();refresh(draft.pIndex);playSfx('ui-close-panel');}
  },
  unlockSkill(i,id){if(transact(E.learn,party()[i].id,id)){refresh(i);playSfx('ui-click');}},
  closeProfile(){window.closeItemDetails(false);window.closeTransferModal();window.closeDiscardModal();$('profileModal').classList.add('hidden');host.close();},
});
await script('profile-common.js?v=1');
await script('item-details.js?v=2');
// Keep the shared inspection dialogs, with facts from the actual courier catalog.
Object.assign(window, {
  itemPurpose:id=>gear(id).desc,
  itemFacts(id){const d=gear(id),facts=[];if(d.damage)facts.push(['Daño adicional','+'+d.damage]);if(d.ammo)facts.push(['Munición',gear(d.ammo).name]);if(d.defense)facts.push(['Defensa','+'+d.defense]);if(d.capacity)facts.push(['Capacidad',d.capacity+' espacios']);return facts.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');},
  itemPricesHtml(id){const offer=data.shop.find(o=>o.id===id);if(!offer)return '<p>Este objeto no se vende en los puestos del refugio.</p>';return `<table><caption>Precios del refugio</caption><thead><tr><th>Puesto</th><th>Comprar</th><th>Vender</th></tr></thead><tbody><tr><th>${offer.vendor==='mara'?'Mara':'El Armero'}</th><td>${E.price(data,current(),id)} fichas / ${offer.qty} ud.</td><td>${E.salePrice(data,id)} fichas / ud.</td></tr></tbody></table>`;},
  itemDisassemblyHtml:()=>'<p>Los Mensajeros no tienen una habilidad de desarme.</p>',
});
const sharedRender=window.renderProfile;
window.renderProfile=(i,feedback)=>{selected=i;sync();sharedRender(i,feedback);};
$('closeProfile').onclick=()=>window.closeProfile();$('closeTransfer').onclick=()=>window.closeTransferModal();
$('closeDiscard').onclick=$('cancelDiscard').onclick=()=>window.closeDiscardModal();$('confirmDiscard').onclick=()=>window.confirmDiscardProfileItem();
function back() {
  if(window.itemDetailState){window.closeItemDetails();return true;}
  if(window.discardDraft){window.closeDiscardModal();return true;}
  if(window.transferDraft){window.closeTransferModal();return true;}
  window.closeProfile();return true;
}
document.addEventListener('keydown',event=>{
  if(window.itemDetailsKeydown(event))return;
  if(event.key==='Escape'){event.preventDefault();back();return;}
  if(event.key!=='Tab')return;
  const modal=window.discardDraft?$('discardModal'):window.transferDraft?$('transferModal'):$('profileModal');
  const focusable=[...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),[tabindex="0"]')].filter(el=>!el.closest('.profile-pane:not(.active)'));
  const first=focusable[0],last=focusable.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
});
document.addEventListener('click',event=>{if(event.target.closest('button'))playSfx('ui-click');});
host.ready({message:toast,open(id){selected=Math.max(0,party().findIndex(p=>p.id===id));sync();window.openProfile(selected);playSfx('ui-open-panel');},back});
