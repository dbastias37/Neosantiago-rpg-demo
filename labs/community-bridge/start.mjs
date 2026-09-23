import * as E from '../../extensions/mensajeros/production.mjs';
const buttons=[...document.querySelectorAll('[data-start]')],status=document.getElementById('status');
for(const button of buttons)button.addEventListener('click',async()=>{
 buttons.forEach(b=>b.disabled=true);
 const variant=button.dataset.start,prefix='neosantiago.lab.bridge.'+variant+'.',storyKey=prefix+'neosantiago2130_demo_v3',courierKey=prefix+'neosantiago.mensajeros.production.v1';
 let previous;
 try{
  const responses=await Promise.all([fetch('campaign-fixture.json'),fetch('../../extensions/mensajeros/production.json')]);
  if(responses.some(r=>!r.ok))throw Error('No se pudo preparar la escena.');
  const [story,raw]=await Promise.all(responses.map(r=>r.json())),data=E.prepare(raw),world=E.createWorld(data,{seed:2130});
  previous=[localStorage.getItem(storyKey),localStorage.getItem(courierKey)];
  for(const [key,value] of [[storyKey,previous[0]],[courierKey,previous[1]]])if(value!==null)localStorage.setItem(key+'.backup',value);
  localStorage.setItem(courierKey,E.serialize(world));localStorage.setItem(storyKey,JSON.stringify(story));
  location.href='../../neosantiago-demo.html?bridgeLab='+variant;
 }catch(err){
  if(previous)try{for(const [key,value] of [[storyKey,previous[0]],[courierKey,previous[1]]]){if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value)}}catch{}
  status.textContent='No se inició la prueba: '+err.message;buttons.forEach(b=>b.disabled=false);
 }
});
