const {test,expect,capture,fits}=require('./helpers.cjs');
const {setup,finish}=require('../courier-return-fixtures.cjs');
const fixture=require('../../labs/community-bridge/campaign-fixture.json');
// Staged day-three boundary. Travel and escort are advanced by the real engine;
// the browser drives request, acceptance, collection, reception and reload.
async function enter(page){
 await page.goto('/neosantiago-demo.html');
 await page.evaluate(s=>{
  load(JSON.stringify(s));gameSessionActive=true;state.flags.iaraAtSafeHouse=true;state.flags.rosaCivilNetwork=true;state.index=18;state.refuge.active=false;prepareNight(2,null);settleNight('share');continueAfterNight();save();
 },fixture);
 await page.reload();await page.locator('#enterTitle').click();await page.locator('#cinematicSkip').click();await page.locator('#continueGame').click();
 await expect(page.locator('#refuge')).toBeVisible();await expect(page.locator('#leaveRefuge')).toHaveText('Preparar salida · día 3');await page.locator('#rosaBridgePanel summary').click();
}
function liveFrame(page){return page.frames().find(f=>/mensajeros\/play.html/.test(f.url()));}
async function arrive(page,key,raw){
 await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw});const frame=liveFrame(page);await frame.goto(frame.url());await expect(frame.locator('[data-rosa-open]').first()).toBeVisible();return frame;
}
test('Rosa production: real Ana escort, physical reception, shared refuge, reload and avenue consequence',async({page},testInfo)=>{
 const {E,d}=await setup();await enter(page);await page.locator('#rosaAccept').focus();await page.keyboard.press('Enter');await expect(page.locator('#leaveRefuge')).toBeEnabled();await fits(page,'#rosaBridgePanel');await capture(page,testInfo,'rosa-request');
 await page.locator('#rosaCouriers').click();let frame=page.frameLocator('#courierFrame');await frame.locator('[data-help-done]').click();await expect(frame.locator('#dialogTitle')).toHaveText('Una puerta para volver');
 await frame.locator('[data-rosa-action="travel"]').click();let w=E.restore(d,await page.evaluate(key=>localStorage.getItem(key),d.save_key));expect(w.paid).toEqual([]);expect(w.progression.known).toEqual(['relevo-01','ana-01']);expect(w.run.mission).toBe('rosa-heroes');
 w=finish(E,d,w);let live=await arrive(page,d.save_key,E.serialize(w));await live.locator('[data-rosa-open]').first().click();await live.locator('[data-rosa-action="collect"]').click();await expect(live.locator('#dialogBody')).toContainText('acompañar a las familias');
 await live.locator('[data-offer="ana-01"]').click();await expect(live.locator('#dialogBody')).toContainText('Rosa');await live.locator('[data-accept="ana-01"]').click();
 w=finish(E,d,E.restore(d,await page.evaluate(key=>localStorage.getItem(key),d.save_key)));const credits=w.credits;expect(w.paid).toEqual(['ana-01']);expect(w.location).toBe('heroes');live=await arrive(page,d.save_key,E.serialize(w));
 await live.locator('#heroesButton').click();const refuge=live.frameLocator('#refugeLayer');await expect(refuge.locator('#refuge')).toBeVisible();await expect(refuge.locator('#rosaBridgePanel')).toHaveCount(0);await refuge.locator('#leaveRefuge').click();
 await live.locator('[data-rosa-open]').first().click();await live.locator('[data-rosa-action="deliver"]').click();await expect(live.locator('#dialogBody')).toContainText('no confirma su traslado');await capture(page,testInfo,'rosa-reception');
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).credits,d.save_key)).toBe(credits);
 await live.locator('[data-rosa-action="campaign"]').click();await page.locator('#chooseStory').click();await expect(page.locator('#rosaBridgeText')).toContainText('La responsable de Los Héroes');await page.locator('#rosaReview').click();await expect(page.locator('#rosaBridgeText')).toContainText('Noa marca la bajada');
 const request=await page.evaluate(()=>state.rosaBridge);await page.reload();await page.locator('#enterTitle').click();await page.locator('#cinematicSkip').click();await page.locator('#continueGame').click();await page.locator('#rosaBridgePanel summary').click();expect(await page.evaluate(()=>state.rosaBridge)).toEqual(request);await capture(page,testInfo,'rosa-campaign-return');
 // The scene uses the ordinary choices and logistics; only the new option is gated.
 await page.locator('#leaveRefuge').click();await page.locator('#confirmLogistics').click();
 await expect(page.locator('#signalModal')).toBeVisible();await page.locator('#signalPrimary').click();
 const keys={'↑':'ArrowUp','↓':'ArrowDown','←':'ArrowLeft','→':'ArrowRight'};
 for(let round=1;round<=3;round++){
  await expect(page.locator('#signalRound')).toHaveText(`Ronda ${round} / 3`);await expect(page.locator('#signalSequence span.done')).toHaveCount(0);
  for(const arrow of await page.locator('#signalSequence span').allTextContents())await page.keyboard.press(keys[arrow]);
 }
 await expect(page.locator('#signalOutcomeTitle')).toHaveText('Identidad falsa activada');await page.locator('#signalPrimary').click();await expect(page.locator('#signalModal')).toBeHidden();
 await expect(page.locator('#expeditionOrientation')).toBeVisible();
 await page.locator('#expeditionOrientation summary').click();
 await expect(page.locator('#expeditionPurpose')).toContainText('gastando agua');
 await expect(page.locator('#expeditionPurpose')).toContainText('patrulla permanecerá');
 await expect(page.getByRole('button',{name:/Guiar a los civiles hasta el relevo acordado con Ana/})).toBeVisible();
 await page.getByRole('button',{name:/Guiar a los civiles hasta el relevo acordado con Ana/}).click();expect(await page.evaluate(()=>state.flags.rosaBridgeRouteUsed)).toBe(true);expect(await page.evaluate(()=>!!state.flags.towerCode)).toBe(false);
});
