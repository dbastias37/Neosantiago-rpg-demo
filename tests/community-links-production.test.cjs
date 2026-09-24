const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {randomUUID}=require('node:crypto');
const {boot}=require('./runtime-harness.cjs');
function campaign(){const a=boot();a.ctx.crypto={randomUUID};assert.equal(a.ctx.load(fs.readFileSync('labs/community-bridge/campaign-fixture.json','utf8')),true);a.ctx.gameSessionActive=true;return a;}
exports.campaign=campaign;
test('normal campaign offers non-blocking Matias connection with original keys and no lab flags',()=>{
 const a=campaign(),c=a.ctx;assert.equal(c.NeoBridgeContext.variant,null);assert.equal(c.NeoBridgeContext.policy,'B');assert.equal(c.KEY,'neosantiago2130_demo_v3');assert.equal(c.WORLD_COURIER_KEY,'neosantiago.mensajeros.production.v1');
 const old=JSON.stringify(c.state);assert.equal(c.state.matiasBridge,undefined);assert.equal(c.acceptMedicalBridge(),true);assert.equal(c.state.matiasBridge.variant,'B');assert.equal(c.refugeCanLeave(),true);const restored=boot(a.storage).ctx;assert.equal(restored.load(),true);assert.equal(restored.state.matiasBridge.requestId,c.state.matiasBridge.requestId);assert.equal(c.load(old),true);assert.equal(c.state.matiasBridge,undefined);
});
