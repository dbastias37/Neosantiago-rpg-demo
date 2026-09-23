// Local QA server: serves only regular files inside the selected repository root.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve(process.env.NEO_STATIC_ROOT || '.'), port=Number(process.env.PORT || 4173);
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg','.ogg':'audio/ogg','.woff2':'font/woff2'};
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost'), name=decodeURIComponent(url.pathname==='/'?'/neosantiago-demo.html':url.pathname), file=resolve(root,'.'+name);
  if(!file.startsWith(root+sep)||name.split('/').some(x=>x.startsWith('.'))){res.writeHead(403);res.end();return;}
  if(!(await stat(file)).isFile())throw Error('Not a file');
  const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`NeoSantiago QA: http://127.0.0.1:${port}`));
