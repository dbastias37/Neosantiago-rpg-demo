const test=require('node:test'),assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
function start(){const a=boot();a.ctx.gameSessionActive=true;a.ctx.state.index=9;return a}
function choose(c,id,scene,index){c.openRouteNarrative(id,scene);c.revealRouteNarrativeText();c.selectRouteNarrativeChoice(index)}
test('every route generates its graph with unique identities and every terminal option has a scene consequence',()=>{
 const c=start().ctx,ids=[];for(const [id,d]of Object.entries(c.routeNarrativeDefs)){
  assert.ok(c.narrativeGraph(id).nodes.length);for(const s of d.scenes){ids.push(s.id);assert.ok(s.untimed);for(const o of s.options){ids.push(o.id);if(o.end)assert.ok(o.result,o.id);else assert.ok(d.scenes[o.nextScene],o.id)}}
 }assert.equal(ids.length,new Set(ids).size);
});
test('saving only S7 names enters a separate scene and cannot manufacture full restoration or an infiltration',()=>{
 const c=start().ctx;choose(c,'unit7LastOrder',1,1);assert.equal(c.routeNarrativeState.sceneIndex,3);c.revealRouteNarrativeText();c.selectRouteNarrativeChoice(0);
 assert.equal(c.state.flags.unit7Sheltered,true);assert.ok(!c.state.flags.unit7Ally);assert.ok(!c.state.flags.unit7OriginalOrderRestored);
 const ev=c.events[10];assert.match(c.eventDisplay(ev,10).text,/sale sin S-7/);
});
test('Rosa to Matias and Matias to S7 links need the precise earlier reward',()=>{
 const c=start().ctx,r=c.routeNarrativeDefs;
 const passage=r.matiasRescue.scenes[1].options[3],frequency=r.unit7LastOrder.scenes[0].options[3];
 c.state.flags.rosaCivilNetwork=true;assert.ok(c.reason(passage));c.state.flags.rosaSafeHouseMarked=true;assert.equal(c.reason(passage),'');
 choose(c,'matiasRescue',1,3);assert.equal(c.state.flags.matiasUsedRosaPassage,true);assert.equal(c.routeNarrativeState.sceneIndex,2);
 assert.ok(c.reason(frequency));c.apply(r.matiasRescue.scenes[2].options[1]);assert.equal(c.reason(frequency),'');choose(c,'unit7LastOrder',0,3);assert.ok(c.state.flags.unit7UsedMatiasFrequency);
});
test('H12 selective deletion and Ortega civil control require prior preparation, not an unused menu',()=>{
 const a=start(),c=a.ctx,r=c.routeNarrativeDefs;const h=r.unit12InvisibleMap.scenes[2].options[1],o=r.ortegaObedientCity.scenes[2].options[1];
 assert.ok(c.reason(h));choose(c,'unit12InvisibleMap',1,1);assert.equal(c.reason(h),'');
 c.state.flags={};choose(c,'ortegaObedientCity',1,2);c.revealRouteNarrativeText();c.renderRouteNarrativeChoices();assert.ok(c.reason(o));assert.ok(!a.nodes.get('routeNarrativeChoices').innerHTML.includes(o.label));
 const before=JSON.stringify(c.state);c.selectRouteNarrativeChoice(1);assert.equal(JSON.stringify(c.state),before);
});
test('Vega restored names unlock resident access and formal registration revokes a previous concealment',()=>{
 const c=start().ctx,r=c.routeNarrativeDefs;assert.ok(c.reason(r.vegaDeadNames.scenes[2].options[0]));
 choose(c,'vegaDeadNames',1,0);assert.equal(c.reason(r.vegaDeadNames.scenes[2].options[0]),'');c.revealRouteNarrativeText();c.selectRouteNarrativeChoice(0);
 assert.equal(c.reason(r.ortegaObedientCity.scenes[1].options[3]),'');
 c.state.flags={h12Line1Hidden:true};c.apply(r.vegaDeadNames.scenes[2].options[1]);assert.equal(c.state.flags.h12Line1Hidden,false);assert.equal(c.state.flags.line1ConcealmentRevoked,true);
});
test('copied community locations need Rosas actual network and record what Rosa learned',()=>{
 const c=start().ctx,r=c.routeNarrativeDefs;c.state.flags.h12CommunitiesCopied=true;c.apply(r.unit12InvisibleMap.scenes[2].options[0]);assert.ok(!c.state.flags.rosaWarnedCommunities);
 c.state.flags.rosaCivilNetwork=true;c.apply(r.unit12InvisibleMap.scenes[2].options[0]);assert.equal(c.state.flags.rosaWarnedCommunities,true);assert.ok(c.state.narrative.knowledge.rosa.includes('communitiesLocated'));
 c.state.flags.soldRefuge=true;assert.ok(!c.state.narrative.knowledge.rosa.includes('refugeLocation'));
});
test('chapter map freezes closed paths as witnessed instead of changing them retroactively',()=>{
 const c=start().ctx;c.openRouteNarrative('vegaDeadNames',2);c.state.flags.vegaErasedNamesCopied=true;
 const graph=c.narrativeGraph('vegaDeadNames');assert.ok(graph.edges.find(e=>e.to.endsWith('.2.0.end')).blocked);
 c.narrativeMapRoute='vegaDeadNames';const html=c.narrativeMapPanel();assert.match(html,/Sin la copia completa/);assert.match(html,/decisionMapChapter/);
});
test('Lira remembers nonconsensual copy differently from an accident; second-day chronology stays monotonic',()=>{
 const c=start().ctx;c.state.flags={liraCoreCopied:true,liraBrotherRecovered:true};let d=c.narrativeDialogue(c.branchDialogueDefs.liraWounded);assert.match(d.lines[0],/permiso/);assert.ok(d.options.every(o=>!o.flags?.liraAlliance));
 c.state.flags={liraPartialTrust:true,liraBrotherRecovered:true};d=c.narrativeDialogue(c.branchDialogueDefs.liraWounded);assert.ok(d.options.some(o=>o.flags?.liraAlliance));
 c.state.flags={matiasLateStart:true,unit7Ally:true,rosaCivilNetwork:true};let previous=0;for(let i=9;i<=17;i++){const ev=c.eventDisplay(c.events[i],i),[h,m]=ev.time.split(':').map(Number),t=h*60+m;assert.ok(t>previous);previous=t}
});
