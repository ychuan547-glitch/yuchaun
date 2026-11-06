const CACHE='suilian-offline-help-v1';
const PUBLIC_FILES=['/offline.html','/icon-192.png','/icon-512.png','/icon-maskable-512.png','/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PUBLIC_FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('suilian-offline-help-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    // Never cache navigation URLs: email verification/reset links may contain tokens.
    event.respondWith(fetch(request).catch(async()=>await caches.match('/offline.html')||Response.error()));
  }else if(PUBLIC_FILES.includes(url.pathname)&&!url.search){
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
  }
});
