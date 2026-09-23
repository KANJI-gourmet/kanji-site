(function(){
  const id = window.KANJI_CONFIG?.GA_MEASUREMENT_ID;
  if(!id || id.startsWith('PASTE_')) return;
  const s=document.createElement('script'); s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id); document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments)};
  gtag('js', new Date()); gtag('config', id);
  window.kanjiTrack=(name,params={})=>gtag('event',name,params);
})();
