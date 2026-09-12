/* Shared generated WebP illustrations; card text and controls remain accessible HTML. */
function fieldIcon(d){return '<img class="field-art" src="assets/upgrades/'+d.icon+'.webp?v=1" width="512" height="512" alt="" aria-hidden="true" decoding="async">'}
var fieldMode='offer',fieldOpener=null,fieldOfferTimer=null,fieldDetailId=null,fieldPinned=false,fieldHovered=null,fieldHoverBlocked=null,fieldDeferredSignal=null,fieldDeferredWarning=null;
var fieldSkillTray=document.createElement('div');fieldSkillTray.id='fieldSkillTray';fieldSkillTray.className='hidden';fieldSkillTray.setAttribute('aria-label','Habilidades disponibles');document.querySelector('.combat-console').appendChild(fieldSkillTray);
document.querySelector('.nav').appendChild($('fieldCollection'));
function fieldVisible(){return !$('fieldModal').classList.contains('hidden')}
function fieldSafe(){return gameSessionActive&&state.introCompleted&&!state.finished&&!pending&&!battleState&&!encounterSaveLocked&&!state.refuge.active&&!document.querySelector('.overlay:not(.hidden),.drawer:not(.hidden),.title-screen:not(.hidden)')}
function fieldScheduleOffer(){
 $('fieldCount').textContent=fieldStore().selected.length+'/4';$('fieldCollection').classList.toggle('hidden',!gameSessionActive||(!fieldStore().victories&&!fieldStore().selected.length));
 clearTimeout(fieldOfferTimer);fieldOfferTimer=setTimeout(function(){fieldOfferTimer=null;fieldMaybeOffer()},0);
}
function fieldMaybeOffer(){
 if(fieldVisible())return true;if(!fieldSafe())return false;
 if(!fieldDue()){if(fieldStore().progressNotice){toast(fieldStore().progressNotice);fieldStore().progressNotice='';save()}return false}
 if(!fieldPrepareOffer())return false;fieldShowReward();return true;
}
function fieldShowReward(){
 fieldMode='reward';fieldOpener=document.activeElement;fieldDetailId=null;fieldPinned=false;
 $('fieldTitle').textContent='Has ganado una mejora';
 $('fieldStory').textContent='Combate ganado. Al asegurar la zona, el grupo recuperó material útil para mejorar su equipo.';
 $('fieldInstruction').textContent='Recompensa de victoria · Mejora '+(fieldStore().selected.length+1)+' de 4';
 $('fieldClose').classList.add('hidden');$('fieldMessage').textContent='';$('fieldCards').classList.remove('field-cards-owned');
 var tutorial=!fieldStore().tutorialSeen;
 $('fieldCards').innerHTML='<div class="field-reward"><div class="field-reward-symbol">'+fieldIcon(fieldById.plate)+'</div><h3>Material recuperado</h3><p>Con estas piezas puedes preparar <strong>una de tres mejoras</strong> para un aliado.</p>'+(tutorial?'<div class="field-tutorial-steps"><p><b>1 · Revisa las cartas</b>Toca el símbolo para conocer el efecto y sus límites.</p><p><b>2 · Elige un portador</b>Asigna la mejora a Sara, Elías o Noa, según su compatibilidad.</p><p><b>3 · Equipa una mejora</b>Las pasivas funcionan solas. Las activas se usan desde Habilidad durante el combate.</p></div>':'')+'<p class="field-reward-rule">La conservarás hasta el final de esta partida. Después de elegir, ganar otros dos combates te dará una nueva mejora, hasta completar cuatro.</p><button class="field-choose" type="button" data-field-reward-next>Ver mis tres opciones</button></div>';
 fieldStore().progressNotice='';save();$('fieldModal').classList.remove('hidden');$('fieldCards').querySelector('button').focus();
}
function fieldShowEquipped(id,owner){
 var d=fieldById[id],p=state.party.find(function(p){return p.id===owner});fieldMode='equipped';fieldDetailId=null;
 $('fieldTitle').textContent='Mejora equipada';$('fieldStory').textContent=p.name+' conserva '+d.name+' hasta el final de esta partida.';
 $('fieldInstruction').textContent=fieldProgressText();$('fieldMessage').textContent='';$('fieldClose').classList.add('hidden');
 $('fieldCards').innerHTML='<div class="field-reward"><div class="field-reward-symbol">'+fieldIcon(d)+'</div><h3>'+esc(d.name)+' · '+esc(p.name)+'</h3><strong class="field-buff">'+esc(d.buff)+'</strong><p>'+esc(d.active?'Cuando sea el turno de '+p.name+', abre Habilidad y selecciona '+d.name+'.':'Se activa automáticamente. '+d.detail)+'</p><p>'+esc(d.limit)+'</p><p>Podrás consultarla desde Mejoras o desde el icono bajo el personaje en combate.</p><button class="field-choose" type="button" data-field-equipped-done>Volver a la expedición</button></div>';
 $('fieldCards').querySelector('button').focus();
}

function fieldOpen(mode,owner){
 if(battleState&&battleState.busy)return;
 fieldMode=mode;fieldOpener=document.activeElement;fieldDetailId=null;fieldPinned=false;fieldHovered=null;
 $('fieldTitle').textContent=mode==='offer'?'Mejoras de campo':'Mejoras equipadas';
 $('fieldStory').textContent=mode==='offer'?'Recompensa del combate ganado: elige cómo aprovechar el material recuperado.':'Estas mejoras acompañan al grupo hasta el final de la partida.';
 $('fieldInstruction').textContent=mode==='offer'?'Elección '+(fieldStore().selected.length+1)+' de 4 · Elige una carta y su portador.':fieldProgressText()+' · Toca un símbolo para consultar sus efectos.';
 $('fieldClose').classList.toggle('hidden',mode==='offer');$('fieldMessage').textContent='';
 var entries=mode==='offer'?fieldStore().offer.ids.map(function(id){return {id:id}}):fieldStore().selected.filter(function(x){return !owner||x.owner===owner});
 $('fieldCards').innerHTML=entries.length?entries.map(fieldCardHtml).join(''):'<p class="field-empty">Todavía no hay mejoras. Gana tu primer combate para recuperar material y obtener tu primera mejora.</p>';
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
function fieldClose(){if(fieldMode==='offer'||fieldMode==='reward')return false;$('fieldModal').classList.add('hidden');fieldDetailId=null;signalLastTick=Date.now();fieldResumeSignal();fieldScheduleOffer();if(fieldOpener&&fieldOpener.isConnected)fieldOpener.focus();return true}
function fieldBack(){if(fieldDetailId){var id=fieldDetailId;fieldSetDetail(id,false,false);var b=$('fieldCards').querySelector('[data-field-detail="'+id+'"]');if(b)b.focus();return true}return fieldClose()}
function fieldResetUI(){clearTimeout(fieldOfferTimer);fieldOfferTimer=null;$('fieldModal').classList.add('hidden');fieldDetailId=null;fieldOpener=null;fieldDeferredSignal=null;fieldDeferredWarning=null;fieldCloseSkills();$('fieldCollection').classList.add('hidden')}
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
 if(b.hasAttribute('data-field-reward-next')){fieldStore().tutorialSeen=true;save();fieldOpen('offer');return}
 if(b.hasAttribute('data-field-equipped-done')){fieldClose();render();return}
 if(b.dataset.fieldDetail)fieldSetDetail(b.dataset.fieldDetail,true,true);
 if(b.dataset.fieldCloseDetail){var id=b.dataset.fieldCloseDetail;fieldSetDetail(id,false,false);$('fieldCards').querySelector('[data-field-detail="'+id+'"]').focus()}
 if(b.dataset.fieldChoose){var id=b.dataset.fieldChoose,select=$('fieldCards').querySelector('[data-field-owner="'+id+'"]');if(fieldMode==='offer'&&fieldSelect(id,select.value)){signalLastTick=Date.now();playSfx('ui-click');fieldShowEquipped(id,select.value)}else $('fieldMessage').textContent='No se puede asignar esta mejora a ese portador.'}
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
var fieldWarningBase=openSignalWarning;
openSignalWarning=function(mode){if(fieldVisible()){fieldDeferredWarning=mode;return}return fieldWarningBase.apply(this,arguments)};
function fieldResumeSignal(){if(fieldDeferredWarning!==null){var mode=fieldDeferredWarning;fieldDeferredWarning=null;openSignalWarning(mode);return}if(fieldDeferredSignal!==null){var source=fieldDeferredSignal;fieldDeferredSignal=null;openSignalHack(source)}}
