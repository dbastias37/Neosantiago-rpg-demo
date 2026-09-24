const {test,expect,capture,fits}=require('./helpers.cjs');
const {setup,finish}=require('../courier-return-fixtures.cjs');
const fixture=require('../../labs/community-bridge/campaign-fixture.json');
// Staged boundary QA: travel between the two arrival fixtures is exercised by
// the production engine, without fabricated receipts or rewards. Node covers
// the complete route and legacy saves; these cases verify the actual UI/storage.
async function enterLab(page,variant){
 if(variant==='production'){
  await page.goto('/neosantiago-demo.html');
  await page.evaluate(s=>{localStorage.setItem('neosantiago2130_demo_v3',JSON.stringify(s));localStorage.setItem('neosantiago.lab.bridge.A.neosantiago2130_demo_v3','lab sentinel');},fixture);
  await page.reload();
 }else{
 await page.goto('/labs/community-bridge/index.html');
 await page.evaluate(()=>{localStorage.setItem('neosantiago2130_demo_v3','production sentinel');localStorage.setItem('neosantiago.mensajeros.production.v1','courier sentinel');});
 await page.locator(`[data-start="${variant}"]`).click();
 await expect(page).toHaveURL(new RegExp('bridgeLab='+variant));
 }
 await page.locator('#enterTitle').click();await page.locator('#cinematicSkip').click();await page.locator('#continueGame').click();
 await expect(page.locator('#refuge')).toBeVisible();await page.locator('#medicalBridgePanel summary').click();
}
function courierFrame(page){return page.frames().find(f=>/mensajeros\/play.html/.test(f.url()));}
async function stageArrival(page,key,raw){
 await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw});
 const frame=courierFrame(page);await frame.goto(frame.url());
 await expect(frame.locator('[data-medical-open]').first()).toBeVisible();return frame;
}
for(const variant of ['A','B','production'])test(`medical bridge ${variant}: request, physical receipt, reload and refuge memory`,async({page},testInfo)=>{
 const {E,d}=await setup(),key=variant==='production'?d.save_key:'neosantiago.lab.bridge.'+variant+'.'+d.save_key;
 await enterLab(page,variant);await page.locator('#medicalAccept').click();
 await expect(page.locator('#medicalAccept')).toBeHidden();
 if(variant==='A')await expect(page.locator('#leaveRefuge')).toBeDisabled();else await expect(page.locator('#leaveRefuge')).toBeEnabled();
 await fits(page,'#medicalBridgePanel');await capture(page,testInfo,'medical-request-'+variant);
 await page.locator('#medicalCouriers').click();let frame=page.frameLocator('#courierFrame');
 await frame.locator('[data-help-done]').click();await expect(frame.locator('#dialogTitle')).toHaveText('La reserva de Vicuña');
 await expect(frame.locator('#dialogBody')).toContainText('no depende de aceptar el rescate');
 await frame.locator('#dialogBody [data-close="dialog"]').click();
 await frame.locator('#crewButton').click();const profile=frame.frameLocator('#profileLayer');await expect(profile.locator('#profileModal')).toBeVisible();await profile.locator('#closeProfile').click();
 await frame.locator('#heroesButton').click();const refuge=frame.frameLocator('#refugeLayer');await expect(refuge.locator('#refuge')).toBeVisible();await expect(refuge.locator('#medicalBridgePanel')).toHaveCount(0);await refuge.locator('#leaveRefuge').click();
 await frame.locator('[data-medical-open]').first().click();
 const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);expect(before.paid).toEqual([]);expect(before.progression.known).toEqual(['relevo-01','adasme-01']);
 await frame.locator('[data-medical-action="travel"]').click();
 let w=E.restore(d,await page.evaluate(key=>localStorage.getItem(key),key));expect(w.run.mission).toBe('medical-heroes');
 w=finish(E,d,w);expect(w.location).toBe('vicuna');let live=await stageArrival(page,key,E.serialize(w));
 await live.locator('[data-medical-open]').first().click();await expect(live.locator('#dialogBody')).toContainText('Pueden llevárselo');
 await live.locator('[data-medical-action="collect"]').click();await expect(live.locator('#dialogBody')).toContainText('carga protegida');
 await capture(page,testInfo,'medical-cargo-'+variant);
 await live.goto(live.url());await live.locator('[data-medical-open]').first().click();
 await live.locator('[data-medical-action="return"]').click();await expect(live.locator('#dialogTitle')).toHaveText('Viajar a Los Héroes');await live.locator('[data-travel-heroes]').click();
 w=finish(E,d,E.restore(d,await page.evaluate(key=>localStorage.getItem(key),key)));expect(w.location).toBe('heroes');live=await stageArrival(page,key,E.serialize(w));
 await live.locator('[data-medical-open]').first().click();await live.locator('[data-medical-action="deliver"]').click();
 await expect(live.locator('#dialogBody')).toContainText('La recepción no confirma el destino de Darío');
 await live.locator('[data-medical-action="campaign"]').click();await page.locator('#chooseStory').click();
 await expect(page.locator('#medicalBridgeText')).toContainText('La posta confirma');await page.locator('#medicalReview').click();
 await expect(page.locator('#medicalBridgeText')).toContainText('La primera luz');await expect(page.locator('#leaveRefuge')).toBeEnabled();
 await capture(page,testInfo,'medical-return-'+variant);
 const result=await page.evaluate(()=>({episode:state.matiasBridge,party:state.party,credits:state.credits}));expect(result.episode.stage).toBe('reviewed');
 await page.reload();await page.locator('#enterTitle').click();await page.locator('#cinematicSkip').click();await page.locator('#continueGame').click();
 await page.locator('#medicalBridgePanel summary').click();await expect(page.locator('#medicalBridgeText')).toContainText('La primera luz');
 expect(await page.evaluate(()=>({episode:state.matiasBridge,party:state.party,credits:state.credits}))).toEqual(result);
 if(variant==='production')expect(await page.evaluate(()=>localStorage.getItem('neosantiago.lab.bridge.A.neosantiago2130_demo_v3'))).toBe('lab sentinel');
 else expect(await page.evaluate(()=>[localStorage.getItem('neosantiago2130_demo_v3'),localStorage.getItem('neosantiago.mensajeros.production.v1')])).toEqual(['production sentinel','courier sentinel']);
 if(variant==='production'){
  await page.locator('#leaveRefuge').click();await page.locator('#confirmLogistics').click();
  await expect(page.locator('#expeditionPurpose')).toContainText('marca baja');
 }
});

test('medical bridge A: delegating releases departure and keyboard keeps the refuge usable',async({page},testInfo)=>{
 await enterLab(page,'A');await page.locator('#medicalAccept').focus();await page.keyboard.press('Enter');await expect(page.locator('#leaveRefuge')).toBeDisabled();
 await page.locator('#medicalDelegate').focus();await page.keyboard.press('Enter');await expect(page.locator('#leaveRefuge')).toBeEnabled();
 await expect(page.locator('#medicalBridgeText')).toContainText('la entrega sigue pendiente');
 expect(await page.evaluate(()=>state.matiasBridge.stage)).toBe('requested');await fits(page,'#medicalBridgePanel');await capture(page,testInfo,'medical-delegated');
});
