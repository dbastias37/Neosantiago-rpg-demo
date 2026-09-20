// Import the actual Exploration surface. Its campaign runtime never executes here.
const root = new URL('../../', import.meta.url);
try {
  const response = await fetch(new URL('neosantiago-demo.html', root));
  if (!response.ok) throw Error('No se pudo cargar la ficha de Exploración.');
  const source = new DOMParser().parseFromString(await response.text(), 'text/html');
  const base = document.createElement('base'); base.href = root.href; document.head.prepend(base);
  for (const node of source.querySelectorAll('style, link[rel="stylesheet"]')) document.head.append(node.cloneNode(true));
  for (const id of ['profileModal', 'transferModal', 'discardModal', 'itemDetailModal', 'toast', 'audioRoutes']) {
    const node = source.getElementById(id);
    if (!node) throw Error('La ficha de Exploración está incompleta.');
    document.body.append(node.cloneNode(true));
  }
  await import('./profile-adapter.mjs?v=16-credits');
  document.getElementById('profileBoot').remove();
  document.getElementById('bootBack').remove();
} catch (error) {
  document.getElementById('profileBoot').textContent = error.message;
  const retry = document.createElement('button'); retry.textContent = 'Reintentar'; retry.onclick = () => location.reload();
  document.body.append(retry);
}
