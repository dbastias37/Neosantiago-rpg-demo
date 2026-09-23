// Repeatable local, unthrottled measurement. Not a field-performance score or duration guarantee.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readFile,writeFile,stat,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
const root=resolve(process.env.NEO_STATIC_ROOT||'.'),port=Number(process.env.NEO_PERF_PORT||4175);
const output=resolve(process.env.NEO_PERF_OUTPUT||'test-results/performance.json');
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port),NEO_STATIC_ROOT:root},stdio:'pipe'});
let browser;
try{
 await new Promise((yes,no)=>{server.stdout.once('data',yes);server.once('error',no);server.once('exit',code=>no(Error('server stopped '+code)))});
 browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS||'[]')}:{})});
 const page=await browser.newPage({viewport:{width:1366,height:768}}),requests=[],errors=[];
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>requests.push({url:r.url(),status:r.status(),type:r.request().resourceType(),bodyBytes:Number(r.headers()['content-length']||0)}));
 await page.addInitScript(()=>{window.__neoLongTasks=[];try{new PerformanceObserver(list=>window.__neoLongTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true})}catch{}});
 await page.goto(`http://127.0.0.1:${port}/neosantiago-demo.html`,{waitUntil:'load'});await page.locator('#enterTitle').waitFor({state:'visible'});
 const usable=await page.evaluate(()=>performance.now());await page.waitForLoadState('networkidle');
 const initial=await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd,transferBytes:n.transferSize,bodyBytes:n.encodedBodySize})),resources:performance.getEntriesByType('resource').map(r=>({url:r.name,type:r.initiatorType,transferBytes:r.transferSize,bodyBytes:r.encodedBodySize,duration:r.duration})),longTasks:window.__neoLongTasks,memory:performance.memory?{used:performance.memory.usedJSHeapSize,total:performance.memory.totalJSHeapSize,limit:performance.memory.jsHeapSizeLimit}:null}));
 const initialCDPMetrics=(await cdp.send('Performance.getMetrics')).metrics;
 const initialRequests=[...requests],html=await readFile(resolve(root,'neosantiago-demo.html'),'utf8'),preloadPaths=[...html.matchAll(/<link rel="preload" href="([^"?]+)/g)].map(m=>m[1]);
 const preloads=await Promise.all(preloadPaths.map(async path=>({path,bytes:(await stat(resolve(root,path))).size})));
 const phases={};
 for(const [name,action] of Object.entries({
  cinematic:()=>enterTitleScreen(),
  refuge:()=>{revealCinematicDestination();newGame();clearIntroTyping();state.introCompleted=true;state.storyPreludeSeen=true;state.activity='story';document.querySelectorAll('.overlay,.title-screen').forEach(n=>n.classList.add('hidden'));hideActivities();openRefuge('start');},
  combat:()=>{document.querySelectorAll('.overlay,.title-screen').forEach(n=>n.classList.add('hidden'));startCombat({title:'Performance fixture',enemies:['merodeador','drone'],canFlee:true},{label:'QA fixture'});}
 })){
  const started=await page.evaluate(()=>performance.now());await page.evaluate(action);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));phases[name+'ToTwoFramesMs']=(await page.evaluate(()=>performance.now()))-started;
 }
 const metrics=await cdp.send('Performance.getMetrics');
 const report={label:process.env.NEO_PERF_LABEL||'working-tree',measuredAt:new Date().toISOString(),environment:{browser:browser.version(),viewport:{width:1366,height:768},server:'local static / no compression / no cache',network:'unthrottled',cpu:'unthrottled',note:'Warm OS filesystem, fresh browser context. Network timing includes local read overhead; not representative of Render/mobile service.'},initial:{usableTitleMs:usable,requestCount:initialRequests.length,bodyBytes:initialRequests.reduce((n,r)=>n+r.bodyBytes,0),javascriptBytes:initialRequests.filter(r=>r.type==='script').reduce((n,r)=>n+r.bodyBytes,0),imageRequests:initialRequests.filter(r=>r.type==='image').length,imageBytes:initialRequests.filter(r=>r.type==='image').reduce((n,r)=>n+r.bodyBytes,0),preloads,requests:initialRequests,cdpMetrics:initialCDPMetrics,...initial},sceneFixtures:phases,cdpMetrics:metrics.metrics,errors};
 await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({output,requests:report.initial.requestCount,bytes:report.initial.bodyBytes,js:report.initial.javascriptBytes,usableMs:usable,phases,errors},null,2));
}finally{await browser?.close();server.kill();}
