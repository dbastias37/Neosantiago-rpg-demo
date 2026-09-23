const {test,expect,capture,fits,newGameThroughUI}=require('./helpers.cjs');
const {writeFile}=require('node:fs/promises');

// Observations only. No injected save, combat outcome, resource, timer or RNG.
// Fast text/animation advancement uses the same controls available to players.
const observe=page=>page.evaluate(()=>({
 index:state.index,party:state.party.map(p=>({id:p.id,hp:p.hp,energy:p.hunger,bag:p.bag})),
 water:state.res.water,food:stockCount('food'),credits:state.credits,flags:state.flags,stats:state.stats,
 history:state.history,night:state.expeditionRest.nights[1],refuge:state.refuge,
 tradeStock:state.tradeStock,armorerStock:state.armorerStock
}));
async function resume(page){
 await page.reload();await page.locator('#enterTitle').click();await page.locator('#cinematicSkip').click();await page.locator('#continueGame').click();
}
async function synchronize(page){
 await expect(page.locator('#signalModal')).toBeVisible();await page.locator('#signalPrimary').click();
 const keys={'↑':'ArrowUp','↓':'ArrowDown','←':'ArrowLeft','→':'ArrowRight'};
 for(let round=1;round<=3;round++){
  await expect(page.locator('#signalRound')).toHaveText(`Ronda ${round} / 3`);
  await expect(page.locator('#signalSequence span.done')).toHaveCount(0);
  const arrows=await page.locator('#signalSequence span').allTextContents();
  for(const arrow of arrows)await page.keyboard.press(keys[arrow]);
 }
 await expect(page.locator('#signalOutcomeTitle')).toHaveText('Identidad falsa activada');
 await page.locator('#signalPrimary').click();await expect(page.locator('#signalModal')).toBeHidden();
}
async function depart(page){
 await page.locator('#leaveRefuge').click();
 await expect(page.locator('#logisticsModal')).toBeVisible();await page.locator('#confirmLogistics').click();
 const left=await observe(page);await synchronize(page);return left;
}

async function firstDay(page,testInfo,rescue,marks){
 const visible=selector=>page.locator(selector).isVisible();
 const choices=[0,2,rescue?0:1,2,2,1,1,2,rescue?0:1];
 const seen=new Set();let combatCaptured=false,lootCaptured=false;
 for(let step=0;step<450;step++){
  if(await visible('#night'))return [...seen];
  if(await visible('#fieldModal')){
   if(await visible('[data-field-reward-next]'))await page.locator('[data-field-reward-next]').click();
   else if(await visible('[data-field-equipped-done]'))await page.locator('[data-field-equipped-done]').click();
   else await page.locator('[data-field-choose]:enabled').first().click();
   continue;
  }
  if(await visible('#lootModal')){
   if(!lootCaptured){await capture(page,testInfo,'day-one-loot');lootCaptured=true;}
   for(let pick=0;pick<12;pick++){
    const drop=await page.evaluate(()=>{const free=bagFree(state.party[battleState.looter]);return battleState.enemies[battleState.openLoot].loot.findIndex(d=>d.status==='pending'&&d.qty<=free)});
    if(drop<0)break;await page.locator(`[data-take-loot="${drop}"]`).click();
   }
   await page.locator('#closeLoot').click();continue;
  }
  if(await visible('#battle')){
   if(!combatCaptured){await capture(page,testInfo,'day-one-combat');combatCaptured=true;}
   const b=await page.evaluate(()=>({phase:battleState.phase,busy:battleState.busy,
    target:battleState.enemies.findIndex(e=>e.hp>0),corpse:battleState.enemies.findIndex(e=>!e.looted),
    looter:battleState.looter,lootTarget:battleState.lootTarget,
    carrier:state.party.map((p,i)=>({i,free:bagFree(p),hp:p.hp})).filter(p=>p.hp>0).sort((a,b)=>b.free-a.free)[0]?.i}));
   if(b.phase==='loot'&&!b.busy){
    if(b.looter!==b.carrier){
     const arrow=page.locator('.stage-card-arrow--ally.next');
     if(await arrow.isVisible())await arrow.click();else await page.locator(`[data-looter="${b.carrier}"]`).click();
    }else if(b.corpse>=0){
     await page.locator(`[data-stage-target="${b.corpse}"]`).click();
     await page.locator(`[data-loot-enemy="${b.corpse}"]`).click();
     // Searching has its own timer; wait for the resulting modal before
     // considering any combat controls behind it.
     await expect(page.locator("#lootModal")).toBeVisible();
    }else await page.locator('#finishLoot').click();
   }else if(b.busy){
    if(await page.locator('#stageAdvance').isEnabled())await page.locator('#stageAdvance').click();
    else await page.waitForTimeout(80);
   }else{
    await page.locator(`[data-stage-target="${b.target}"]`).click();
    await page.locator('[data-action="attack"]').click();
   }
   continue;
  }
  if(await visible('#npcDialogueModal')){
   if(await visible('#dialogueContinueRow'))await page.locator('#dialogueContinue').click();
   else if(await visible('#npcDialogueChoices'))await page.locator('[data-dialogue-choice]:enabled').first().click();
   else await page.locator('#dialogueSkip').click();
   continue;
  }
  if(await visible('#routeNarrativeModal')){
   if(await visible('#routeNarrativeChoices'))await page.locator('[data-route-choice]:enabled').first().click();
   // The supported Enter shortcut remains safe if typing reveals options
   // between inspection and input: it leaves those options ready to choose.
   else await page.keyboard.press('Enter');
   continue;
  }
  if(await visible('#crateModal')){await page.locator('#crateLeave').click();continue;}
  if(await visible('#result')){await page.locator('#advance').click();continue;}
  if(await visible('#signalModal')){await synchronize(page);continue;}
  if(await visible('#signalWarningModal')){await page.locator('#signalWarningPrimary').click();continue;}
  if(await visible('#refuge'))throw new Error('The chosen legal route unexpectedly required emergency recovery: '+JSON.stringify(await observe(page)));
  const index=await page.evaluate(()=>state.index);
  expect(index).toBeLessThan(9);
  if(!seen.has(index)){
   seen.add(index);marks.push({scene:index,elapsedMs:Date.now()-marks[0].startedAt});
   await expect(page.locator('#expeditionOrientation')).toBeVisible();
   if(index===2){
    const summary=page.locator('#expeditionOrientation summary');await summary.focus();await page.keyboard.press('Enter');
    await expect(page.locator('#expeditionSector')).toContainText('Estación Los Héroes');await fits(page,'#expeditionOrientation');await capture(page,testInfo,'day-one-orientation');await summary.click();
   }
  }
  // A discovered crate can pause between the result and the next scene.
  if(await page.evaluate(()=>!!pending)){await page.waitForTimeout(80);continue;}
  // The earned field reward is scheduled after the encounter commits.
  // Observe its availability and wait for the UI instead of racing its timer.
  if(await page.evaluate(()=>fieldDue())){await expect(page.locator('#fieldModal')).toBeVisible();continue;}
  await page.locator(`[data-choice="${choices[index]}"]`).click();
 }
 throw new Error('Day one did not reach its night: '+JSON.stringify(await observe(page)));
}

for(const rescue of [true,false])test(`full first day through UI: ${rescue?'combat, loot and Matías rescue':'technical door and supplies without rescue'}`,async({page},testInfo)=>{
 test.setTimeout(180000);page.setDefaultTimeout(10000);
 const marks=[{startedAt:Date.now(),kind:'automated playback; not human reading duration'}];
 await newGameThroughUI(page);await page.locator('#chooseStory').click();await page.locator('#storyPreludeContinue').click();
 await page.locator('#refugeHelpContinue').click();await page.locator('#starterKit').click();
 const start=await observe(page);expect(start.stats.battles).toBe(0);expect(start.party.map(p=>p.hp)).toEqual([44,40,38]);
 await page.locator('[data-refuge-profile]').first().click();await expect(page.locator('#profileModal')).toBeVisible();await page.locator('#closeProfile').click();
 await depart(page);
 const visited=await firstDay(page,testInfo,rescue,marks);expect(visited).toEqual([0,1,2,3,4,5,6,7,8]);
 const arrived=await observe(page);expect(arrived.index).toBe(9);expect(!!arrived.flags.matiasAtRefuge).toBe(rescue);expect(arrived.flags.pumpAbandoned).toBe(true);
 if(rescue){expect(arrived.stats.wins).toBeGreaterThanOrEqual(1);expect(arrived.stats.damageDealt).toBeGreaterThan(0);expect(arrived.stats.loot).toBeGreaterThan(0);}
 else{expect(arrived.stats.battles).toBe(0);expect(arrived.flags.leftSupplies).toBe(true);}
 await expect(page.locator('#nightText')).toContainText(rescue?'Matías quedó en la enfermería':'Dejaron provisiones junto a Matías');
 await capture(page,testInfo,'day-one-night');
 await resume(page);expect(await observe(page)).toEqual(arrived);
 await page.locator('[data-night-person="noa"]').click();await page.locator('[data-night-reply="regreso"]').click();
 const before=await observe(page);await page.locator('#nightShare').click();const rested=await observe(page);
 expect(rested.food).toBe(before.food-1);expect(rested.water).toBe(before.water-1);expect(rested.stats.rests).toBe(before.stats.rests+1);
 await resume(page);expect(await observe(page)).toEqual(rested);
 await page.locator('#nextDay').click();await expect(page.locator('#refugeTitle')).toHaveText('Antes de la segunda salida');
 await expect(page.locator('#refugeRest')).toBeDisabled();await expect(page.locator('#refugeRejoin')).toBeDisabled();
 const prepared=await observe(page);expect(prepared.party).toEqual(rested.party);expect(prepared.food).toBe(rested.food);expect(prepared.stats.rests).toBe(rested.stats.rests);
 await page.locator('#refugeReturnButton').click();await expect(page.locator('#refugeHelpText')).toHaveText(rested.night.returnAccount);
 await capture(page,testInfo,'day-one-return-account');await page.locator('#refugeHelpContinue').click();
 await expect(page.locator('#refugeReturnButton')).toBeFocused();
 const shop=await page.locator("#tradeBuyList").boundingBox();expect(shop.height,"Trade list retains room for an offer").toBeGreaterThanOrEqual(100);
 const stock=prepared.tradeStock.food;await page.locator('[data-buy-item="food"]').click();
 const purchased=await observe(page);expect(purchased.tradeStock.food).toBe(stock-1);expect(purchased.food).toBe(prepared.food+1);expect(purchased.credits).toBeLessThan(prepared.credits);
 expect((await page.locator('#tradeBuyList').boundingBox()).height,'Purchase feedback keeps the shop accessible').toBeGreaterThanOrEqual(80);
 await capture(page,testInfo,'day-two-preparation');await page.locator('#npcTabArmorer').click();
 await page.locator('#refugeReturnButton').click();await expect(page.locator('#refugeHelpText')).toHaveText(rested.night.returnAccount);await page.keyboard.press('Escape');
 const merchant=await observe(page);await resume(page);expect(await observe(page)).toEqual(merchant);
 await page.locator('#refugeActivities').click();await page.locator('#chooseStory').click();expect(await observe(page)).toEqual(merchant);
 // The second successful inhibitor can pay an existing mission reward.
 // Check preparation invariants before that legitimate reward is earned.
 const left=await depart(page);expect(left.party).toEqual(merchant.party);expect(left.food).toBe(merchant.food);expect(left.water).toBe(merchant.water);expect(left.credits).toBe(merchant.credits);
 const departed=await observe(page);expect(departed.index).toBe(9);expect(departed.refuge.active).toBe(false);
 await expect(page.locator('#choices')).toBeVisible();await expect(page.locator('#expeditionOrientation')).toBeHidden();
 const report=testInfo.outputPath('day-one-run.json');
 await writeFile(report,JSON.stringify({route:rescue?'rescue':'supplies',elapsedMs:Date.now()-marks[0].startedAt,marks,start,arrived,rested,departed},null,2));
 await testInfo.attach('day-one-run',{path:report,contentType:'application/json'});
});
