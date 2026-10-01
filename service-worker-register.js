// Register service worker for offline PWA functionality

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered:', reg);
        document.getElementById('swStatus').textContent = '✓ Service Worker active (offline capable)';
        
        // Check for updates periodically
        setInterval(() => {
          reg.update();
        }, 60000);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
        document.getElementById('swStatus').textContent = '⚠ Service Worker not available (some features may be limited)';
      });
  });
}

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.style.display = 'block';
  }
});

const installBtn = document.getElementById('installBtn');
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      deferredPrompt = null;
      installBtn.style.display = 'none';
    }
  });
}

window.addEventListener('appinstalled', () => {
  console.log('[PWA] App installed successfully');
});

// Sync button for manual data refresh
const syncBtn = document.getElementById('syncBtn');
if (syncBtn) {
  syncBtn.addEventListener('click', () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.sync.register('sync-marpol-data').then(() => {
          console.log('[PWA] Sync registered');
          syncBtn.textContent = '↺ Syncing...';
          setTimeout(() => {
            syncBtn.textContent = '↺ Sync data';
          }, 2000);
        });
      });
    } else {
      console.log('[PWA] Sync not available - checking for updates manually');
      syncBtn.textContent = '✓ Ready';
      setTimeout(() => {
        syncBtn.textContent = '↺ Sync data';
      }, 1500);
    }
  });
}
