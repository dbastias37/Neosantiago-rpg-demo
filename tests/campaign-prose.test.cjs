const test=require('node:test');
const assert=require('node:assert/strict');
const {boot}=require('./runtime-harness.cjs');
test('reading expansion is idempotent and preserves choices, prerequisites, mechanics and state',()=>{
 const c=boot().ctx,expand=c.chapterOneReading;c.chapterOneReading=undefined;
 for(let i=0;i<27;i++){
  c.state.index=i;const original=c.eventDisplay(c.events[i],i),before=JSON.stringify(c.state),choices=JSON.stringify(original.choices),expanded=expand(original);
  assert.ok(expanded.text.includes(original.text),original.id);assert.equal(JSON.stringify(expanded.choices),choices);assert.equal(expanded.id,original.id);assert.equal(expanded.day,original.day);assert.equal(JSON.stringify(c.state),before);assert.equal(expand(expanded),expanded);
 }
});
test('conditional memories and current stock remain visible inside the expanded chapter-one scene',()=>{
 const c=boot().ctx;c.state.flags.liraCoreCopied=true;c.state.index=15;
 const text=c.eventDisplay(c.events[15],15).text;assert.match(text,/no ha olvidado la copia/);assert.match(text,/Reservas del grupo/);
 c.state.flags.unit7Sheltered=true;c.state.index=10;assert.match(c.eventDisplay(c.events[10],10).text,/unidad quedó en un conducto/);
});
test('additional route reading leaves every original option and Irene consent available without starting a timer',()=>{
 const c=boot().ctx;for(const id of Object.keys(c.chapterOneRouteReading)){const scene=c.routeNarrativeDefs[id].scenes[0];assert.equal(scene.untimed,true);assert.ok(scene.options.length);assert.equal(new Set(scene.options.map(o=>o.id)).size,scene.options.length);}
 const consent=c.ireneFinalDialogue.nodes.consent;assert.deepEqual(Array.from(consent.options,o=>o.id),['tower.irene-portable','tower.irene-release','tower.irene-stay','tower.irene-leave']);assert.equal(c.dialogueLines(c.ireneFinalDialogue,consent).length,3);
});
test('chapter-two prose and stored chapter-one endings are not rewritten by the reading extension',()=>{
 const c=boot().ctx;const ev=c.events.find(e=>e.chapter===2);assert.equal(c.chapterOneReading(ev),ev);
 c.state.finaleResolution={version:1,kind:'testimony',story:{title:'Texto conservado',lead:'El texto que ya se guardó.'}};const before=JSON.stringify(c.state.finaleResolution);
 c.eventDisplay(c.events[24],24);assert.equal(JSON.stringify(c.state.finaleResolution),before);
});
