/* Common entry for the existing story and the courier activity. Inventories remain separate; confirmed courier reports can reach the campaign. */
function activityVisible(){return !$("activityMenu").classList.contains("hidden")||!$("courierScreen").classList.contains("hidden")||!$("storyPrelude").classList.contains("hidden")}
function hideActivities(){["activityMenu","courierScreen","storyPrelude"].forEach(function(id){$(id).classList.add("hidden")});document.querySelectorAll('[data-activity-inert]').forEach(function(n){n.removeAttribute('inert');n.removeAttribute('data-activity-inert')})}
function lockActivityBackground(){document.querySelectorAll('body > .app, body > .overlay, body > .field-collection').forEach(function(n){if(n.id!=='activityMenu'&&n.id!=='courierScreen'&&n.id!=='storyPrelude'&&!n.hasAttribute('inert')){n.setAttribute('inert','');n.setAttribute('data-activity-inert','')}})}
function openActivityMenu(){
 if(typeof syncWorldContinuity==='function')syncWorldContinuity();
 var resume=state.activity==='couriers';
 $("courierScreen").classList.add("hidden");$("activityMenu").classList.remove("hidden");$("activityMenu").removeAttribute('inert');lockActivityBackground();
 state.activity=resume?'couriers':'hub';save();
 $("storyActivityStatus").textContent=state.finished?'Expedición terminada · consultar desenlace':state.starterKitGiven?'Partida guardada · día '+currentDay():'Prepara al grupo con Mara en Los Héroes';
 var report=typeof worldMoralesFact==='function'?worldMoralesFact():null;
 if(report&&!report.read&&!state.finished)$("storyActivityStatus").textContent+=' · Morales dejó un informe';
 $("activityTitle").focus({preventScroll:true});
}
function courierAudioVisible(active){var frame=$('courierFrame');try{if(frame.contentWindow&&frame.contentWindow.NeoCourierVisibility)frame.contentWindow.NeoCourierVisibility(active)}catch(e){}}
function resetActivityProgress(){
 try{
  localStorage.removeItem('neosantiago.mensajeros.production.v1');
  localStorage.removeItem('neosantiago.mensajeros.production.v1.backup');
 }catch(e){toast('No se pudo reiniciar el guardado de encargos. Revisa el almacenamiento del navegador.');return false}
 courierAudioVisible(false);
 // Destroy the old browsing context, including its combat, timers and in-memory world.
 var frame=$('courierFrame'),replacement=frame.cloneNode(false);
 replacement.removeAttribute('src');frame.replaceWith(replacement);
 return true;
}
function openCourierActivity(){
 setSceneAmbience(null);courierAudioVisible(true);
 state.activity='couriers';save();$("activityMenu").classList.add("hidden");$("courierScreen").classList.remove("hidden");
 var frame=$("courierFrame");if(!frame.getAttribute('src'))frame.setAttribute('src','extensions/mensajeros/play.html?v=16-beatriz-credits');
 $("courierReturn").focus({preventScroll:true});
}
function returnToActivities(){courierAudioVisible(false);setSceneAmbience('ambience-title',AUDIO_CROSSFADE_MS);state.activity='hub';openActivityMenu()}
function enterStoryActivity(){
 if(typeof syncWorldContinuity==='function')syncWorldContinuity();
 hideActivities();state.activity='story';signalLastTick=Date.now();save();render();
 if(state.finished&&state.ending){if(state.summarySeen)showRunSummary();else finish(state.ending)}
 else if(typeof pendingNight==="function"&&pendingNight())showNight();
 else if(!state.starterKitGiven)openRefuge('start');
 else if(state.refuge.active){$('refuge').classList.remove('hidden');renderRefuge();$('refugeActivities').focus({preventScroll:true});}
 else if(typeof resumeCrate==='function'&&resumeCrate())return;
 else if(state.inhibitor.pendingContact==='hack'||state.inhibitor.pendingContact==='exposed')startTrackingCombat(state.inhibitor.pendingContact);
 else $('advance').focus({preventScroll:true});
}
function openStoryPrelude(){
 $("activityMenu").classList.add("hidden");$("storyPrelude").classList.remove("hidden");$("storyPrelude").removeAttribute('inert');
 state.activity='story';save();$("storyPreludeContinue").focus({preventScroll:true});
}
function resumeStoryActivity(){
 if(!state.storyPreludeSeen&&!state.starterKitGiven){openStoryPrelude();return}
 enterStoryActivity();
}
function finishStoryPrelude(){state.storyPreludeSeen=true;save();enterStoryActivity()}
function activityBack(){
 if(!$("courierScreen").classList.contains("hidden")){
  var frame=$("courierFrame");try{if(frame.contentWindow.NeoCourierBack&&frame.contentWindow.NeoCourierBack())return true}catch(e){}
  returnToActivities();return true;
 }
 if(!$("storyPrelude").classList.contains("hidden")){state.activity='hub';openActivityMenu();return true}
 if(!$("activityHelpText").classList.contains("hidden")){$("activityHelpText").classList.add("hidden");$("activityHelp").focus();return true}
 return false;
}
$("chooseStory").addEventListener('click',resumeStoryActivity);
$("chooseCouriers").addEventListener('click',openCourierActivity);
$("storyPreludeContinue").addEventListener('click',finishStoryPrelude);
$("courierReturn").addEventListener('click',returnToActivities);
$("refugeActivities").addEventListener('click',function(){if(state.refuge.active){state.activity='hub';openActivityMenu()}});
$("activityHelp").addEventListener('click',function(){$("activityHelpText").classList.toggle('hidden')});
document.addEventListener('keydown',function(e){
 if(!activityVisible())return;
 if(e.key==='Escape'){e.preventDefault();activityBack()}
 if(e.key==='Tab'&&!$("activityMenu").classList.contains('hidden')){
  if(e.shiftKey&&document.activeElement===$("activityTitle")){e.preventDefault();$("activityHelp").focus()}
  else if(!e.shiftKey&&document.activeElement===$("activityHelp")){e.preventDefault();$("activityTitle").focus()}
 }
 e.stopImmediatePropagation();
},true);
window.addEventListener('message',function(e){
 if(e.origin!==location.origin||e.source!==$("courierFrame").contentWindow)return;
 if(e.data&&e.data.type==='neo-courier-return')returnToActivities();
});

if($('summaryActivities'))$('summaryActivities').addEventListener('click',function(){state.activity='hub';openActivityMenu()});
