const {test,expect,capture,fits,newGameThroughUI,stageStory}=require('./helpers.cjs');

test('real title → cinematic → introduction → refuge → inventory → Encargos map',async({page},testInfo)=>{
 await page.goto('/neosantiago-demo.html');await expect(page.locator('#enterTitle')).toBeVisible();await fits(page,'#enterTitle');await capture(page,testInfo,'01-title');
 await newGameThroughUI(page);await capture(page,testInfo,'02-activities');
 await page.locator('#chooseStory').click();await expect(page.locator('#storyPrelude')).toBeVisible();await page.locator('#storyPreludeContinue').click();
 await expect(page.locator('#refuge')).toBeVisible();await expect(page.locator('#refugeHelpModal')).toBeVisible();await page.locator('#refugeHelpContinue').click();await capture(page,testInfo,'03-refuge-npc');
 await page.locator('#starterKit').click();await page.locator('[data-refuge-profile]').first().click();
 await expect(page.locator('#profileModal')).toBeVisible();await capture(page,testInfo,'04-inventory');await page.locator('#closeProfile').click();
 await page.locator('#npcTabArmorer').click();await expect(page.locator('#npcTabArmorer')).toHaveAttribute('aria-selected','true');
 await page.locator('#refugeActivities').click();await page.locator('#chooseCouriers').click();
 const courier=page.frameLocator('#courierFrame');await expect(courier.locator('#map svg')).toBeVisible();await expect(courier.locator('#location')).toContainText('Los Héroes');
 await courier.locator('[data-help-done]').click();await capture(page,testInfo,'05-courier-map');
 await courier.locator('#catalogButton').click();await expect(courier.locator('#dialog')).toBeVisible();await capture(page,testInfo,'06-assignments');
 await courier.locator('[data-close="dialog"]').first().click();
 await courier.locator('#crewButton').click();const courierProfile=courier.frameLocator('#profileLayer');await expect(courierProfile.locator('#profileModal')).toBeVisible();await capture(page,testInfo,'06b-courier-inventory');await courierProfile.locator('#closeProfile').click();
 await courier.locator('#heroesButton').click();const courierRefuge=courier.frameLocator('#refugeLayer');await expect(courierRefuge.locator('#refuge')).toBeVisible();await courierRefuge.locator('#npcTabArmorer').click();await expect(courierRefuge.locator('#npcTabArmorer')).toHaveAttribute('aria-selected','true');await capture(page,testInfo,'06c-courier-refuge');await courierRefuge.locator('#leaveRefuge').click();
 await page.locator('#courierReturn').click();await expect(page.locator('#activityMenu')).toBeVisible();
});

test('controlled combat fixture uses real actions, portrait selectors and loot inventory',async({page},testInfo)=>{
 await stageStory(page);
 await page.evaluate(()=>{state.party.forEach(p=>p.hunger=100);startCombat({title:'Contacto en el túnel',enemies:['merodeador','drone'],canFlee:true},{label:'QA browser fixture',_decisionChanges:[]});});
 await expect(page.locator('#battle')).toBeVisible();
 if(await page.locator('.stage-card-arrow--enemy.next').isVisible()){const target=await page.evaluate(()=>battleState.target);await page.locator('.stage-card-arrow--enemy.next').click();expect(await page.evaluate(()=>battleState.target)).not.toBe(target);}
 await capture(page,testInfo,'07-combat');
 const before=await page.evaluate(()=>battleState.round);
 await page.locator('[data-action="defend"]').click();await expect.poll(()=>page.evaluate(()=>battleState&&(!battleState.busy||battleState.round>1))).toBeTruthy();
 expect(await page.evaluate(()=>battleState.round)).toBeGreaterThanOrEqual(before);
 // Explicit deterministic fixture: layout/integration coverage, not difficulty or victory balance.
 await page.evaluate(()=>{battleState.enemies.forEach(e=>e.hp=0);beginLootPhase();battleState.looter=0;const enemy=battleState.enemies[0];enemy.looted=true;enemy.loot=[{id:'food',qty:1,status:'pending'}];renderBattle();renderLootModal(0);});
 await expect(page.locator('#lootModal')).toBeVisible();await capture(page,testInfo,'08-loot');
 const food=await page.evaluate(()=>state.party[0].bag.filter(x=>x.id==='food').reduce((n,x)=>n+x.qty,0));
 await page.locator('#takeAllLoot').click();expect(await page.evaluate(()=>state.party[0].bag.filter(x=>x.id==='food').reduce((n,x)=>n+x.qty,0))).toBe(food+1);
 await page.locator('#closeLoot').click();await expect(page.locator('#lootModal')).toBeHidden();
 if(await page.locator('.stage-card-arrow--ally.next').isVisible()){const actor=await page.evaluate(()=>battleState.looter);await page.locator('.stage-card-arrow--ally.next').click();expect(await page.evaluate(()=>battleState.looter)).not.toBe(actor);}
});

test('production courier gate restores a saved detour and accepts the real keypad',async({page},testInfo)=>{
 const {gateSave}=await import('./courier-fixtures.mjs'),fixture=await gateSave();
 await page.addInitScript(({key,save})=>{if(!localStorage.getItem(key))localStorage.setItem(key,save)},fixture);
 await page.goto('/extensions/mensajeros/play.html');
 const gate=page.frameLocator('#gateLayer');await expect(page.locator('#gateLayer')).toBeVisible();
 await expect(gate.locator('button[data-action="start"]')).toBeVisible();await gate.locator('button[data-action="start"]').click();await capture(page,testInfo,'09-gate');
 for(const digit of fixture.answer)await gate.locator(`[data-digit="${digit}"]`).click();
 await gate.locator('[data-action="submit"]').click();await expect(gate.locator('#resultTitle')).toHaveText('Compuerta abierta.');
 await capture(page,testInfo,'10-gate-result');
 const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).run.index,fixture.key);
 await gate.locator('[data-action="cross"]').click();await expect(page.locator('#gateLayer')).toBeHidden();
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).run.index,fixture.key)).toBe(before+1);
 await page.reload();await expect(page.locator('#map svg')).toBeVisible();await expect(page.locator('#gateLayer')).toBeHidden();
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).run.index,fixture.key)).toBe(before+1);
});


test('future network collapse keeps a checkpoint, survives Continue and isolates keyboard input',async({page},testInfo)=>{
 await stageStory(page);
 await page.evaluate(()=>{state.credits=73;NeoCampaignOutcomes.prepare('qa-operation');NeoCampaignOutcomes.checkpoint('qa-operation');state.credits=3;NeoCampaignOutcomes.collapse({id:'qa-network-collapse',operationId:'qa-operation',reason:'network-collapse',irreversible:true,summary:'Colapso irreversible de prueba del pipeline.'});});
 await expect(page.locator('#networkOutcomeTitle')).toHaveText('LA RED CAYÓ');
 const index=await page.evaluate(()=>state.index);await page.keyboard.press('1');expect(await page.evaluate(()=>state.index)).toBe(index);await capture(page,testInfo,'11-network-collapse');
 await page.reload();await page.locator('#enterTitle').click();await page.locator('#cinematicSkip').click();await page.locator('#continueGame').click();
 await expect(page.locator('#networkOutcomeTitle')).toHaveText('LA RED CAYÓ');
 await page.locator('[data-outcome-action="checkpoint"]').click();
 await expect(page.locator('#enterTitle')).toBeVisible();await page.locator('#enterTitle').click();await page.locator('#cinematicSkip').click();await page.locator('#continueGame').click();
 await expect(page.locator('#networkOutcomeTitle')).toHaveCount(0);expect(await page.evaluate(()=>state.credits)).toBe(73);
});
