(() => {
 const container = document.querySelector('#footprint-map');
 if (!container) return;
 const section = container.closest('section');
 const help = section.querySelector('.map-help');
 const cities = JSON.parse(document.querySelector('#footprint-data').textContent);
 const start = () => {
  const map = L.map(container,{scrollWheelZoom:false,minZoom:0,maxZoom:15,zoomSnap:.25});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,noWrap:true,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  const icon = L.divIcon({className:'footprint-pin',html:'<span></span>',iconSize:[22,22],iconAnchor:[11,11]});
  const points = cities.map(city => [city.lat,city.lng]);
  const markers = cities.map((city,i) => {
   const content = document.createElement('div');
   const title = document.createElement('strong');title.textContent=city.name;
   const sub = document.createElement('small');sub.textContent=city.english;
   content.append(title,document.createElement('br'),sub);
   return L.marker(points[i],{icon,title:city.name,alt:city.name,keyboard:true}).addTo(map).bindPopup(content);
  });
  const fit = region => {
   map.closePopup();
   if(region==='all'){map.fitBounds([[-55,-180],[78,180]],{padding:[12,12],maxZoom:2.5});return;}
   const subset=points.filter((p,i)=>region==='america'?cities[i].lng<0:cities[i].lng>=0);
   map.fitBounds(subset,{padding:[40,40],maxZoom:5});
  };
  fit('all');section.querySelector('.map-regions').hidden=false;
  section.querySelectorAll('[data-map-region]').forEach(button=>button.addEventListener('click',()=>fit(button.dataset.mapRegion)));
  section.querySelector('select').addEventListener('change',event=>{
   if(event.target.value==='')return;
   const i=Number(event.target.value);map.setView(points[i],10);markers[i].openPopup();
   help.textContent=`${cities[i].name} · ${cities[i].english} — 点击“全部标点”返回总览。`;
  });
  if(window.ResizeObserver)new ResizeObserver(()=>map.invalidateSize()).observe(container);
  container.dataset.markerCount=String(markers.length);
 };
 if(window.L){start();return;}
 const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';script.onload=start;
 script.onerror=()=>{help.textContent='地图暂时无法加载，请稍后刷新。城市：'+cities.map(c=>c.name).join('、');};
 document.head.append(script);
})();