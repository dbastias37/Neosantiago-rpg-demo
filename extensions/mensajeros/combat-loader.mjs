// Mount the real Exploration markup and styles, isolated from the courier map CSS.
// No campaign scripts or campaign saves run in this document.
const root = new URL('../../', import.meta.url);
try {
  const response = await fetch(new URL('neosantiago-demo.html', root));
  if (!response.ok) throw Error('No se pudo cargar la interfaz de Exploración.');
  const source = new DOMParser().parseFromString(await response.text(), 'text/html');
  const base = document.createElement('base'); base.href = root.href; document.head.prepend(base);
  for (const node of source.querySelectorAll('style, link[rel="stylesheet"]')) document.head.append(node.cloneNode(true));
  for (const id of ['battle', 'lootModal', 'audioRoutes']) {
    const node = source.getElementById(id);
    if (!node) throw Error('La interfaz de Exploración está incompleta.');
    document.body.append(node.cloneNode(true));
  }
  document.getElementById('combatBoot').remove();
  await import('./combat-adapter.mjs?v=1');
} catch (error) {
  const message = document.createElement('p'); message.setAttribute('role', 'alert'); message.textContent = error.message;
  const retry = document.createElement('button'); retry.textContent = 'Reintentar'; retry.onclick = () => location.reload();
  document.body.replaceChildren(message, retry);
}
