const {defineConfig}=require('playwright/test');
const sizes=[[360,800],[390,844],[412,915],[915,412],[768,1024],[1366,768],[1920,1080]];
module.exports=defineConfig({
 testDir:'./tests/e2e',timeout:60000,expect:{timeout:10000},fullyParallel:false,
 forbidOnly:!!process.env.CI,retries:process.env.CI?1:0,workers:2,
 reporter:[['list'],['html',{open:'never'}]],outputDir:'test-results',
 use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure',
  launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:process.env.PLAYWRIGHT_CHROMIUM_ARGS?JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS):[]}:{}},
 projects:sizes.map(([width,height])=>({name:`chromium-${width}x${height}`,use:{viewport:{width,height},hasTouch:width<1000}})),
 webServer:{command:'node scripts/serve.mjs',url:'http://127.0.0.1:4173/neosantiago-demo.html',reuseExistingServer:!process.env.CI,timeout:15000}
});
