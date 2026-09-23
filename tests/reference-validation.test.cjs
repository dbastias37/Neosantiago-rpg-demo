const {test}=require('node:test'),assert=require('node:assert/strict');
const {mkdtemp,mkdir,writeFile,rm}=require('node:fs/promises');
const {tmpdir}=require('node:os'),{join}=require('node:path');
test('nested HTML/CSS and iframe URLs resolve at their document, never a coincidental root file',async()=>{
 const {inspectReferences}=await import('../scripts/validate-references.mjs'),root=await mkdtemp(join(tmpdir(),'neo-references-'));
 try{
  await mkdir(join(root,'nested'));await writeFile(join(root,'shared.css'),'');await writeFile(join(root,'nested/page.html'),'<link href="shared.css"><iframe src="missing.html"></iframe><script src="../valid.mjs"></script>');await writeFile(join(root,'valid.mjs'),'');
  const refs=await inspectReferences(root);assert.ok(refs.some(r=>r.path==='nested/shared.css'&&!r.exists));assert.ok(refs.some(r=>r.path==='nested/missing.html'&&!r.exists));assert.ok(refs.some(r=>r.path==='valid.mjs'&&r.exists));
 }finally{await rm(root,{recursive:true,force:true});}
});
test('old missing audio does not authorize a new source reference to that debt',async()=>{
 const {newMissingReferences}=await import('../scripts/validate-references.mjs'),old={source:'neosantiago-demo.html',reference:'audio/combat/shot.mp3',path:'audio/combat/shot.mp3',exists:false},fresh={...old,source:'new-ui.js'};
 assert.deepEqual(newMissingReferences([old,fresh],{missing:[old]}),[fresh]);
});
