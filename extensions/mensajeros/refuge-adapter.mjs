import * as E from './production.mjs';
const host=parent.NeoCourierRefugeHost;
if(!host)throw Error('Abre el refugio desde Encargos.');
const data=host.data,$=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=p=>new URL(p,import.meta.url).href;
let vendor='mara',recipient=data.crew[0].id;
const party=()=>host.world().run?.status==='active'?host.world().run.party:host.world().crew;
const name=id=>data.crew.find(c=>c.id===id).name;
function art(id){const i=data.items[id];return `<span class="item-art small"><img src="${asset(i.image)}" alt="${esc(i.name)}"></span>`;}
function card(id,qty,member,selling){
 const w=host.world(),i=data.items[id],price=selling?E.salePrice(data,id):E.price(data,w,id);
 return `<article class="trade-card ${i.kind==='weapon'?'weapon-offer':''}">${art(id)}<span><b>${esc(i.name)}${qty>1?' ×'+qty:''}</b><small>${selling?esc(name(member))+' · entrega 1 unidad':esc(i.description)}</small></span><em>${selling?'+':'−'}${price} fichas</em><button data-${selling?'sell':'buy'}="${id}" data-member="${member}" ${!selling&&w.credits<price?'disabled':''}>${selling?'Entregar':vendor==='armorer'?'Encargar':'Recibir'}</button></article>`;
}
function render(){
 const w=host.world();if(!E.atHeroes(data,w)){host.close();return;}
 const arm=vendor==='armorer';
 $('refuge').classList.remove('hidden');$('refugeTitle').textContent='Refugio Los Héroes';
 $('refugeText').textContent='Prepara a los Mensajeros para volver a los túneles.';
 $('traderPortrait').src=asset(arm?'../../characters/armero-trader.webp':'../../characters/mara-trader.webp');
 $('traderPortrait').alt=arm?'Bruno, el Armero':'Mara, la Comerciante';
 $('traderName').textContent=arm?'Bruno, el Armero':'Mara, la Comerciante';
 $('traderRole').textContent=arm?'Armero de túnel · taller del refugio':'Intercambista del Andén 4';
 $('traderDialogue').textContent=arm?'“Nada de esto salió entero de una fábrica. Yo elijo lo que todavía sirve y vuelvo a darle propósito.”':'“Yo cambio objetos, no milagros. Descansen, repartan medicina y elijan qué vale más.”';
 if(!arm&&w.paid.includes('morales-01')&&w.completed['morales-01']?.provisional===false)$('traderDialogue').textContent='«Morales dejó una copia de su informe para Noa. Está junto al plano. Ahora revisen sus mochilas: si necesitan algo para el próximo encargo, vemos qué queda.»';
 if(!arm&&w.effects.includes('guzman-01'))$('traderDialogue').textContent='«Ana mandó aviso: ya pudieron relevar al guardia de Plaza. Les dejó un banco y comida para cuando pasen. Aprovechen de descansar allá si lo necesitan; no hace falta que gasten otra ración de la mochila.»';
 if(!arm&&E.returnStatus(w)?.stage==='followup')$('traderDialogue').textContent='«El relevo de Vicuña dejó una respuesta de Darío para ustedes. Pueden leerla en el registro de su regreso, junto al encargo.»';
 for(const [id,active]of [['npcTabMara',!arm],['npcTabArmorer',arm]]){$(id).classList.toggle('active',active);$(id).setAttribute('aria-selected',String(active));}
 $('tradeCredits').textContent=w.credits+' fichas';$('tradeSectionTitle').textContent=arm?'Armas reconstruidas':'Compra y venta';
 $('tradeSectionHint').textContent='Destino de compras: '+name(recipient);
 $('tradeSellTitle').textContent=arm?'Armas y piezas recuperadas':'Tu loot';$('tradeBuyTitle').textContent=arm?'Banco del Armero':'Reservas de Mara';$('tradeBuyAction').textContent=arm?'Encargar':'Recibir';
 $('refugeParty').innerHTML=party().map(c=>`<button class="refuge-ally ${c.hp<10?'critical':''}" data-member-select="${c.id}" aria-pressed="${c.id===recipient}"><span class="refuge-ally-photo"><img src="${asset(data.crew.find(d=>d.id===c.id).image)}" alt="${esc(name(c.id))}"></span><span><b>${esc(name(c.id))}</b><small>Nv. ${c.level} · ${c.hp}/${c.maxHp} HP · Mochila ${E.bagUsed(c)}/${E.bagCapacity(data,c)}</small></span><em>${c.id===recipient?'Recibe compras':'Seleccionar'}</em></button>`).join('');
 const sells=party().flatMap(c=>c.bag.filter(x=>arm?['weapon','armor','material'].includes(data.items[x.id].kind):!['weapon','armor','cargo'].includes(data.items[x.id].kind)).map(x=>card(x.id,x.qty,c.id,true)));
 $('tradeSellList').innerHTML=sells.join('')||'<p class="empty">No llevas objetos que este comerciante compre.</p>';
 $('tradeBuyList').innerHTML=data.shop.filter(x=>x.vendor===vendor).map(x=>card(x.id,x.qty,recipient,false)).join('');
 $('refugeRest').textContent='Recuperar grupo · 8 fichas';$('refugeRest').disabled=w.credits<8||party().every(c=>c.hp===c.maxHp);
 $('refugeLeaveHint').textContent='Selecciona quién recibe las compras. Abre su ficha para equipar o transferir objetos.';
}
function message(text){$('refugeMessage').textContent=text;$('refugeMessage').classList.remove('hidden');}
function transact(fn,...args){if(host.transact(fn,...args)){render();message('Intercambio realizado.');}else message(host.error());}
$('starterKit').remove();$('refugeActivities').remove();$('worldNewsEntry')?.remove();
$('refugeRejoin').textContent='Gestionar equipo';$('refugeRejoin').onclick=()=>host.profile(recipient);
$('refugeParty').previousElementSibling.querySelector('small').textContent='Selecciona quién recibe las compras';
$('npcTabMara').onclick=()=>{vendor='mara';render();};$('npcTabArmorer').onclick=()=>{vendor='armorer';render();};
$('refugeRest').onclick=()=>{if(host.transact(E.recover)){render();message('El grupo recuperó su salud.');}else message(host.error());};
$('leaveRefuge').textContent='Volver al mapa';$('leaveRefuge').onclick=()=>host.close();
$('refugeEconomyHelp').onclick=()=>{$('refugeHelpTitle').textContent='Intercambios en Los Héroes';$('refugeHelpText').textContent='Entrega objetos de las mochilas para recibir fichas. Selecciona a un Mensajero antes de comprar: recibirá los suministros si tiene espacio.';$('refugeHelpTip').textContent='La carga de un encargo no se vende. El equipo se gestiona desde sus fichas.';$('refugeHelpModal').classList.remove('hidden');$('refuge').inert=true;$('refugeHelpContinue').focus();};
function back(){if(!$('refugeHelpModal').classList.contains('hidden')){$('refugeHelpModal').classList.add('hidden');$('refuge').inert=false;$('refugeEconomyHelp').focus();}else host.close();return true;}
$('refugeHelpContinue').onclick=back;
document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();back();}});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.memberSelect){recipient=b.dataset.memberSelect;render();}if(b.dataset.buy)transact(E.buy,b.dataset.buy,b.dataset.member);if(b.dataset.sell)transact(E.sell,b.dataset.sell,b.dataset.member);});
host.ready({open(){render();$('leaveRefuge').focus();},refresh:render,back});
