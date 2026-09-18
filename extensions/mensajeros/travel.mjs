// Follow the already-visible route: never insert an unstyled SVG measurement path.
// Reveal an encounter only after reaching the station and signalling arrival for 1 second.
export function animateRoute({path,marker,destination,reducedMotion=false,isCurrent=()=>true,
 requestFrame=callback=>requestAnimationFrame(callback),now=()=>performance.now()}){
 const length=path.getTotalLength(),duration=reducedMotion?0:Math.max(900,Math.min(2600,length*3));
 const started=now();let arrived=null;
 marker.classList.remove('arriving');
 function place(point){marker.setAttribute('cx',point.x);marker.setAttribute('cy',point.y);}
 place(path.getPointAtLength(0));
 return new Promise(resolve=>{
  function frame(timestamp){
   if(!isCurrent()){marker.classList.remove('arriving');resolve(false);return;}
   const progress=duration?Math.min(1,Math.max(0,(timestamp-started)/duration)):1;
   if(arrived===null){
    place(path.getPointAtLength(length*progress));
    if(progress===1){place(destination);arrived=timestamp;marker.classList.add('arriving');}
   }
   if(arrived!==null&&timestamp-arrived>=1000){marker.classList.remove('arriving');resolve(true);return;}
   requestFrame(frame);
  }
  requestFrame(frame);
 });
}
