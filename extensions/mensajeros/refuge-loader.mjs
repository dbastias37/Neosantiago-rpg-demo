// The same markup, styles and portraits as Expedition, without running its campaign.
const root = new URL('../../', import.meta.url);
try {
 const response = await fetch(new URL('neosantiago-demo.html', root));
 if (!response.ok) throw Error('No se pudo cargar el refugio de Expedición.');
 const source = new DOMParser().parseFromString(await response.text(), 'text/html');
 const base = document.createElement('base'); base.href = root.href; document.head.prepend(base);
 for (const node of source.querySelectorAll('style, link[rel="stylesheet"]')) document.head.append(node.cloneNode(true));
 for (const id of ['refuge', 'refugeHelpModal']) {
  const node = source.getElementById(id);
  if (!node) throw Error('El refugio de Expedición está incompleto.');
  document.body.append(node.cloneNode(true));
 }
 document.querySelectorAll('[onerror]').forEach(node => node.removeAttribute('onerror'));
 await import('./refuge-adapter.mjs');
 document.getElementById('refugeBoot').remove();document.getElementById('bootBack').remove();
} catch(error) {
 document.getElementById('refugeBoot').textContent = error.message;
 const retry=document.createElement('button');retry.textContent='Reintentar';retry.onclick=()=>location.reload();document.body.append(retry);
}
