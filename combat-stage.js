/* Presentation only: one delegated click path survives combat -> loot. */
function stageSelectTarget(index){
 if(!battleState||battleState.busy)return;
 var e=battleState.enemies[index];if(!e)return;
 if(battleState.phase==='loot')battleState.lootTarget=index;
 else{if(e.hp<=0)return;battleState.target=index}
 renderBattle();
}
function stageActivateCard(side,index){
 if(!battleState||battleState.busy)return;
 if(side==='ally'){if(battleState.phase==='loot')selectLooter(index);return}
 if(battleState.phase==='loot'){battleState.lootTarget=index;beginLoot(index)}
 else stageSelectTarget(index);
}
(function(){
'use strict';
var shell=document.querySelector('.battle-shell'),arena=document.querySelector('.arena'),consolePanel=document.querySelector('.combat-console');
var stageLog=document.createElement('div');stageLog.id='stageLog';stageLog.setAttribute('role','log');stageLog.setAttribute('aria-live','polite');stageLog.setAttribute('aria-atomic','true');shell.insertBefore(stageLog,arena);
var advanceButton=document.createElement('button');advanceButton.id='stageAdvance';advanceButton.type='button';advanceButton.textContent='Avanzar';advanceButton.setAttribute('aria-keyshortcuts','Enter');stageLog.appendChild(advanceButton);
var logLines=document.createElement('div');logLines.id='stageLogLines';stageLog.appendChild(logLines);
var status=document.createElement('div');status.id='stageStatus';consolePanel.insertBefore(status,consolePanel.firstChild);
$('combatLog').setAttribute('aria-live','off');
$('itemsToggle').textContent='Inventario';$('itemsToggle').setAttribute('aria-controls','itemTray');$('itemsToggle').setAttribute('aria-expanded','false');
var inventoryTimer=null;$('itemsToggle').onclick=null;
$('itemsToggle').addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();if($('itemTray').classList.contains('hidden'))openItems();else closeItems()},true);
var closeInventory=document.createElement('button');closeInventory.type='button';closeInventory.className='action';closeInventory.id='closeStageInventory';closeInventory.textContent='Cerrar inventario';closeInventory.onclick=closeItems;
var rawItems=renderCombatItems;renderCombatItems=function(){rawItems.apply(this,arguments);$('itemTray').appendChild(closeInventory)};
function openItems(){clearTimeout(inventoryTimer);$('itemTray').classList.remove('hidden','inventory-closing');closeInventory.disabled=false;$('itemsToggle').setAttribute('aria-expanded','true')}
function closeItems(){if($('itemTray').classList.contains('hidden')||$('itemTray').classList.contains('inventory-closing'))return;clearTimeout(inventoryTimer);$('itemTray').classList.add('inventory-closing');closeInventory.disabled=true;$('itemsToggle').setAttribute('aria-expanded','false');inventoryTimer=setTimeout(function(){$('itemTray').classList.add('hidden');$('itemTray').classList.remove('inventory-closing');closeInventory.disabled=false;$('itemsToggle').focus()},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:320)}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('itemTray').classList.contains('hidden')){e.preventDefault();closeItems()}},true);
var selector=document.createElement('div');selector.id='stageTargets';selector.setAttribute('aria-label','Seleccionar objetivo');arena.parentNode.insertBefore(selector,consolePanel);
[['allyUnits','ally'],['enemyUnits','enemy']].forEach(function(pair){$(pair[0]).addEventListener('click',function(e){var card=e.target.closest('.unit');var group=$(pair[0]);if(!card||!group.contains(card))return;e.preventDefault();e.stopImmediatePropagation();stageActivateCard(pair[1],Array.from(group.children).indexOf(card))},true)});
var rawRender=renderBattle,rawEnd=endPlayerTurn,rawRecord=recordHp;
var endTurnTimer=null,pendingNarration=null,logExitTimers=[];
var visualBattle=null,seenLogs=0,lastDamage={ally:{},enemy:{}},notices={ally:{},enemy:{}},queue=[],logTimer=null,logUntil=0;
function logDuration(text){return Math.max(2600,Math.min(6500,1800+String(text).length*23))}
function fitLog(line){
 var log=stageLog,w=log.clientWidth||400,font=w<500?14:16;line.style.fontSize=font+'px';
 var needed=line.scrollHeight+54,base=Math.max(70,Math.min(112,innerHeight*.14));
 if(needed>innerHeight*.30){line.style.fontSize='12px';needed=line.scrollHeight+54}
 shell.style.setProperty('--log-height',Math.max(base,needed)+'px');
}
function showNextLog(){
 if(visualBattle!==battleState){resetPresentation();return}
 if(!queue.length){logTimer=null;logUntil=0;syncAdvance();return}
 var previous=logLines.lastElementChild;
 if(previous){previous.classList.remove('log-enter');previous.classList.add('log-exit');logExitTimers.push(setTimeout(function(){previous.remove()},750))}
 var text=queue.shift(),line=document.createElement('p');line.className='log-enter';line.textContent=text;logLines.appendChild(line);fitLog(line);
 var duration=logDuration(text);logUntil=Date.now()+duration;logTimer=setTimeout(showNextLog,duration);syncAdvance();
}
function enqueueLog(lines){
 // Keep each original engine entry intact. Never cut it by character count.
 lines.forEach(function(line){if(String(line).trim())queue.push(String(line))});if(queue.length&&!logTimer)showNextLog();
}
window.stageNarrationDelay=function(){return Math.max(2200,logUntil-Date.now()+queue.reduce(function(sum,text){return sum+logDuration(text)},0))};

function syncAdvance(){advanceButton.disabled=!(logTimer||queue.length||pendingNarration)}
window.stageWaitForNarration=function(next){
 clearTimeout(endTurnTimer);var current=battleState;
 pendingNarration=function(){if(battleState===current)next()};
 endTurnTimer=setTimeout(finishNarration,stageNarrationDelay());syncAdvance();
};
function finishNarration(){
 clearTimeout(endTurnTimer);endTurnTimer=null;
 var next=pendingNarration;pendingNarration=null;syncAdvance();if(next)next();
}
function advanceNarration(){
 if(!battleState||visualBattle!==battleState)return;
 clearTimeout(logTimer);logTimer=null;logUntil=0;
 // Remove fading entries so fast clicks never stack unreadable messages.
 logExitTimers.forEach(clearTimeout);logExitTimers=[];
 logLines.querySelectorAll('.log-exit').forEach(function(p){p.remove()});
 if(queue.length){if(logLines.lastElementChild)logLines.lastElementChild.remove();showNextLog();if(pendingNarration){clearTimeout(endTurnTimer);endTurnTimer=setTimeout(finishNarration,stageNarrationDelay())}}
 else{finishNarration();syncAdvance()}
}
advanceButton.onclick=advanceNarration;
document.addEventListener('keydown',function(e){
 if(e.key!=='Enter'||!battleState||$('battle').classList.contains('hidden'))return;
 if(e.target&&(e.target.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)))return;
 if(document.querySelector('.overlay[aria-modal="true"]:not(.hidden)')||!$('itemTray').classList.contains('hidden')||(typeof fieldSkillTray!=='undefined'&&!fieldSkillTray.classList.contains('hidden')))return;
 // Consume Enter even at the next decision: never activate a focused attack button.
 e.preventDefault();e.stopImmediatePropagation();if(!e.repeat&&!advanceButton.disabled)advanceNarration();
},true);

recordHp=function(side,index,from,to,max,sfx){if(battleState&&to!==from)lastDamage[side][index]={time:Date.now(),delta:to-from,critical:false};return rawRecord.apply(this,arguments)};
function reconcile(container,previous){Array.from(container.children).forEach(function(node,i){var old=previous[i];if(!old||old.tagName!==node.tagName)return;Array.from(old.attributes).forEach(function(a){if(a.name!=='style')old.removeAttribute(a.name)});Array.from(node.attributes).forEach(function(a){old.setAttribute(a.name,a.value)});if(old.innerHTML!==node.innerHTML)old.innerHTML=node.innerHTML;node.replaceWith(old)})}
function arrange(id,side,front){
 var container=$(id),nodes=Array.from(container.children),n=nodes.length,width=container.clientWidth,height=container.clientHeight;
 var cardHeight=Math.max(64,Math.min(280,height-12)),cardWidth=Math.max(74,Math.min(174,width*(width<240?.66:.47),cardHeight*.72));
 container.style.setProperty('--card-width',cardWidth+'px');container.style.setProperty('--card-height',cardHeight+'px');
 var radius=Math.max(12,(width-cardWidth)/2-8);
 nodes.forEach(function(node,i){node.onclick=null;var relative=front===null?i:(i-front+n)%n,angle=n===1?0:relative*2*Math.PI/n,focused=i===front;
 var x=n===2?(relative===0?0:radius):Math.sin(angle)*radius;
 var scale=focused?1:.82,rotation=focused?0:-Math.sin(angle)*24;
 node.style.transform='translateX(-50%) translate3d('+x+'px,0,'+(focused?0:-25)+'px) rotateY('+rotation+'deg) scale('+scale+')';
 node.style.zIndex=focused?20:Math.round(5+Math.cos(angle)*3);
 node.classList.toggle('stage-front',focused);node.classList.toggle('stage-rear',!focused);node.classList.toggle('stage-ally',side==='ally');node.classList.toggle('stage-enemy',side==='enemy');
 var info=node.querySelector('.unit-info>small');if(side==='ally'&&info)info.textContent='Lvl. '+state.party[i].level+' · '+state.party[i].role;
 var marker=document.createElement('span');marker.className='stage-marker';marker.setAttribute('aria-hidden','true');marker.textContent=side==='ally'?(battleState.phase==='loot'?'SAQUEA':'TURNO'):(battleState.enemyActing===i?'ATACA':battleState.phase==='loot'?'LOOT':'OBJETIVO');node.appendChild(marker);
 var hit=lastDamage[side][i];if(hit&&hit.delta<0&&Date.now()-hit.time<700)node.classList.add(hit.critical?'stage-critical':'stage-hit');else node.classList.remove('stage-hit','stage-critical');
 var notice=notices[side][i];if(notice&&Date.now()-notice.time<2800){var badge=document.createElement('span');badge.className='stage-notice '+notice.kind;badge.textContent=notice.text;badge.setAttribute('role','status');node.appendChild(badge)}
 });
}
function statusCard(p,label,enemy,looting){
 if(!p)return '';var hp=Math.max(0,p.hp),xp=enemy?'':'<div class="stage-meter"><span>XP</span><div class="bar xp"><span style="width:'+Math.min(100,100*p.xp/xpNeeded(p))+'%"></span></div><b>'+p.xp+'/'+xpNeeded(p)+'</b></div>';
 var cargo='';if(looting&&!enemy){var used=bagUsed(p),cap=bagCapacity(p);cargo='<div class="stage-meter cargo"><span>Carga</span><div class="bar bag"><span style="width:'+Math.min(100,100*used/cap)+'%"></span></div><b>'+used+'/'+cap+'</b></div><small class="cargo-free">'+bagFree(p)+' espacios libres</small>'}
 return '<section class="stage-status-card '+(enemy?'hostile':'')+'"><div><strong>'+esc(p.name)+'</strong><span>'+esc(label)+(enemy?'':' · Lvl. '+p.level)+'</span></div>'+(looting&&!enemy?cargo:'<div class="stage-meter"><span>HP</span><div class="bar"><span style="width:'+(100*hp/p.maxHp)+'%"></span></div><b>'+hp+'/'+p.maxHp+'</b></div>'+xp)+'</section>';
}
renderBattle=function(){
 if(!battleState)return;var b=battleState;
 if(visualBattle!==b){clearTimeout(endTurnTimer);pendingNarration=null;visualBattle=b;seenLogs=0;logLines.innerHTML='';queue=[];clearTimeout(logTimer);logTimer=null;logUntil=0;lastDamage={ally:{},enemy:{}};notices={ally:{},enemy:{}}}
 var oldAllies=Array.from($('allyUnits').children),oldEnemies=Array.from($('enemyUnits').children);
 b.criticalFeedback.forEach(function(f){if(lastDamage.enemy[f.index])lastDamage.enemy[f.index].critical=true});
 if(b.allyCritical!==undefined&&b.allyCritical!==null){if(lastDamage.ally[b.allyCritical])lastDamage.ally[b.allyCritical].critical=true;b.allyCritical=null}
 (b.visualNotices||[]).forEach(function(n){notices[n.side][n.index]={time:Date.now(),kind:n.kind,text:n.text}});b.visualNotices=[];
 rawRender();reconcile($('allyUnits'),oldAllies);reconcile($('enemyUnits'),oldEnemies);
 var enemyTurn=b.enemyActing!==undefined&&b.enemyActing!==null,looting=b.phase==='loot';
 if(looting&&b.lootTarget==null)b.lootTarget=Math.max(0,b.enemies.findIndex(function(e){return !e.looted}));
 var allyIndex=looting?b.looter:enemyTurn?null:b.actor,enemyIndex=enemyTurn?b.enemyActing:looting?b.lootTarget:b.target;
 shell.classList.toggle('stage-looting',looting);
 status.innerHTML=statusCard(state.party[allyIndex],looting?'Saqueador':'En turno',false,looting)+statusCard(b.enemies[enemyIndex],enemyTurn?'Atacando':looting?'Cuerpo seleccionado':'Objetivo',true,looting);
 if(looting&&allyIndex===null)status.insertAdjacentHTML('afterbegin','<section class="stage-status-card"><strong>Elige quién saquea</strong><span>Presiona una tarjeta aliada.</span></section>');
 $('turnLabel').textContent=enemyTurn?'Ataca '+b.enemies[enemyIndex].name:looting?(allyIndex===null?'Elige quién saquea':'Saquea '+state.party[allyIndex].name):'Turno de '+state.party[b.actor].name;
 if(looting)$('lootInstruction').textContent='Selecciona un cuerpo por su nombre. Presiona su tarjeta para saquear.';
 $('itemsToggle').setAttribute('aria-expanded',String(!$('itemTray').classList.contains('hidden')));
 selector.innerHTML=b.enemies.map(function(e,i){return '<button type="button" data-stage-target="'+i+'" '+((!looting&&e.hp<=0)||b.busy?'disabled':'')+' aria-pressed="'+(i===enemyIndex)+'">'+(i+1)+' · '+esc(e.name)+'</button>'}).join('');
 selector.querySelectorAll('button').forEach(function(button){button.onclick=function(){stageSelectTarget(Number(button.dataset.stageTarget))}});
 arrange('allyUnits','ally',allyIndex);arrange('enemyUnits','enemy',enemyIndex);
 enqueueLog(b.log.slice(seenLogs));seenLogs=b.log.length;
};
endPlayerTurn=function(){if(!battleState)return;var current=battleState;current.busy=true;renderBattle();stageWaitForNarration(function(){if(battleState!==current)return;current.busy=false;rawEnd()})};
// A campaign has many encounters in one page; discard presentation callbacks on exit.
function resetPresentation(){
 clearTimeout(logTimer);clearTimeout(endTurnTimer);clearTimeout(inventoryTimer);
 logExitTimers.forEach(clearTimeout);logExitTimers=[];logTimer=null;endTurnTimer=null;inventoryTimer=null;
 pendingNarration=null;queue=[];logUntil=0;seenLogs=0;visualBattle=null;logLines.innerHTML='';status.innerHTML='';selector.innerHTML='';
 shell.style.removeProperty('--log-height');shell.classList.remove('stage-looting');
 $('itemTray').classList.add('hidden');$('itemTray').classList.remove('inventory-closing');
 closeInventory.disabled=false;$('itemsToggle').setAttribute('aria-expanded','false');syncAdvance();
}
window.resetCombatPresentation=resetPresentation;
window.addEventListener('resize',function(){if(logLines.lastElementChild)fitLog(logLines.lastElementChild);if(battleState)renderBattle()});
})();
