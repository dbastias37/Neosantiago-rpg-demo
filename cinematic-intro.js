// One opening per page visit. Timers are cancelled on skip; no save is touched here.
var cinematicRunning=false,cinematicPlayed=false,cinematicTimers=[],cinematicDestination=null,cinematicInert=[];
function cinematicLater(fn,ms){cinematicTimers.push(setTimeout(fn,ms))}
function cinematicCard(id){
  ["cinematicLogo","cinematicCredit","cinematicTitle"].forEach(function(key){
    var card=$(key);card.classList.toggle("visible",key===id);
    card.setAttribute("aria-hidden",key===id?"false":"true");
    if(key===id&&key!=="cinematicCredit")card.classList.add("approaching")
  })
}
function revealCinematicDestination(){
  if(!cinematicRunning||!cinematicDestination)return;
  cinematicTimers.forEach(clearTimeout);cinematicTimers=[];cinematicCard(null);
  var destination=cinematicDestination;cinematicDestination=null;cinematicPlayed=true;
  // Restore input before showing/focusing the destination beneath the black veil.
  cinematicInert.forEach(function(el){el.removeAttribute("inert")});cinematicInert=[];
  destination();$("cinematicIntro").classList.add("revealing");
  cinematicLater(function(){
    $("cinematicIntro").classList.add("hidden");cinematicRunning=false;cinematicTimers=[]
  },1500)
}
function playOpeningCinematic(destination){
  if(cinematicRunning)return;
  // Called synchronously from the user gesture, including the Enter key.
  unlockAudioAmbience();
  if(cinematicPlayed){destination();return}
  cinematicRunning=true;cinematicDestination=destination;
  var layer=$("cinematicIntro");layer.classList.remove("hidden","revealing");
  Array.prototype.forEach.call(document.body.children,function(el){
    if(el!==layer&&!el.hasAttribute("inert")&&!/^(SCRIPT|STYLE|LINK)$/.test(el.tagName)){el.setAttribute("inert","");cinematicInert.push(el)}
  });
  layer.focus({preventScroll:true});
  cinematicLater(function(){cinematicCard("cinematicLogo")},500);
  cinematicLater(function(){cinematicCard(null)},4900);
  // Slow logo fade ends at 6500; one full second of black follows.
  cinematicLater(function(){cinematicCard("cinematicCredit")},7500);
  // Credit fades in for 1600 ms, holds for one second, then fades out.
  cinematicLater(function(){cinematicCard(null)},10100);
  cinematicLater(function(){cinematicCard("cinematicTitle")},11700);
  // Title remains fully visible for four seconds, with a subtle continuous zoom.
  cinematicLater(function(){cinematicCard(null)},17300);
  cinematicLater(revealCinematicDestination,18900)
}
document.getElementById("cinematicSkip").addEventListener("click",revealCinematicDestination);
