const test=require('node:test');
const assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
const route='liraExiledCore';
function start(){const app=boot();const c=app.ctx;c.gameSessionActive=true;c.state.index=4;return app}
function enter(c,index){c.openRouteNarrative(route,index);c.revealRouteNarrativeText()}
test('Lira preparation branches to distinct scenes and portable/damaged readers cannot offer a copy',()=>{
  const c=start().ctx,def=c.routeNarrativeDefs[route];
  assert.deepEqual(Array.from(def.scenes[1].options,o=>o.nextScene),[2,3,4]);
  assert.ok(def.scenes[2].options.some(o=>o.flags.liraCoreCopied));
  for(const index of [3,4])assert.ok(def.scenes[index].options.every(o=>!o.flags.liraCoreCopied));
  const ids=def.scenes.flatMap(s=>[s.id,...s.options.map(o=>o.id)]);assert.equal(ids.length,new Set(ids).size);
  for(const s of def.scenes)for(const o of s.options)assert.ok(o.end||def.scenes[o.nextScene]);
});
test('terminal rescue shows its own prose and repeated input cannot grant rewards twice',()=>{
  const a=start(),c=a.ctx;enter(c,2);c.selectRouteNarrativeChoice(0);
  assert.equal(c.state.flags.liraBrotherRecovered,true);assert.equal(c.state.flags.liraAlliance,true);
  assert.match(a.nodes.get('routeNarrativeText').textContent,/cartón/);
  const snapshot=JSON.stringify(c.state);c.selectRouteNarrativeChoice(2);assert.equal(JSON.stringify(c.state),snapshot);
});
test('copying against refusal preserves the brother but closes Lira alliance and final negotiation',()=>{
  const c=start().ctx;c.state.flags.liraAlliance=true;enter(c,2);c.selectRouteNarrativeChoice(1);
  assert.equal(c.state.flags.liraBrotherRecovered,true);assert.equal(c.state.flags.liraAlliance,false);
  const index=c.events.findIndex(e=>e.title==='Los exiliados regresan');c.state.index=index;
  const ev=c.eventDisplay(c.events[index],index),choice=ev.choices.find(o=>o.flags?.exileAlliance);
  assert.ok(c.reason(choice));c.render();assert.ok(!c.document.getElementById('choices').innerHTML.includes(choice.label));
  const before=JSON.stringify(c.state);c.choose(ev.choices.indexOf(choice));assert.equal(JSON.stringify(c.state),before);
});
test('death revokes old contradictory flags on load and cannot be undone by later healing flags',()=>{
  const a=start(),c=a.ctx;c.state.flags={liraAlliance:true,liraBrotherRecovered:true,liraBrotherLost:true,tookLivingCore:true,savedMerodeadora:true};c.save();
  const loaded=boot(a.storage).ctx;assert.equal(loaded.load(),true);
  assert.equal(loaded.state.flags.liraAlliance,false);assert.equal(loaded.state.flags.liraBrotherRecovered,false);
  loaded.apply({flags:{savedMerodeadora:true,liraAlliance:true}});assert.equal(loaded.state.flags.savedMerodeadora,false);assert.equal(loaded.state.flags.liraAlliance,false);
  const index=loaded.events.findIndex(e=>e.title==='Los exiliados regresan');assert.match(loaded.eventDisplay(loaded.events[index],index).text,/sin Lira/);
});
test('Lira moral choices wait for input and all/any/none predicates have distinct semantics',()=>{
  const a=start(),c=a.ctx;enter(c,2);c.routeNarrativeState.lineIndex=1;c.showRouteNarrativeOptions();assert.equal(c.routeNarrativeTimer,null);assert.ok(a.nodes.get('routeNarrativeClock').classList.contains('hidden'));
  c.state.flags.a=true;assert.ok(c.reason({narrativeRequires:{all:['a','b']}}));assert.equal(c.reason({narrativeRequires:{any:['a','b']}}),'');assert.ok(c.reason({narrativeRequires:{none:['a']}}));
});
test('map is spoiler-filtered, records only visited scenes and persists with the completed route',()=>{
  const a=start(),c=a.ctx;let graph=c.narrativeGraph(route);assert.ok(graph.nodes.every(n=>!n.seen));assert.ok(!JSON.stringify(graph).includes('El lector quemado'));
  enter(c,1);c.placePartyItem('battery',1);c.selectRouteNarrativeChoice(1);assert.equal(c.routeNarrativeState.sceneIndex,3);c.revealRouteNarrativeText();c.selectRouteNarrativeChoice(0);c.advanceRouteNarrative();
  graph=c.narrativeGraph(route);assert.equal(graph.completed,true);assert.ok(graph.nodes.find(n=>n.id==='lira.portable').seen);assert.equal(graph.nodes.find(n=>n.id==='lira.damaged').seen,false);
  const restored=boot(a.storage).ctx;assert.ok(restored.load());assert.equal(restored.narrativeGraph(route).completed,true);
});
test('retreat from pilot battle closes that rescue, keeps the failed attempt and advances past its trigger',()=>{
  const a=start(),c=a.ctx;enter(c,0);c.selectRouteNarrativeChoice(2);assert.ok(c.battleState);c.loseCombat(true);
  assert.equal(c.state.index,5);assert.equal(c.state.flags.liraRescueAbandoned,true);assert.ok(c.state.narrative.routes[route].interrupted);assert.equal(c.state.flags.liraBrotherRecovered,undefined);
  assert.match(c.state.refuge.message,/no se repetirá/);assert.ok(!c.narrativeGraph(route).nodes.find(n=>n.id==='lira.clinic').seen);
});
test('canvas download uses a horizontal PNG and reports unavailable canvas without throwing',()=>{
  const c=start().ctx,draws=[],fake={};fake.getContext=()=>new Proxy({measureText:t=>({width:t.length*11})},{get:(o,k)=>k in o?o[k]:(...args)=>draws.push([k,...args]),set:(o,k,v)=>(o[k]=v,true)});
  c.drawNarrativeMap(fake,route);assert.equal(fake.width,2400);assert.equal(fake.height,1500);assert.ok(draws.some(x=>x[0]==='fillText'));
  let clicked=false,revoked=false;c.URL={createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{revoked=true}};
  c.document.createElement=tag=>tag==='canvas'?Object.assign(fake,{toBlob(fn,type){assert.equal(type,'image/png');fn(new Blob(['png']))}}):{click(){clicked=true;assert.equal(this.download,'NeoSantiago-mapa-de-decisiones-Lira.png')},remove(){}};
  c.downloadDecisionMap();assert.ok(clicked);assert.equal(revoked,false);
});
