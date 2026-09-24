const {test,expect,capture,stageStory}=require('./helpers.cjs');

test('el inhibidor muestra once flechas en una fila y mantiene accesible su teclado',async({page},testInfo)=>{
 await stageStory(page);
 // Day three, round three is the longest code in the existing campaign.
 await page.evaluate(()=>{
  state.index=18;
  state.inhibitor.tutorialSeen=true;
  openSignalHack('manual');
  startSignalChallenge();
  signalGameState.round=2;
  beginSignalRound();
  resetSignalRoundTimer();
 });
 await expect(page.locator('#signalRound')).toHaveText('Ronda 3 / 3');
 await expect(page.locator('#signalSequence span')).toHaveCount(11);
 await expect(page.locator('#signalMapPosition')).toHaveText('Paso 1 / 11');

 const layout=await page.evaluate(()=>{
  const screen=document.querySelector('.signal-map-screen');
  const strip=document.querySelector('#signalSequence');
  const arrows=[...strip.children];
  const keys=[...document.querySelectorAll('.signal-pad button')];
  const viewport={width:innerWidth,height:innerHeight};
  const box=node=>{const b=node.getBoundingClientRect();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height}};
  return{viewport,screen:box(screen),strip:box(strip),arrows:arrows.map(box),
   keys:keys.map(box),keyboard:box(document.querySelector('.signal-keyboard')),
   horizontalOverflow:strip.scrollWidth>strip.clientWidth||document.documentElement.scrollWidth>viewport.width};
 });
 expect(layout.horizontalOverflow).toBe(false);
 expect(new Set(layout.arrows.map(a=>Math.round(a.y))).size).toBe(1);
 for(const arrow of layout.arrows){
  expect(arrow.x).toBeGreaterThanOrEqual(layout.strip.x-1);
  expect(arrow.right).toBeLessThanOrEqual(layout.strip.right+1);
 }
 expect(layout.screen.x).toBeGreaterThanOrEqual(0);
 expect(layout.screen.right).toBeLessThanOrEqual(layout.viewport.width+1);
 expect(layout.keyboard.bottom).toBeLessThanOrEqual(layout.viewport.height+1);
 for(const key of layout.keys){
  expect(key.width).toBeGreaterThanOrEqual(44);
  expect(key.height).toBeGreaterThanOrEqual(44);
 }
 await capture(page,testInfo,'inhibidor-mapa-y-teclado');

 const first=await page.evaluate(()=>signalGameState.sequence[0]);
 await page.locator(`[data-signal-key="${first}"]`).click();
 await expect(page.locator('#signalMapPosition')).toHaveText('Paso 2 / 11');
 await expect(page.locator('#signalSequence span.done')).toHaveCount(1);
 const second=await page.evaluate(()=>signalGameState.sequence[1]);
 await page.keyboard.press({up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[second]);
 await expect(page.locator('#signalSequence span.done')).toHaveCount(2);
});
