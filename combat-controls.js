/* Shared battle input for Exploración and Encargos. Engines own the actions. */
(function(){
'use strict';
if(typeof window.resetCombatPresentation!=='function')return;
var attack=document.querySelector('[data-action="attack"]'),consolePanel=document.querySelector('.combat-console');
var panel=document.createElement('div');panel.id='attackTray';panel.className='attack-tray hidden';panel.setAttribute('aria-label','Ataques disponibles');
panel.innerHTML='<strong>Selecciona un ataque</strong><button type="button" id="basicAttack">Ataque normal</button>';
panel.appendChild($('tacticsTray'));
var close=document.createElement('button');close.id='closeAttackTray';close.type='button';close.textContent='Cerrar ataques';panel.appendChild(close);consolePanel.appendChild(panel);
attack.setAttribute('data-sfx','ui-click');attack.setAttribute('aria-controls','attackTray');attack.setAttribute('aria-expanded','false');
var selectedKey=null,previousBattle=null,previousTurn=null,resetPending=true;
function visible(el){return !!el&&!el.disabled&&!el.closest('.hidden,[inert]')}
function hideAttacks(){panel.classList.add('hidden');attack.setAttribute('aria-expanded','false')}
function scope(){
 var overlay=document.querySelector('#itemDetailModal:not(.hidden),#disassemblyModal:not(.hidden)')||document.querySelector('#lootModal:not(.hidden)');
 if(overlay)return Array.from(overlay.querySelectorAll('button')).filter(visible);
 var skills=$('fieldSkillTray');
 if(skills&&!skills.classList.contains('hidden'))return Array.from(skills.querySelectorAll('button')).filter(visible);
 if(!$('itemTray').classList.contains('hidden'))return Array.from($('itemTray').querySelectorAll('button')).filter(visible);
 if(!panel.classList.contains('hidden'))return Array.from(panel.querySelectorAll('button')).filter(visible);
 if(battleState.phase==='loot')return Array.from(document.querySelectorAll('[data-battle-card],#finishLoot')).filter(visible);
 return Array.from(document.querySelectorAll('#turnControls .actions button,#stageTargets button')).filter(visible);
}
function key(el,nodes){
 if(el.id)return '#'+el.id;
 for(var name of ['data-action','data-tactic','data-courier-choice','data-stage-target','data-battle-card','data-field-active'])if(el.hasAttribute(name))return name+':'+el.getAttribute(name);
 return 'index:'+nodes.indexOf(el);
}
function mark(el,focus){
 document.querySelectorAll('.battle-selected').forEach(function(n){n.classList.remove('battle-selected')});
 if(!el)return;selectedKey=key(el,scope());el.classList.add('battle-selected');
 if(focus){el.focus({preventScroll:true});if(el.scrollIntoView&&el.closest('#attackTray,#itemTray,#fieldSkillTray,#lootModal'))el.scrollIntoView({block:'nearest',inline:'nearest'})}
}
function selectCurrent(focus){
 if(!battleState||battleState.busy||$('battle').classList.contains('hidden'))return;
 var nodes=scope(),selected=nodes.find(function(n){return key(n,nodes)===selectedKey})||nodes[0];mark(selected,focus);return selected;
}
window.closeBattleAttackMenu=hideAttacks;
window.openBattleAttackMenu=function(){
 if(!battleState||battleState.busy||battleState.phase!=='combat')return;
 if(!panel.classList.contains('hidden')){hideAttacks();mark(attack,true);return}
 $('itemTray').classList.add('hidden');$('itemsToggle').setAttribute('aria-expanded','false');
 if($('fieldSkillTray'))$('fieldSkillTray').classList.add('hidden');
 if(typeof renderBattleTactics==='function')renderBattleTactics();
 if(typeof weaponSfxForActor==='function')$('basicAttack').setAttribute('data-sfx',weaponSfxForActor());
 panel.classList.remove('hidden');attack.setAttribute('aria-expanded','true');mark($('basicAttack'),true);
};
close.onclick=function(){hideAttacks();mark(attack,true)};
$('basicAttack').onclick=function(){
 if(!battleState||battleState.busy)return;hideAttacks();
 if(typeof window.stageBasicAttack==='function')window.stageBasicAttack();else combatAction('attack');
};
var render=window.renderBattle;
window.renderBattle=function(){
 render.apply(this,arguments);var b=battleState;if(!b)return;
 var turn=b.actor+':'+b.round+':'+b.phase,changed=b!==previousBattle||turn!==previousTurn;
 previousBattle=b;previousTurn=turn;
 if(b.busy){resetPending=true;hideAttacks();mark(null,false);return}
 if(b.phase==='loot'){
  ['ally','enemy'].forEach(function(side){Array.from($(side==='ally'?'allyUnits':'enemyUnits').children).forEach(function(card,i){
   card.setAttribute('data-battle-card',side+':'+i);card.setAttribute('role','button');card.setAttribute('tabindex','0');
   if(side==='ally'&&state.party[i].hp<=0){card.removeAttribute('data-battle-card');card.setAttribute('tabindex','-1')}
  })});
 }
 if(changed||resetPending){hideAttacks();selectedKey=b.phase==='combat'?'data-action:attack':null;resetPending=false;selectCurrent(true)}else selectCurrent(false);
};
var reset=window.resetCombatPresentation;
window.resetCombatPresentation=function(){hideAttacks();mark(null,false);previousBattle=null;previousTurn=null;selectedKey=null;resetPending=true;return reset.apply(this,arguments)};
document.addEventListener('click',function(e){
 if(!battleState)return;var button=e.target.closest&&e.target.closest('button');
 if(button&&button!==attack&&button.closest('#turnControls .actions'))hideAttacks();
},true);
document.addEventListener('focusin',function(e){if(battleState&&!battleState.busy&&scope().includes(e.target))mark(e.target,false)});
document.addEventListener('keydown',function(e){
 if(!battleState||$('battle').classList.contains('hidden')||$('battle').hasAttribute('inert')||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.target&&(e.target.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)))return;
 var directions={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'up',w:'up',ArrowDown:'down',s:'down'},direction=directions[e.key]||directions[e.key.toLowerCase()];
 if(e.key==='Escape'&&!panel.classList.contains('hidden')){e.preventDefault();e.stopImmediatePropagation();close.onclick();return}
 if(!direction&&e.key!=='Enter')return;
 if(battleState.busy){if(direction){e.preventDefault();e.stopImmediatePropagation()}return}
 e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
 var nodes=scope(),current=nodes.find(function(n){return n===document.activeElement})||nodes.find(function(n){return key(n,nodes)===selectedKey})||nodes[0];if(!current)return;
 if(e.key==='Enter'){current.click();selectCurrent(true);return}
 var box=current.getBoundingClientRect(),cx=box.left+box.width/2,cy=box.top+box.height/2;
 var vertical=direction==='up'||direction==='down',sign=direction==='up'||direction==='left'?-1:1;
 var candidates=nodes.filter(function(n){return n!==current}).map(function(n){var r=n.getBoundingClientRect(),dx=r.left+r.width/2-cx,dy=r.top+r.height/2-cy;return{node:n,along:(vertical?dy:dx)*sign,across:Math.abs(vertical?dx:dy)}}).filter(function(n){return n.along>2}).sort(function(a,b){return (a.along+a.across*3)-(b.along+b.across*3)});
 var next=candidates.length?candidates[0].node:nodes[(nodes.indexOf(current)+sign+nodes.length)%nodes.length];mark(next,true);
},true);
})();
