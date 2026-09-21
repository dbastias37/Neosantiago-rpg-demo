const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let missions=[],selected='relevo-01',filter='all';
let variant=new URL(location.href).searchParams.get('variante')==='b'?'b':'a';
const portraits=m=>`<img src="${esc(m.portrait)}" alt="${esc(m.issuer)}" decoding="async">`;
const filters=()=>`<div class="filters" role="group" aria-label="Filtrar encargos">${[['all','Todos'],['centro','Centro'],['norte','Norte']].map(([id,label])=>`<button data-filter="${id}" aria-pressed="${filter===id}">${label}</button>`).join('')}</div>`;
const visible=()=>missions.filter(m=>filter==='all'||(filter==='norte'?m.id==='beatriz-01':m.id!=='beatriz-01'));
const shellLabel=()=>'<div class="case-label"><b>LOS MENSAJEROS / RED DE REFUGIOS</b><span class="live">REGISTRO LOCAL</span></div>';
function facts(m){return `<dl class="facts"><div><dt>Recorrido</dt><dd>${m.legs} <small>tramos</small></dd></div><div><dt>Plazo al aceptar</dt><dd>${m.limit} <small>min</small></dd></div><div><dt>Recompensa</dt><dd>${m.reward} <small>Créditos</small></dd></div></dl>`;}
function content(m,titleId){return `<article class="document"><div class="hero">${portraits(m)}<div><span class="eyebrow">${esc(m.issuer)}</span><h2 id="${titleId}" tabindex="-1">${esc(m.name)}</h2><p class="destination">Destino: ${esc(m.recipient)}</p><span class="file-number">ENCARGO / ${m.number} · RED INTERIOR</span></div></div><p class="introduction">${esc(m.introduction)}</p><span class="eyebrow statement-label">LO QUE NECESITA ${esc(m.issuer)}</span><p class="statement">«${esc(m.briefing)}»</p>${facts(m)}<section class="cargo"><h3 class="eyebrow">${m.pickup?'CARGA QUE DEBES RECOGER':'CARGA DEL ENCARGO'}</h3>${m.cargo.map(i=>`<div class="cargo-item"><img src="${esc(i.image)}" alt=""><span>${esc(i.name)}</span><b>×${i.qty}</b></div>`).join('')}</section><details class="conditions"><summary>Plazo y efecto de la entrega</summary><p>Después del plazo, cada ${m.lateStep} minutos se descuenta ${m.latePenalty} Crédito, hasta la mitad del pago. Combatir, descansar, desviarse y saquear consumen tiempo; leer o cerrar el juego no.</p><p>${esc(m.effect)}</p></details></article>`;}
function actions(m,back=false){return `<div class="document-actions">${back?'<button data-close="detail" class="back">Volver</button>':''}<button data-route="${m.id}" aria-haspopup="dialog">Revisar ruta</button><button data-accept="${m.id}" class="primary" aria-haspopup="dialog">Elegir este encargo</button></div>`;}
function render(){
 document.body.dataset.variant=variant;
 document.querySelectorAll('.lab-toolbar [data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.variant===variant)));
 $('description').textContent=variant==='a'?'A · Bandas compactas y una ficha que se abre al elegir un encargo.':'B · Índice de contactos al costado y un expediente siempre a la vista.';
 const list=variant==='b'?missions:visible();if(!list.some(m=>m.id===selected))selected=list[0]?.id;
 if(variant==='a'){
  $('stage').innerHTML=`<section class="housing">${shellLabel()}<div class="registry"><header class="registry-heading"><div><span class="eyebrow">CENTRAL DE ENCARGOS</span><h1>Trabajo pendiente</h1><p>Elige a quién ayudar. Revisa la carga antes de salir.</p></div><div class="registry-count">${String(list.length).padStart(2,'0')}<small>EN EL REGISTRO</small></div></header>${filters()}<div class="list-head" aria-hidden="true"><span>Solicitante / encargo</span><span>Recorrido</span><span>Pago</span></div><div class="offer-list">${list.map(m=>`<button class="offer-row" data-offer="${m.id}" aria-haspopup="dialog">${portraits(m)}<span class="offer-copy"><span class="eyebrow">${esc(m.issuer)}</span><strong>${esc(m.name)}</strong><small>${esc(m.origin)} → ${esc(m.destination)}</small></span><span class="offer-stat">${m.legs} <small>tramos · ${m.limit} min</small></span><span class="offer-stat reward">${m.reward}<small>Créditos</small></span><span class="arrow" aria-hidden="true">›</span></button>`).join('')}</div><footer class="registry-bottom"><span>Selecciona un encargo para abrir su ficha.</span><span>RED INTERIOR / 2130</span></footer></div></section>`;
 }else{
  const m=missions.find(m=>m.id===selected);
  $('stage').innerHTML=`<section class="housing dossier-housing">${shellLabel()}<div class="dossier-layout"><aside class="contact-index"><span class="eyebrow">RED DE ENCARGOS</span><h1>El siguiente<br>recorrido</h1><p>Solicitudes de los refugios.</p><nav class="index-list" aria-label="Seleccionar expediente">${list.map(x=>`<button class="index-card" data-offer="${x.id}" aria-pressed="${x.id===selected}">${portraits(x)}<span><strong>${esc(x.name)}</strong><small>${esc(x.issuer)}</small></span></button>`).join('')}</nav><div class="index-bottom">${String(list.length).padStart(2,'0')} SOLICITUDES<br>LOS MENSAJEROS · 2130</div></aside><section class="dossier-reading" aria-label="Expediente seleccionado"><div class="document-topline"><span>EXPEDIENTE ${m.number} / SOLICITUD</span><span class="tag">POR ASIGNAR</span></div>${content(m,'selectedTitle')}${actions(m)}</section></div></section>`;
 }
}
function showDetail(id){selected=id;const m=missions.find(m=>m.id===id);if(!m)return;
 if(variant==='b'){render();$('selectedTitle').focus({preventScroll:true});return;}
 $('detailContent').innerHTML=`<header class="dialog-bar"><span>ENCARGO / ${esc(m.issuer)}</span><button class="close" data-close="detail" aria-label="Cerrar encargo">×</button></header>${content(m,'detailTitle')}${actions(m,true)}`;
 $('detail').showModal();$('detail').scrollTop=0;$('detailTitle').focus({preventScroll:true});
}
function showRoute(id){const m=missions.find(m=>m.id===id);if(!m)return;$('routeContent').innerHTML=`<header class="dialog-bar"><span>ITINERARIO / ${m.number}</span><button class="close" data-close="route" aria-label="Cerrar ruta">×</button></header><div class="route-body"><span class="eyebrow">${esc(m.issuer)}</span><h2 id="routeTitle" tabindex="-1">${esc(m.name)}</h2><p>${m.legs} tramos · Plazo de ${m.limit} minutos al aceptar.</p><ol class="route-list">${m.route.map((name,i)=>`<li><b>${String(i+1).padStart(2,'0')}</b><span>${esc(name)}</span></li>`).join('')}</ol></div><div class="document-actions"><button data-close="route" class="primary">Volver al encargo</button></div>`;$('route').showModal();$('routeTitle').focus({preventScroll:true});}
document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.dataset.variant){variant=b.dataset.variant;for(const d of document.querySelectorAll('dialog[open]'))d.close();const u=new URL(location.href);u.searchParams.set('variante',variant);history.replaceState(null,'',u);render();}
 if(b.dataset.filter){filter=b.dataset.filter;render();document.querySelector(`[data-filter="${filter}"]`)?.focus({preventScroll:true});}
 if(b.dataset.offer)showDetail(b.dataset.offer);
 if(b.dataset.route)showRoute(b.dataset.route);
 if(b.dataset.close)$(b.dataset.close).close();
 if(b.dataset.accept){const m=missions.find(m=>m.id===b.dataset.accept);$('confirmationText').textContent=`Has elegido «${m.name}», solicitado por ${m.issuer}.`;$('confirmation').showModal();}
 if(b.id==='device'){const on=$('preview').classList.toggle('mobile');document.body.dataset.device=on?'mobile':'desktop';b.setAttribute('aria-pressed',String(on));b.textContent=on?'Vista escritorio':'Vista móvil';}
});
try{const response=await fetch(new URL('./data.json',import.meta.url));if(!response.ok)throw Error('No se pudo cargar el registro.');missions=await response.json();render();}catch(error){$('stage').innerHTML='<p class="loading" role="alert">No se pudo abrir el registro. Recarga la página para intentarlo otra vez.</p>';console.error(error);}
