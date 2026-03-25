// Mi Espacio ✨ — Service Worker v1
// Maneja notificaciones push y alarmas en segundo plano

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Recibe mensajes desde la app principal
self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE_NOTIFS') {
    // Guardamos el estado para poder revisar en el fetch
    self.appState = e.data.payload;
  }
});

// Notificación directa (llamada desde la app cuando está abierta)
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'Mi Espacio ✨', {
      body: data.body || '',
      icon: data.icon || '✨',
      badge: '/icon-badge.png',
      tag: data.tag || 'mi-espacio',
      data: data,
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length) { clients[0].focus(); return; }
      self.clients.openWindow('/');
    })
  );
});
