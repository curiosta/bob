/* bob.curiosta.com: keep Leaflet maps from trapping page scroll on touch screens.
   Touch: one-finger swipes scroll the page; tap the overlay to pan/zoom, "Done" (or scrolling the
   map out of view) hands the page back. Mouse: wheel zoom stays off, drag works as before. */
window.bobMapGuard=function(m){
  var c=m.getContainer(),mq=window.matchMedia&&matchMedia('(hover: none) and (pointer: coarse)');
  if(!(mq&&mq.matches))return;
  m.dragging.disable();if(m.tap)m.tap.disable();
  var o=document.createElement('button');o.type='button';o.className='map-guard';
  o.innerHTML='<span>Tap to explore the map</span>';
  var d=document.createElement('button');d.type='button';d.className='map-done';d.textContent='Done';d.hidden=true;
  c.appendChild(o);c.appendChild(d);
  L.DomEvent.disableClickPropagation(o);L.DomEvent.disableClickPropagation(d);
  function on(){m.dragging.enable();o.hidden=true;d.hidden=false;c.classList.add('map-live');}
  function off(){m.dragging.disable();o.hidden=false;d.hidden=true;c.classList.remove('map-live');}
  o.addEventListener('click',on);d.addEventListener('click',off);
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){if(e.intersectionRatio<.35&&o.hidden)off();});},{threshold:[0,.35]}).observe(c);
};
