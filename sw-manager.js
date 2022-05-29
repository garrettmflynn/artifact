
// ------------- Register the Service Worker -------------
const swUrl = "./sw.js";
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
      navigator.serviceWorker && navigator.serviceWorker.register(swUrl).catch(e => alert('Error during service worker registration:', e));
  });
}
  
export async function unregister() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      await registration.unregister();
    }
}
