/* Run-scoped field upgrades. No metaprogression and no changes to story RNG. */
var fieldDefs = [
 {id:'triple',name:'Gatillo triple',category:'Armamento',icon:'triple',gun:true,active:true,summary:'Concentra una ráfaga sobre un enemigo.',buff:'3 disparos en un turno',detail:'Realiza hasta tres disparos contra el mismo enemigo. Cada uno tiene su propia tirada y causa el 55% del daño normal. La ráfaga termina si el objetivo cae.',limit:'Una vez por combate. Necesita 3 balas; solo consume las que dispara.'},
 {id:'sweep',name:'Barrido táctico',category:'Armamento',icon:'sweep',gun:true,active:true,summary:'Reparte el fuego entre varios enemigos.',buff:'Hasta 3 objetivos · 65% de daño',detail:'Dispara primero al objetivo seleccionado y después a otros dos enemigos vivos. Cada disparo puede fallar y causa el 65% del daño normal.',limit:'Una vez por combate. Necesita al menos 2 enemigos y una bala por objetivo.'},
 {id:'sight',name:'Mira calibrada',category:'Armamento',icon:'sight',summary:'Reconoce antes el punto débil.',buff:'Crítico natural con 19–20',detail:'Los ataques con tirada del portador pueden ser críticos al obtener 19 o 20. El ataque todavía debe superar la defensa enemiga.',limit:'Pasiva. No convierte los fallos en aciertos.'},
 {id:'breach',name:'Punto descubierto',category:'Armamento',icon:'breach',summary:'Abre una oportunidad para otro aliado.',buff:'+25% al siguiente impacto aliado',detail:'Un crítico del portador marca al enemigo. El siguiente impacto de un aliado diferente recibe 25% más daño antes de la armadura y consume la marca.',limit:'Pasiva. Las marcas no se acumulan.'},
 {id:'opener',name:'Primer disparo',category:'Armamento',icon:'opener',summary:'Prepara el primer ataque con cuidado.',buff:'+2 precisión · +25% daño',detail:'Mejora el primer ataque normal del portador en cada combate. Si empieza con una ráfaga, solo mejora su primer disparo.',limit:'Se consume con el intento, aunque falle. No afecta a la habilidad original.'},
 {id:'knife',name:'Último recurso',category:'Armamento',icon:'knife',summary:'Sigue luchando cuando se vacía el cargador.',buff:'+35% de daño con el cuchillo',detail:'Cuando un ataque normal cambia al cuchillo por falta de munición del arma equipada, causa 35% más daño antes de la armadura.',limit:'Pasiva. No se activa si el portador equipa directamente un arma cuerpo a cuerpo.'},
 {id:'cover',name:'Fuego de cobertura',category:'Armamento',icon:'cover',summary:'Obliga al enemigo a perder su línea de tiro.',buff:'−25% al próximo ataque enemigo',detail:'Un impacto del portador reduce en 25% el daño bruto del próximo ataque del objetivo. El efecto se consume aunque ese ataque falle.',limit:'Pasiva. No se acumula. Un turno aturdido no consume la reducción.'},
 {id:'arc',name:'Arco de inducción',category:'Tecnología',icon:'arc',owner:'elias',summary:'Comparte la descarga entre dos máquinas.',buff:'Segundo objetivo · 40% de daño',detail:'La habilidad EMP de Elías alcanza a otro enemigo mecánico vivo con el 40% del daño base. El impacto secundario no aturde.',limit:'Se activa con la habilidad de Elías. El salto no genera otros efectos ni más saltos.'},
 {id:'capacitor',name:'Condensador de reserva',category:'Tecnología',icon:'capacitor',owner:'elias',summary:'Lleva una carga preparada para el contacto.',buff:'1 EMP sin consumir batería',detail:'Elías puede usar su habilidad EMP sin gastar batería, incluso si no lleva ninguna. El resto de las reglas de su habilidad se mantiene.',limit:'Una carga por combate. No aporta baterías al inventario.'},
 {id:'plate',name:'Placa reactiva',category:'Protección',icon:'plate',summary:'Absorbe el primer impacto.',buff:'−50% al primer daño recibido',detail:'Reduce a la mitad, redondeando hacia arriba la protección, el primer daño directo que recibe el portador después de aplicar su equipo y cobertura.',limit:'Una vez por combate. No se consume con un fallo, un bloqueo total o sangrado.'},
 {id:'pulse',name:'Pulso estable',category:'Medicina',icon:'pulse',owner:'sara',summary:'Estabiliza al aliado recién atendido.',buff:'La primera cura añade protección',detail:'La primera habilidad de curación de Sara protege al receptor: reduce 30% el siguiente daño directo recibido después de equipo y cobertura.',limit:'Una aplicación por combate. No se acumula; no protege del sangrado.'},
 {id:'shared',name:'Dosis compartida',category:'Medicina',icon:'shared',owner:'sara',summary:'Aprovecha la intervención para atender a otro.',buff:'Hasta +6 HP a otro aliado',detail:'La habilidad de Sara recupera también hasta 6 HP del otro aliado vivo más herido. Nunca supera su vida máxima.',limit:'No reanima. La curación secundaria no activa otras mejoras.'}
];
var fieldById={};fieldDefs.forEach(function(d){fieldById[d.id]=d});
function fieldFresh(){return {version:1,seed:(Math.floor(Math.random()*4294967296)>>>0)||2130,selected:[],offer:null,stats:{activations:0,bonusDamage:0,prevented:0,healed:0,batteries:0}}}
function fieldStore(){if(!state.fieldUpgrades)state.fieldUpgrades=fieldFresh();return state.fieldUpgrades}
function fieldNormalize(){
 var f=fieldStore(),base=fieldFresh(),seen={};
 f.seed=(Number(f.seed)>>>0)||base.seed;f.version=1;
 f.selected=(Array.isArray(f.selected)?f.selected:[]).filter(function(x){var d=x&&fieldById[x.id];if(!d||seen[x.id]||!state.party.some(function(p){return p.id===x.owner&&(!d.owner||d.owner===p.id)}))return false;seen[x.id]=true;return true}).slice(0,4).map(function(x){return{id:x.id,owner:x.owner}});
 f.stats=Object.assign(base.stats,f.stats||{});Object.keys(base.stats).forEach(function(k){f.stats[k]=Math.max(0,Number(f.stats[k])||0)});
 if(!f.offer||f.offer.tier!==f.selected.length||!Array.isArray(f.offer.ids)||f.offer.ids.length!==3||new Set(f.offer.ids).size!==3||f.offer.ids.some(function(id){return !fieldById[id]||seen[id]}))f.offer=null;
 return f;
}
function fieldHas(p,id){return !!p&&fieldStore().selected.some(function(x){return x.id===id&&x.owner===p.id})}
function fieldOwned(p){return fieldStore().selected.filter(function(x){return x.owner===p.id}).map(function(x){return fieldById[x.id]})}
function fieldEligible(d){return state.party.filter(function(p){return(!d.owner||p.id===d.owner)&&(!d.gun||!!weaponFor(p).ammo)})}
function fieldRandom(){var f=fieldStore();f.seed=(Math.imul(f.seed,1664525)+1013904223)>>>0;return f.seed/4294967296}
function fieldDue(){var n=fieldStore().selected.length;return n<4&&!state.finished&&(state.index>=[3,9,16,22][n]||state.stats.wins>=[1,3,5,7][n])}
function fieldPrepareOffer(){
 var f=fieldStore();if(f.offer)return f.offer;if(!fieldDue())return null;
 var pool=fieldDefs.filter(function(d){return !f.selected.some(function(x){return x.id===d.id})&&fieldEligible(d).length});
 // Shuffle only this system's RNG. Reloading keeps the exact three candidates.
 for(var i=pool.length-1;i>0;i--){var j=Math.floor(fieldRandom()*(i+1)),tmp=pool[i];pool[i]=pool[j];pool[j]=tmp}
 if(pool.length<3)return null;f.offer={tier:f.selected.length,ids:pool.slice(0,3).map(function(d){return d.id})};save();return f.offer;
}
function fieldSelect(id,owner){
 var f=fieldStore(),d=fieldById[id];if(!f.offer||!d||f.selected.length>=4||f.offer.ids.indexOf(id)<0||f.selected.some(function(x){return x.id===id})||!fieldEligible(d).some(function(p){return p.id===owner}))return false;
 f.selected.push({id:id,owner:owner});f.offer=null;save();return true;
}
function fieldCombat(){if(!battleState)return null;if(!battleState.field)battleState.field={used:{},first:{},pulse:{}};return battleState.field}
function fieldKey(p,id){return p.id+':'+id}
function fieldUsed(p,id){return !!fieldCombat().used[fieldKey(p,id)]}
function fieldMark(p,id){fieldCombat().used[fieldKey(p,id)]=true;fieldStore().stats.activations++}
function fieldLog(text){if(battleState)battleState.log.push(text)}
function fieldCritical(p,roll){return roll>= (fieldHas(p,'sight')?19:20)}
function fieldBatteryReady(p){return fieldHas(p,'capacitor')&&!fieldUsed(p,'capacitor')}
function fieldConsumeBattery(p){if(fieldBatteryReady(p)){fieldMark(p,'capacitor');fieldStore().stats.batteries++;fieldLog('Condensador de reserva: Elías utiliza la carga preparada.');return}consumeFromBag(p,'battery');addStatItem('itemsUsed','battery',1)}
function fieldBeginWeapon(p){var f=fieldCombat(),first=!f.first[p.id];f.first[p.id]=true;return first&&fieldHas(p,'opener')}
function fieldWeaponHit(p,e,w,scale,label,opening,fallback){
 var bonus=w.accuracy+p.level+hungerPenalty(p)+weaponAccuracyPenalty(p,w)+personalAccuracyBonus(p)+(opening?2:0),roll=d20();state.stats.attacks++;
 if(opening){fieldStore().stats.activations++;fieldLog('Primer disparo: '+p.name+' gana precisión y daño para este intento.')}
 if(roll+bonus<e.def){state.stats.misses++;combatNotice('ally',battleState.actor,'FALLÓ','miss');var training=weaponAccuracyPenalty(p,w),fatigue=hungerPenalty(p);fieldLog(p.name+' falla con '+w.name+'.'+(training?' Su falta de entrenamiento con armas de fuego reduce la precisión en 2.':'')+(fatigue?' La falta de energía reduce su precisión en '+Math.abs(fatigue)+'.':''));return}
 state.stats.hits++;var damage=rand(w.damage[0],w.damage[1])+personalDamageBonus(p,e),critical=fieldCritical(p,roll);
 var beforeCritical=damage;if(critical)damage=Math.floor(damage*1.75);
 var expanded=critical&&roll===19;if(expanded){fieldStore().stats.activations++;fieldLog('Mira calibrada: '+p.name+' convierte el 19 natural en crítico.')}
 var base=Math.floor((expanded?beforeCritical:damage)*scale),modified=Math.floor(damage*scale);
 if(opening)modified=Math.floor(modified*1.25);
 if(fallback&&fieldHas(p,'knife')){modified=Math.floor(modified*1.35);fieldStore().stats.activations++;fieldLog('Último recurso: '+p.name+' refuerza su ataque con cuchillo.')}
 fieldStrike(e,modified,label,battleState.actor,critical,{base:base,credited:scale!==1});
}
function fieldNormalAttack(p,e){
 var w=weaponFor(p),fallback=false;if(w.ammo){if(!consumeFromBag(p,w.ammo)){fieldLog(p.name+' no tiene '+gear(w.ammo).name+' y cambia al cuchillo.');w=gear('knife');fallback=true}else state.stats.shots++}
 fieldWeaponHit(p,e,w,1,p.name+' usa '+w.name,fieldBeginWeapon(p),fallback);
}
/* Hook around the engine strike; secondary electric damage bypasses proc chains. */
function fieldStrike(enemy,damage,label,index,critical,options){
 options=options||{};if(!battleState||enemy.hp<=0)return;
 var p=state.party[index],base=options.base===undefined?damage:options.base,before=enemy.hp;
 if(!options.secondary&&enemy.fieldBreach&&enemy.fieldBreach!==p.id){damage=Math.floor(damage*1.25);enemy.fieldBreach=null;fieldStore().stats.activations++;fieldLog('Punto descubierto: '+p.name+' aprovecha la abertura.')}
 var originalDamage=Math.min(before,Math.max(1,base-enemy.armor));
 fieldRawStrike(enemy,damage,label,index,critical);
 var actual=before-enemy.hp;if(options.secondary||options.credited)fieldStore().stats.bonusDamage+=actual;else fieldStore().stats.bonusDamage+=Math.max(0,actual-originalDamage);
 if(options.secondary||enemy.hp<=0)return;
 if(critical&&fieldHas(p,'breach')){enemy.fieldBreach=p.id;fieldStore().stats.activations++;fieldLog('Punto descubierto: otro aliado puede aprovechar la marca sobre '+enemy.name+'.')}
 if(fieldHas(p,'cover')){enemy.fieldSuppressed=true;fieldLog('Fuego de cobertura: '+enemy.name+' pierde potencia para su próximo ataque.')}
}
var fieldRawStrike=null;
function fieldArc(p,primary,damage){
 if(!fieldHas(p,'arc'))return;var other=livingEnemies().find(function(e){return e!==primary&&e.mechanical});if(!other)return;
 fieldStore().stats.activations++;fieldStrike(other,Math.floor(damage*.4),'Arco de inducción',battleState.actor,false,{secondary:true});
}
function fieldEnemyDamage(enemy,raw){if(!enemy.fieldSuppressed)return raw;fieldStore().stats.activations++;var reduced=Math.floor(raw*.75);return reduced}
function fieldIncoming(p,damage){
 if(damage<=0)return damage;var result=damage,f=fieldCombat();
 if(fieldHas(p,'plate')&&!fieldUsed(p,'plate')){fieldMark(p,'plate');result=Math.floor(result*.5);fieldLog('Placa reactiva: '+p.name+' absorbe parte del impacto.')}
 if(f.pulse[p.id]){delete f.pulse[p.id];result=Math.floor(result*.7);fieldLog('Pulso estable: la protección de '+p.name+' amortigua el golpe.')}
 fieldStore().stats.prevented+=Math.max(0,Math.min(p.hp,damage)-Math.min(p.hp,result));return result;
}
function fieldAfterHeal(p,target){
 if(fieldHas(p,'pulse')&&!fieldUsed(p,'pulse')){fieldMark(p,'pulse');fieldCombat().pulse[target.id]=true;fieldLog('Pulso estable: '+target.name+' queda protegido frente al siguiente impacto.')}
 if(fieldHas(p,'shared')){var other=state.party.filter(function(a){return a!==target&&a.hp>0&&a.hp<a.maxHp}).sort(function(a,b){return a.hp/a.maxHp-b.hp/b.maxHp})[0];if(other){var before=other.hp;other.hp=Math.min(other.maxHp,other.hp+6);recordHealing(other.hp-before,false);recordHp('ally',state.party.indexOf(other),before,other.hp,other.maxHp);fieldStore().stats.healed+=other.hp-before;fieldStore().stats.activations++;fieldLog('Dosis compartida: '+other.name+' recupera '+(other.hp-before)+' HP.')}}
}
function fieldActiveReason(id,p){
 if(!battleState||battleState.phase!=='combat'||battleState.busy||!p||p.hp<=0)return 'Espera tu turno';
 if(!fieldHas(p,id)||!fieldById[id].active)return 'Mejora no equipada';if(fieldUsed(p,id))return 'Usada en este combate';
 var w=weaponFor(p);if(!w.ammo)return 'Necesita un arma de fuego';var count=id==='triple'?3:Math.min(3,livingEnemies().length);
 if(id==='sweep'&&count<2)return 'Necesita al menos 2 enemigos';if(bagQty(p,w.ammo)<count)return 'Necesita '+count+' unidades de '+gear(w.ammo).name;return '';
}
function fieldActivate(id){
 if(typeof fieldVisible==='function'&&fieldVisible())return false;
 var p=battleState&&state.party[battleState.actor];if(fieldActiveReason(id,p))return false;
 var w=weaponFor(p),selected=selectedEnemy(),targets=id==='triple'?[selected,selected,selected]:[selected].concat(livingEnemies().filter(function(e){return e!==selected})).slice(0,3);
 fieldMark(p,id);state.stats.skillsUsed++;var first=fieldBeginWeapon(p);
 targets.forEach(function(e,i){if(e.hp<=0)return;consumeFromBag(p,w.ammo);state.stats.shots++;fieldWeaponHit(p,e,w,id==='triple'?.55:.65,p.name+' · '+fieldById[id].name+' ('+(i+1)+'/'+targets.length+')',first&&i===0,false)});
 if(typeof fieldCloseSkills==='function')fieldCloseSkills();
 if(lethalFeedback())settleLethal(function(){if(!livingEnemies().length)beginLootPhase();else endPlayerTurn()});else endPlayerTurn();return true;
}
function fieldReportRows(){var f=fieldStore();if(!f.selected.length)return [];return [['Mejoras equipadas',f.selected.length],['Activaciones de mejoras',f.stats.activations],['Daño por mejoras',f.stats.bonusDamage],['Daño evitado por mejoras',f.stats.prevented],['HP por Dosis compartida',f.stats.healed],['Baterías ahorradas',f.stats.batteries]]}
function fieldSummaryHTML(){var f=fieldStore();if(!f.selected.length)return '';return '<section class="summary-block"><h3>Mejoras de esta partida</h3>'+f.selected.map(function(x){var p=state.party.find(function(p){return p.id===x.owner}),d=fieldById[x.id];return '<p><strong>'+esc(d.name)+' · '+esc(p.name)+'</strong><br>'+esc(d.buff)+'</p>'}).join('')+'</section>'}

fieldRawStrike=strike;strike=fieldStrike;fieldNormalize();
function fieldHasActive(p){return fieldOwned(p).some(function(d){return d.active})}
