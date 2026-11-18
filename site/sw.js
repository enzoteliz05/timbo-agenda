// TIMBÓ Agenda — service worker mínimo: instalación, pantalla sin conexión y avisos.
// No guarda datos de la agenda en caché (siempre se leen del servidor).
const OFFLINE = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TIMBÓ Agenda</title><body style="margin:0;font-family:system-ui;background:#173B2A;color:#fff;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px">
<div><h1 style="font-size:22px">TIMBÓ Agenda</h1><p>Sin conexión a internet.<br>La agenda se mostrará cuando vuelva la conexión.</p>
<button onclick="location.reload()" style="font:inherit;padding:12px 18px;border-radius:12px;border:0;background:#fff;color:#173B2A;font-weight:600">Reintentar</button></div></body></html>`;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).catch(() => new Response(OFFLINE, { headers: { "content-type": "text/html; charset=utf-8" } })));
  }
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow("./#proximos");
  })());
});
// Preparado para avisos push en una etapa posterior (texto genérico, sin nombres).
self.addEventListener("push", (e) => {
  e.waitUntil(self.registration.showNotification("TIMBÓ Agenda", {
    body: "Hay novedades en la agenda. Abrí la app para ver el detalle.",
    icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: "timbo"
  }));
});
