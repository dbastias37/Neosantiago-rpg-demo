const {test:base,expect}=require('playwright/test');
const debt=require('../../docs/v0.3/reference-debt.json');
const knownAudio=new Set(debt.missing.filter(x=>x.path.startsWith('audio/')).map(x=>'/'+x.path));
function pathOf(url){try{return decodeURIComponent(new URL(url).pathname)}catch{return ''}}
const test=base.extend({
 page:async({page},use,testInfo)=>{
  const errors=[],known=[];
  page.on('pageerror',error=>errors.push(`Uncaught: ${error.message}`));
  page.on('console',message=>{if(message.type()!=='error')return;const path=pathOf(message.location().url);if(knownAudio.has(path)&&/404|Failed to load resource/.test(message.text()))known.push({path,message:message.text()});else errors.push(`Console: ${message.text()} (${message.location().url})`)});
  page.on('response',response=>{if(response.status()<400)return;const path=pathOf(response.url());if(knownAudio.has(path)&&response.status()===404)known.push({path,status:404});else errors.push(`HTTP ${response.status()}: ${response.url()}`)});
  await use(page);
  await testInfo.attach('browser-health',{body:JSON.stringify({errors,inheritedMissingAudio:known},null,2),contentType:'application/json'});
  expect(errors,'No unexpected console, JavaScript or HTTP errors').toEqual([]);
 }
});
async function capture(page,testInfo,name){await page.screenshot({path:testInfo.outputPath(name+'.png'),fullPage:true,animations:'disabled'});}
async function fits(page,selector){const box=await page.locator(selector).boundingBox();expect(box,selector+' exists').toBeTruthy();const v=page.viewportSize();expect(box.x,selector+' left').toBeGreaterThanOrEqual(-1);expect(box.x+box.width,selector+' right').toBeLessThanOrEqual(v.width+1);}
async function newGameThroughUI(page){
 await page.goto('/neosantiago-demo.html');await expect(page.locator('#enterTitle')).toBeVisible();await page.locator('#enterTitle').click();
 await expect(page.locator('#cinematicIntro')).toBeVisible();await page.locator('#cinematicSkip').click();
 await expect(page.locator('#gameIntro')).toBeVisible();
 for(let i=0;i<12&&await page.locator('#gameIntro').isVisible();i++){
  if(await page.locator('#introReveal').isVisible())await page.locator('#introReveal').click();
  await page.locator('#introNext').click();
 }
 await expect(page.locator('#activityMenu')).toBeVisible();
}
async function stageStory(page){
 await page.goto('/neosantiago-demo.html');
 await page.evaluate(()=>{
  newGame();clearIntroTyping();state.introCompleted=true;state.storyPreludeSeen=true;state.starterKitGiven=true;state.activity='story';state.refuge.active=false;
  document.querySelectorAll('.overlay,.title-screen').forEach(n=>n.classList.add('hidden'));hideActivities();render();
 });
}
module.exports={test,expect,capture,fits,newGameThroughUI,stageStory};
