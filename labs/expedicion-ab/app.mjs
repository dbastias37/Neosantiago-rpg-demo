const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=path=>new URL('../../'+path,import.meta.url).href;
let data,scenarioIndex=0,selected=null;
let variant=new URL(location.href).searchParams.get('variante')==='b'?'b':'a';
const scene=()=>data.scenarios[scenarioIndex];
function picture(s){return `<figure class="scene-art"><img src="${asset(s.image)}" alt="${esc(s.location)}" decoding="async"><figcaption><span class="eyebrow">UBICACIÓN ACTUAL</span><strong>${esc(s.location)}</strong><span>${esc(s.chapter)}</span></figcaption></figure>`;}
function goal(){return `<section class="goal"><span class="eyebrow">OBJETIVO ACTIVO</span><strong>${esc(data.goal.title)}</strong><p>${esc(data.goal.text)}</p></section>`;}
function team(){return `<section class="team"><h3>Estado del grupo</h3><div class="members">${data.group.map(p=>`<article class="member"><img src="${asset(p.image)}" alt="${esc(p.name)}" loading="lazy"><div><strong>${esc(p.name)}</strong><small>${esc(p.role)}</small><div class="vital"><span>HP</span><meter min="0" max="${p.maxHp}" value="${p.hp}" aria-label="Salud de ${esc(p.name)}">${p.hp}/${p.maxHp}</meter><b>${p.hp}/${p.maxHp}</b></div><span class="energy">Energía ${p.energy}%</span></div></article>`).join('')}</div></section>`;}
function supplies(){return `<section class="supplies"><h3>Recursos críticos</h3><dl>${data.supplies.map(r=>`<div><dt>${esc(r.name)}</dt><dd>${r.value}</dd></div>`).join('')}</dl><p>Moral del grupo <strong>${data.morale}%</strong></p></section>`;}
function narrative(s){return `<article class="narrative"><div class="entry-meta"><span class="eyebrow">${esc(s.type)}</span><span class="entry-number">REGISTRO ${String(s.index+1).padStart(2,'0')} / ${data.total}</span></div><h1>${esc(s.title)}</h1><div class="story"><p>${esc(s.text)}</p></div></article>`;}
function choices(s){return `<section class="decisions" aria-labelledby="choicesTitle"><div class="decision-label"><h2 id="choicesTitle">¿Cómo actúa el grupo?</h2><span>Selecciona una decisión</span></div><div class="choice-list">${s.choices.map((c,i)=>`<button class="choice ${selected===i?'selected':''}" data-choice="${i}" aria-pressed="${selected===i}" aria-haspopup="dialog"><span class="choice-num">${String(i+1).padStart(2,'0')}</span><span class="choice-copy"><strong>${esc(c.label)}</strong><span>${esc(c.hint)}</span><span class="choice-terms"><b>${esc(c.cost||'Sin coste indicado')}</b>${c.requirements.length?`<small>Requiere ${esc(c.requirements.join(' · '))}</small>`:''}</span></span><span class="choice-arrow" aria-hidden="true">›</span></button>`).join('')}</div></section>`;}
function render(){
 const s=scene();document.body.dataset.variant=variant;
 document.querySelectorAll('[data-variant]').forEach(b=>{if(b.tagName==='BUTTON')b.setAttribute('aria-pressed',String(b.dataset.variant===variant));});
 $('description').textContent=variant==='a'?'A · Relato y decisiones en una bitácora, con el equipo al costado.':'B · Escena panorámica, relato al lado y decisiones en una franja inferior.';
 const head=`<header class="expedition-head"><div><span class="eyebrow">CAZADORES Y EXPLORADORES</span><strong>Expedición / Línea 1</strong></div><div class="head-instruments"><span>DÍA ${String(s.day).padStart(2,'0')}<b>${esc(s.time)}</b></span><span>AMENAZA<b>${data.threat}%</b></span></div></header>`;
 const body=variant==='a'?`<div class="a-layout"><aside class="support">${picture(s)}${goal()}${team()}${supplies()}</aside><div class="reading">${narrative(s)}${choices(s)}</div></div>`:`<div class="b-layout">${picture(s)}<div class="reading">${narrative(s)}${goal()}</div></div>${choices(s)}<div class="status-deck">${team()}${supplies()}</div>`;
 $('preview').innerHTML=`<div class="expedition-frame">${head}${body}<footer class="entry-footer"><span>LA SEÑAL / DÍA ${s.day}</span><span>Situación ${s.index+1} de ${data.total}</span></footer></div>`;
}
function showDecision(index){
 selected=index;render();const c=scene().choices[index];
 const explanation=c.outcomes?'<p class="preview-note">Esta decisión tiene una prueba. Puedes revisar sus posibles resultados; aquí no se realiza una tirada.</p>':c.combat?'<p class="preview-note">Esta decisión inicia un combate en la campaña. La prueba de interfaz termina en este detalle.</p>':'<p class="preview-note">Vista previa de la consecuencia escrita. En esta prueba no se descuentan ni se entregan recursos.</p>';
 const outcome=c.outcomes?Object.entries(c.outcomes).map(([key,o])=>`<details class="outcome"><summary>${key==='success'?'Si resulta':'Si falla'} · ${esc(o.title)}</summary><p>${esc(o.text)}</p></details>`).join(''):c.result?`<section class="result-copy"><span class="eyebrow">CONSECUENCIA</span><h3>${esc(c.result.title)}</h3><p>${esc(c.result.text)}</p></section>`:c.combat?`<section class="result-copy"><span class="eyebrow">CONTACTO HOSTIL</span><h3>${esc(c.combat.title)}</h3><p>${esc(c.combat.text)}</p></section>`:'';
 $('decisionContent').innerHTML=`<h2 id="decisionTitle">${esc(c.label)}</h2><p class="decision-hint">${esc(c.hint)}</p><div class="terms"><strong>${esc(c.cost)}</strong>${c.requirements.length?`<p>Requiere ${esc(c.requirements.join(' · '))}</p>`:''}</div>${explanation}${outcome}`;
 $('decision').showModal();$('closeDecision').focus();
}
function setVariant(next){variant=next;render();const url=new URL(location.href);url.searchParams.set('variante',variant);history.replaceState(null,'',url);}
document.querySelectorAll('button[data-variant]').forEach(b=>b.onclick=()=>{if(data)setVariant(b.dataset.variant);});
$('device').onclick=()=>{const active=document.body.classList.toggle('mobile-preview');$('device').setAttribute('aria-pressed',String(active));$('device').textContent=active?'Vista escritorio':'Vista móvil';};
$('scenario').onchange=e=>{scenarioIndex=Number(e.target.value);selected=null;render();};
$('preview').onclick=e=>{const button=e.target.closest('[data-choice]');if(button)showDecision(Number(button.dataset.choice));};
$('closeDecision').onclick=$('returnDecision').onclick=()=>$('decision').close();
$('decision').addEventListener('close',()=>$('preview').querySelector(`[data-choice="${selected}"]`)?.focus({preventScroll:true}));
try{const response=await fetch(new URL('data.json',import.meta.url));if(!response.ok)throw Error('Carga fallida');data=await response.json();$('scenario').innerHTML=data.scenarios.map((s,i)=>`<option value="${i}">${esc(s.title)}</option>`).join('');$('scenario').disabled=false;render();}catch{$('preview').innerHTML='<p role="alert">No se pudo abrir la prueba. Recarga la página para volver a intentarlo.</p>';}
