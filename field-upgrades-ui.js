/* Inline SVG symbols and CSS details: no raster card assets or external fonts. */
var fieldPaths={
 triple:'M12 48V20l5-9 5 9v28zm15 0V20l5-9 5 9v28zm15 0V20l5-9 5 9v28M12 39h10m5 0h10m5 0h10',
 sweep:'M13 47l10-18m9 18V19m19 28L41 29M18 29h5v5m4-15h10m4 10h5v5M9 52h46',
 sight:'M32 8v12m0 24v12M8 32h12m24 0h12M48 32a16 16 0 1 1-32 0 16 16 0 0 1 32 0M29 32h6m-3-3v6',
 breach:'M14 12h36v40H14zm21 0-9 17 12 5-10 18M7 32h7m36 0h7',
 opener:'M32 12l7 12v28H25V24zm-7 30h14M11 18l6 5m36-5-6 5M10 35h7m30 0h7',
 knife:'M39 8l8 8-20 23-7-7zm-23 23 14 14M12 48l9-9m-12 12 5 5 10-10',
 cover:'M12 15h40v22L32 55 12 37zm9 18h22M25 24h14M25 42h14',
 arc:'M35 7 24 27h12l-7 14M26 38 16 48m22-10 10 10M20 52a5 5 0 1 1-10 0 5 5 0 0 1 10 0m34 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
 capacitor:'M19 15h26v39H19zm8-6h10v6M34 23l-7 12h10l-7 12',
 plate:'M32 8 51 16v20L32 55 13 36V16zm0 9-11 5v11l11 11 11-11V22z',
 pulse:'M8 33h12l6-16 11 31 7-15h12M9 15h6m-3-3v6',
 shared:'M26 10h12v16h16v12H38v16H26V38H10V26h16zM44 46h12m-6-6v12'
};
function fieldIcon(d){return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter"><path d="'+fieldPaths[d.icon]+'"/></svg>'}
var fieldMode='offer',fieldOpener=null,fieldOfferTimer=null,fieldDetailId=null,fieldPinned=false,fieldHovered=null,fieldHoverBlocked=null,fieldDeferredSignal=null;
var fieldSkillTray=document.createElement('div');fieldSkillTray.id='fieldSkillTray';fieldSkillTray.className='hidden';fieldSkillTray.setAttribute('aria-label','Habilidades disponibles');document.querySelector('.combat-console').appendChild(fieldSkillTray);
document.querySelector('.nav').appendChild($('fieldCollection'));
function fieldVisible(){return !$('fieldModal').classList.contains('hidden')}
function fieldSafe(){return gameSessionActive&&state.introCompleted&&!state.finished&&!pending&&!battleState&&!encounterSaveLocked&&!state.refuge.active&&!document.querySelector('.overlay:not(.hidden),.drawer:not(.hidden),.title-screen:not(.hidden)')}
function fieldScheduleOffer(){
 $('fieldCount').textContent=fieldStore().selected.length+'/4';$('fieldCollection').classList.toggle('hidden',!gameSessionActive);
 clearTimeout(fieldOfferTimer);fieldOfferTimer=setTimeout(function(){fieldOfferTimer=null;fieldMaybeOffer()},0);
}
function fieldMaybeOffer(){if(fieldVisible())return true;if(!fieldSafe()||!fieldDue())return false;if(!fieldPrepareOffer())return false;fieldOpen('offer');return true}
function fieldOpen(mode,owner){
 if(battleState&&battleState.busy)return;
 fieldMode=mode;fieldOpener=document.activeElement;fieldDetailId=null;fieldPinned=false;fieldHovered=null;
 $('fieldTitle').textContent=mode==='offer'?'Mejoras de campo':'Mejoras equipadas';
 $('fieldStory').textContent=mode==='offer'?'El grupo reúne piezas, circuitos y material de curación recuperados durante la expedición. Hay suficiente para preparar una mejora. Tú decides cómo aprovecharlo.':'Estas mejoras acompañan al grupo hasta el final de la partida.';
 $('fieldInstruction').textContent=mode==='offer'?'Elección '+(fieldStore().selected.length+1)+' de 4 · Elige una carta y su portador.':'Toca un símbolo para consultar sus efectos y límites.';
 $('fieldClose').classList.toggle('hidden',mode==='offer');$('fieldMessage').textContent='';
 var entries=mode==='offer'?fieldStore().offer.ids.map(function(id){return {id:id}}):fieldStore().selected.filter(function(x){return !owner||x.owner===owner});
 $('fieldCards').innerHTML=entries.length?entries.map(fieldCardHtml).join(''):'<p class="field-empty">Todavía no hay mejoras. La primera elección llega tras una victoria o al avanzar tres situaciones.</p>';
 $('fieldCards').classList.toggle('field-cards-owned',mode!=='offer');$('fieldModal').classList.remove('hidden');$('fieldModal').focus();
}
function fieldCardHtml(entry){
 var d=fieldById[entry.id],owned=fieldMode!=='offer',members=owned?state.party.filter(function(p){return p.id===entry.owner}):fieldEligible(d),tone=d.category==='Armamento'?'amber':d.category==='Protección'?'steel':'cyan';
 return '<article class="field-card '+tone+'" data-field-card="'+d.id+'"><p class="field-class">'+esc(d.category)+'</p><div class="field-card-body"><div class="field-front"><button class="field-symbol" type="button" data-field-detail="'+d.id+'" aria-label="Ver detalles de '+esc(d.name)+'" aria-expanded="false" aria-controls="field-detail-'+d.id+'">'+fieldIcon(d)+'</button><h3>'+esc(d.name)+'</h3><p>'+esc(d.summary)+'</p><strong class="field-buff">'+esc(d.buff)+'</strong><button class="field-details-link" type="button" data-field-detail="'+d.id+'" aria-expanded="false" aria-controls="field-detail-'+d.id+'">Ver detalles</button></div><div class="field-detail" id="field-detail-'+d.id+'" inert aria-hidden="true"><button type="button" class="field-x" data-field-close-detail="'+d.id+'" aria-label="Volver al símbolo de '+esc(d.name)+'">×</button><h3>'+esc(d.name)+'</h3><h4>Cómo funciona</h4><p>'+esc(d.detail)+'</p><h4>Coste y límite</h4><p>'+esc(d.limit)+'</p><small>Disponible hasta el final de esta partida.</small></div></div><div class="field-card-footer">'+(owned?'<p class="field-owner">'+esc(members[0].name)+' · Equipada</p>':'<label class="field-owner">Portador<select aria-label="Portador de '+esc(d.name)+'" data-field-owner="'+d.id+'">'+members.map(function(p){return '<option value="'+p.id+'">'+esc(p.name)+'</option>'}).join('')+'</select></label><button type="button" class="field-choose" data-field-choose="'+d.id+'">Elegir</button>')+'</div></article>';
}
function fieldSetDetail(id,open,pinned){
 var card=$('fieldCards').querySelector('[data-field-card="'+id+'"]');if(!card)return;
 if(open&&fieldDetailId&&fieldDetailId!==id)fieldSetDetail(fieldDetailId,false,false);
 fieldHoverBlocked=open?null:id;card.classList.toggle('is-detailed',open);var detail=card.querySelector('.field-detail'),front=card.querySelector('.field-front');
 detail.setAttribute('aria-hidden',String(!open));front.setAttribute('aria-hidden',String(open));
 if(open){detail.removeAttribute('inert');front.setAttribute('inert','')}else{detail.setAttribute('inert','');front.removeAttribute('inert')}
 card.querySelectorAll('[data-field-detail]').forEach(function(b){b.setAttribute('aria-expanded',String(open))});
 fieldDetailId=open?id:null;fieldPinned=!!(open&&pinned);
 if(open&&pinned)detail.querySelector('button').focus();
}
function fieldClose(){if(fieldMode==='offer')return false;$('fieldModal').classList.add('hidden');fieldDetailId=null;signalLastTick=Date.now();fieldResumeSignal();if(fieldOpener&&fieldOpener.isConnected)fieldOpener.focus();return true}
function fieldBack(){if(fieldDetailId){var id=fieldDetailId;fieldSetDetail(id,false,false);var b=$('fieldCards').querySelector('[data-field-detail="'+id+'"]');if(b)b.focus();return true}return fieldClose()}
function fieldResetUI(){clearTimeout(fieldOfferTimer);fieldOfferTimer=null;$('fieldModal').classList.add('hidden');fieldDetailId=null;fieldOpener=null;fieldDeferredSignal=null;fieldCloseSkills();$('fieldCollection').classList.add('hidden')}
function fieldCloseSkills(){var open=!fieldSkillTray.classList.contains('hidden');fieldSkillTray.classList.add('hidden');var b=document.querySelector('[data-action="skill"]');b.setAttribute('aria-expanded','false');return open}
function fieldOpenSkills(){
 var p=battleState&&state.party[battleState.actor];if(!p||battleState.busy||battleState.phase!=='combat')return;
 $('itemTray').classList.add('hidden');$('itemsToggle').setAttribute('aria-expanded','false');
 fieldSkillTray.innerHTML='<strong>Habilidades de '+esc(p.name)+'</strong><button type="button" data-field-base '+(battleState.skillUsed[battleState.actor]?'disabled':'')+'>'+({sara:'Atención médica',elias:'Intervención técnica',noa:'Disparo preciso'}[p.id])+'<small>'+(battleState.skillUsed[battleState.actor]?'Usada en este combate':'Habilidad original · 1 uso por combate')+'</small></button>'+fieldOwned(p).filter(function(d){return d.active}).map(function(d){var why=fieldActiveReason(d.id,p);return '<button type="button" data-field-active="'+d.id+'" '+(why?'disabled':'')+'>'+fieldIcon(d)+'<span>'+esc(d.name)+'<small>'+esc(why||d.buff+' · 1 uso por combate')+'</small></span></button>'}).join('')+'<button type="button" data-field-skills-close>Cerrar habilidades</button>';
 fieldSkillTray.classList.remove('hidden');document.querySelector('[data-action="skill"]').setAttribute('aria-expanded','true');fieldSkillTray.querySelector('button:not([disabled])').focus();
}
function fieldRenderCombat(){
 fieldCloseSkills();if(!battleState)return;
 $('allyUnits').querySelectorAll('.unit').forEach(function(card,i){var p=state.party[i],defs=fieldOwned(p);if(!defs.length)return;var badges=document.createElement('div');badges.className='field-badges';badges.innerHTML=defs.map(function(d){return '<button type="button" data-field-view="'+p.id+'" '+(battleState.busy?'disabled':'')+' aria-label="'+esc(d.name)+' de '+p.name+'">'+fieldIcon(d)+'</button>'}).join('');card.querySelector('.unit-info').appendChild(badges)});
}
var fieldRenderBattleBase=renderBattle;renderBattle=function(){fieldRenderBattleBase();fieldRenderCombat()};
$('fieldCollection').addEventListener('click',function(){if(!fieldMaybeOffer())fieldOpen('owned')});
$('fieldClose').addEventListener('click',fieldClose);
$('fieldCards').addEventListener('click',function(e){
 var b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.fieldDetail)fieldSetDetail(b.dataset.fieldDetail,true,true);
 if(b.dataset.fieldCloseDetail){var id=b.dataset.fieldCloseDetail;fieldSetDetail(id,false,false);$('fieldCards').querySelector('[data-field-detail="'+id+'"]').focus()}
 if(b.dataset.fieldChoose){var id=b.dataset.fieldChoose,select=$('fieldCards').querySelector('[data-field-owner="'+id+'"]');if(fieldMode==='offer'&&fieldSelect(id,select.value)){$('fieldModal').classList.add('hidden');signalLastTick=Date.now();playSfx('ui-click');toast(fieldById[id].name+' equipada');fieldResumeSignal();render();var next=$('choices').querySelector('button:not([disabled])');if(next)next.focus()}else $('fieldMessage').textContent='No se puede asignar esta mejora a ese portador.'}
});
$('fieldCards').addEventListener('pointerover',function(e){if(!window.matchMedia('(hover: hover)').matches||fieldPinned)return;var b=e.target.closest('[data-field-detail]');if(b&&b.dataset.fieldDetail!==fieldHoverBlocked){fieldHovered=b.dataset.fieldDetail;fieldSetDetail(fieldHovered,true,false)}});
$('fieldCards').addEventListener('pointerout',function(e){var card=e.target.closest('[data-field-card]');if(card&&!card.contains(e.relatedTarget)){if(!fieldPinned&&fieldDetailId===card.dataset.fieldCard){fieldSetDetail(fieldDetailId,false,false);fieldHovered=null}fieldHoverBlocked=null}});
document.addEventListener('click',function(e){
 var badge=e.target.closest&&e.target.closest('[data-field-view]');if(badge){e.preventDefault();e.stopImmediatePropagation();if(!badge.disabled)fieldOpen('owned',badge.dataset.fieldView);return}
 var skill=e.target.closest&&e.target.closest('[data-action="skill"]');if(skill&&battleState&&fieldHasActive(state.party[battleState.actor])){e.preventDefault();e.stopImmediatePropagation();if(!skill.disabled){if(!fieldCloseSkills())fieldOpenSkills()}return}
 if(e.target.closest&&e.target.closest('[data-action],#itemsToggle'))fieldCloseSkills();
},true);
fieldSkillTray.addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;if(b.hasAttribute('data-field-base')){fieldCloseSkills();combatAction('skill')}else if(b.dataset.fieldActive)fieldActivate(b.dataset.fieldActive);else if(b.hasAttribute('data-field-skills-close')){fieldCloseSkills();document.querySelector('[data-action="skill"]').focus()}});
document.addEventListener('keydown',function(e){
 if(fieldVisible()){
  e.stopImmediatePropagation();if(e.key==='Escape'){e.preventDefault();fieldBack();return}
  if(e.key==='Enter'&&e.repeat){e.preventDefault();return}
  if(e.key==='Tab'){
   var nodes=Array.from($('fieldModal').querySelectorAll('button:not([disabled]),select')).filter(function(n){return !n.closest('.hidden,[inert]')});var first=nodes[0],last=nodes[nodes.length-1];
   if(!nodes.length){e.preventDefault();return}
   if(!nodes.includes(document.activeElement)||e.shiftKey&&document.activeElement===first||!e.shiftKey&&document.activeElement===last){e.preventDefault();(e.shiftKey?last:first).focus()}
  }
 }else if(e.key==='Escape'&&fieldCloseSkills()){e.preventDefault();e.stopImmediatePropagation();document.querySelector('[data-action="skill"]').focus()}
},true);
fieldScheduleOffer();

var fieldSignalBase=openSignalHack;
openSignalHack=function(source){if(fieldVisible()){fieldDeferredSignal=source;return}return fieldSignalBase.apply(this,arguments)};
function fieldResumeSignal(){if(fieldDeferredSignal!==null){var source=fieldDeferredSignal;fieldDeferredSignal=null;openSignalHack(source)}}
