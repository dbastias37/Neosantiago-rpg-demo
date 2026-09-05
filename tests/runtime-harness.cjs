const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
// Minimal DOM/timer double: exercises game state, not browser layout or rendering.
const root = process.env.NEOSANTIAGO_REPO || path.resolve(__dirname, '..');
function boot(storage = new Map()) {
  const html = fs.readFileSync(path.join(root,'neosantiago-demo.html'),'utf8');
  const nodes = new Map(), listeners = {}, timers = new Map(); let timerId=0;
  function element(id='',classes='') {
    const set = new Set(classes.split(/\s+/).filter(Boolean));
    const e={id,tagName:'DIV',dataset:{},style:{setProperty(){}},textContent:'',innerHTML:'',children:[],value:'',scrollTop:0,disabled:false,
      classList:{contains:x=>set.has(x),add:(...xs)=>xs.forEach(x=>set.add(x)),remove:(...xs)=>xs.forEach(x=>set.delete(x)),toggle(x,on){on=on===undefined?!set.has(x):on;on?set.add(x):set.delete(x);return on;}},
      addEventListener(type,fn){(this.listeners ||= {})[type] ||= [];this.listeners[type].push(fn)},
      setAttribute(k,v){this[k]=v},getAttribute(k){return this[k]},removeAttribute(k){delete this[k]},
      querySelector(){return element()},querySelectorAll(){return []},focus(){doc.activeElement=this},pause(){},play(){return Promise.resolve()},load(){},appendChild(){},remove(){},contains(){return false},closest(){return null},getBoundingClientRect(){return {width:390,height:844,top:0,left:0}}};
    Object.defineProperty(e,'parentNode',{get(){return element()}});return e;
  }
  for(const tag of html.matchAll(/<[^>]+\bid="([^"]+)"[^>]*>/g)) nodes.set(tag[1],element(tag[1],(tag[0].match(/class="([^"]*)"/)||[])[1]||''));
  nodes.get('audioRoutes').textContent=html.match(/<script id="audioRoutes"[^>]*>([\s\S]*?)<\/script>/)[1];
  const doc={getElementById(id){if(!nodes.has(id))throw Error('Missing DOM id '+id);return nodes.get(id)},querySelectorAll(){return []},querySelector(){return element()},createElement:()=>element(),body:element(),documentElement:element(),hidden:false,addEventListener(type,fn){(listeners[type] ||= []).push(fn)}};
  const ctx={console,document:doc,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},setTimeout(fn,ms){timers.set(++timerId,{fn,ms});return timerId},setInterval(fn,ms){timers.set(++timerId,{fn,ms,interval:true});return timerId},clearTimeout:id=>timers.delete(id),clearInterval:id=>timers.delete(id),getComputedStyle(){return {backgroundImage:'none'}},requestAnimationFrame(){},Audio:function(){return element()},Image:function(){return element()},navigator:{},location:{search:'',hash:''},matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(){},performance:{now:()=>0},URL,Blob};
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  for(const s of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if(s[1].includes('application/json'))continue;
    const src=(s[1].match(/src="([^"?]+)/)||[])[1];
    vm.runInContext(src?fs.readFileSync(path.join(root,src),'utf8'):s[2],ctx,{filename:src||'inline.js'});
  }
  return {ctx,nodes,listeners,timers,storage,run:code=>vm.runInContext(code,ctx)};
}
module.exports={boot,root};
if(require.main===module){const app=boot();console.log('Runtime boot OK:',app.ctx.events.length,'events;',Object.keys(app.ctx.routeNarrativeDefs).length,'routes');}

