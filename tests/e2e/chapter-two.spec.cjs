const {test,expect,capture,fits,stageStory}=require('./helpers.cjs');

// A completed chapter-one fixture establishes the entry boundary. All chapter-two
// choices, preparation, saving and resuming below use the real player controls.
async function endingFixture(page){
 await stageStory(page);
 await page.evaluate(()=>{
  state.economyHelpSeen=true;state.logisticsSeen=true;state.index=26;
  state.flags.towerEvidenceCopied=true;state.flags.irenePortable=true;
  resolveNarrativeFinale();
 });
 await expect(page.locator('#finalNextChapter')).toBeVisible();
 await page.locator('#finalNextChapter').click();
 await expect(page.locator('#eventTitle')).toHaveText('Después de la torre');
}
async function choose(page,id){
 const index=await page.evaluate(id=>eventDisplay(events[state.index],state.index).choices.findIndex(o=>o.id===id),id);
 expect(index).toBeGreaterThanOrEqual(0);
 await page.locator(`[data-choice="${index}"]`).click();
 await expect(page.locator('#result')).toBeVisible();
 await page.locator('#advance').click();
}
async function prepare(page){
 await expect(page.locator('#refuge')).toBeVisible();
 if(await page.locator('#refugeRest').isEnabled()){
  await page.locator('#refugeRest').click();await page.locator('#refugeHelpContinue').click();
 }
 if(await page.locator('#refugeRejoin').isEnabled())await page.locator('#refugeRejoin').click();
 await page.locator('#leaveRefuge').click();
 await expect(page.locator('#expeditionReserves')).toContainText('Capítulo 2');
 await page.locator('#confirmLogistics').click();
 await expect(page.locator('#refuge')).toBeHidden();
}
const path=['recover','recognition','depart','pay','visit','accept','share','observe','terms','listen','copy','leave-query','sealed','keep','learn','respect','share','limited','seeds','detour','home','bounded','finish'];
test('La Cisterna uses the existing story UI, restores the visit and completes with an independent community',async({page},info)=>{
 await endingFixture(page);await fits(page,'#stage');await capture(page,info,'chapter-two-entry');
 await choose(page,'prepare');await prepare(page);
 for(const id of path){
  if(await page.evaluate(()=>events[state.index].key)==='occupation'){
   await fits(page,'#eventText');await capture(page,info,'chapter-two-reading');
   const before=await page.evaluate(()=>JSON.stringify(state.cisterna));
   await page.reload();await page.locator('#enterTitle').click();await page.locator('#cinematicSkip').click();await page.locator('#continueGame').click();
   await expect(page.locator('#eventTitle')).toHaveText('Lo que pasó hace treinta años');
   expect(await page.evaluate(()=>JSON.stringify(state.cisterna))).toBe(before);
  }
  await choose(page,id);
 }
 await expect(page.locator('#finalTitle')).toHaveText('Una visita que podrá repetirse');
 await expect(page.locator('#finalWorld')).toContainText('permanece independiente');
 await expect(page.locator('#finalNextChapter')).toBeHidden();
 const result=await page.evaluate(()=>({old:state.campaignProgress.completed[1].kind,now:state.cisterna.resolution.kind,letter:state.cisterna.facts.letterDelivered}));
 expect(result).toEqual({old:'archive',now:'limited',letter:true});
 await page.locator('#finalContinue').click();await expect(page.locator('#chapterAvailability')).toContainText('todavía no están disponibles');await capture(page,info,'chapter-two-summary');
 await page.locator('#summaryActivities').click();await expect(page.locator('#storyActivityStatus')).toContainText('La Cisterna');await page.locator('#chooseStory').click();await expect(page.locator('#summary')).toBeVisible();
});

test('a pending visit offers a real retry and preserves the paid corridor across reload',async({page})=>{
 await endingFixture(page);await choose(page,'prepare');await prepare(page);
 for(const id of ['recover','recognition','depart','pay','leave','pending'])await choose(page,id);
 await expect(page.locator('#finalTitle')).toHaveText('La visita queda pendiente');
 await page.reload();await page.locator('#enterTitle').click();await page.locator('#cinematicSkip').click();await page.locator('#continueGame').click();
 await expect(page.locator('#finalTitle')).toHaveText('La visita queda pendiente');
 await expect(page.locator('#finalNextChapter')).toHaveText('Preparar otra visita');
 await page.locator('#finalNextChapter').click();await prepare(page);
 await expect(page.locator('#eventTitle')).toHaveText('La primera respuesta');
 expect(await page.evaluate(()=>stockCount('battery'))).toBe(0);
 await choose(page,'outside');await choose(page,'accept');await choose(page,'share');
 await expect(page.locator('#eventTitle')).toHaveText('Lo que pueden llevarse');
 expect(await page.evaluate(()=>state.cisterna.facts.cultivationSeen)).toBeUndefined();
});
