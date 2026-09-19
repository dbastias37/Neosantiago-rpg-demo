// Market returns use the physical corridors in the assignment network.
// Return travel remains available from a saved location, even before its contacts
// are introduced, so migration and abandonment cannot strand a team.
// In particular, the destroyed Baquedano–Los Leones connection is never added.
export function reversePath(path) {
 const tokens=path.match(/[MLQHV]|-?\d+(?:\.\d+)?/g),segments=[];let i=0,point;
 while(i<tokens.length){
  const command=tokens[i++],from=point;
  if(command==='M'){point=[+tokens[i++],+tokens[i++]];continue;}
  if(command==='Q'){const control=[+tokens[i++],+tokens[i++]];point=[+tokens[i++],+tokens[i++]];segments.push({from,to:point,control});}
  else{point=command==='L'?[+tokens[i++],+tokens[i++]]:command==='H'?[+tokens[i++],point[1]]:[point[0],+tokens[i++]];segments.push({from,to:point});}
 }
 return 'M'+point.join(' ')+segments.reverse().map(s=>s.control?'Q'+s.control.join(' ')+' '+s.from.join(' '):'L'+s.from.join(' ')).join('');
}
export function prepareJourneys(data) {
 const graph=new Map(Object.keys(data.nodes).map(id=>[id,new Map()]));
 for(const route of Object.values(data.routes))for(const edge of route.edges){
  const existing=graph.get(edge.from).get(edge.to);
  if(!existing||edge.minutes<existing.minutes){
   graph.get(edge.from).set(edge.to,{...edge});
   graph.get(edge.to).set(edge.from,{...edge,from:edge.to,to:edge.from,...(edge.path?{path:reversePath(edge.path)}:{})});
  }
 }
 data.journeys={};
 for(const origin of graph.keys()){
  if(origin==='heroes')continue;
  const queue=[{node:origin,edges:[],minutes:0}],visited=new Set();let edges;
  while(queue.length){
   queue.sort((a,b)=>a.minutes-b.minutes);const next=queue.shift();if(visited.has(next.node))continue;visited.add(next.node);
   if(next.node==='heroes'){edges=next.edges;break;}
   for(const edge of graph.get(next.node).values())if(!visited.has(edge.to))queue.push({node:edge.to,edges:[...next.edges,edge],minutes:next.minutes+edge.minutes});
  }
  if(!edges)throw Error('Sin recorrido a Los Héroes desde '+origin);
  const id='market-'+origin,route='journey-'+origin;
  data.routes[route]={id:route,nodes:[origin,...edges.map(e=>e.to)],edges};
  data.journeys[id]={id,type:'travel',origin,route,issuer:'Los Mensajeros',name:'Viaje a Los Héroes',recipient:'Mara y el Armero',portrait:'../../characters/mara-trader.webp',cargo:{},issued:{},test_loadout:{},summary:'Recorre los andenes hasta Los Héroes. El mercado abre al llegar; en el camino puede haber encuentros, combates y saqueo.'};
 }
 return data;
}

// Existing encounters have already paid their old leg. Keep them at their
// destination, including actors, loot and RNG, and expand only future travel.
export function migrateNetworkSave(data,text) {
 const world=JSON.parse(text);
 if(world?.contentVersion!=='2026-09-18.production.1')return text;
 const positions={'adasme-01':[0,12,13,14,15,16,28],'jimenez-01':[0,12,13]};
 function migrate(run,id){
  const map=positions[id];if(!run||!map)return;
  const edgeIndex=n=>map[Number(n)+1]-1;
  run.index=run.pending?edgeIndex(run.index):map[run.index];
  if(run.pending){const edge=data.routes[data.missions[id].route].edges[run.index];Object.assign(run.pending,{edgeIndex:run.index,from:edge.from,to:edge.to});}
  if(run.rolls)run.rolls=Object.fromEntries(Object.entries(run.rolls).map(([i,roll])=>[edgeIndex(i),roll]));
  if(run.rested)run.rested=run.rested.map(i=>map[i]);
  if(run.status!=='completed')run.timeLimit=data.missions[id].time_limit;
  if(run.checkpoint?.snapshot)migrate(run.checkpoint.snapshot,id);
 }
 if(world.run)migrate(world.run,world.run.mission);
 world.contentVersion=data.content_version;
 return JSON.stringify(world);
}
