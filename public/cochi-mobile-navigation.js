/* CO-CHI card navigation: preserve existing view handlers and permission checks. */
(function(){
 const sections=[
 ['Gestión comercial','👥','Fichas, clientes, dispositivos y créditos',['accounts','clients','devices','credits']],
 ['Promociones y accesos','★','Promociones, demos y acceso adulto',['promotions','demos','adults']],
 ['Contenido y reproducción','▤','Edición, fuentes y reproducción',['content','sources','resolver']],
 ['Administración','⚙','Seguridad y diseño',['security','appearance']]
 ];
 const home=document.getElementById('cochiMobileHome'),grid=document.getElementById('cochiMobileGrid'),search=document.getElementById('cochiMobileSearch');
 if(!home||!grid)return;
 let selected=-1;
 function nav(id){return document.querySelector('.sidebar .nav-btn[data-view="'+id+'"]')}
 function allowed(id){const el=nav(id);return !!el&&!el.classList.contains('hidden')&&!el.closest('.hidden')&&!el.classList.contains('disabled')&&getComputedStyle(el).display!=='none'}
 function tile(title,desc,action){const b=document.createElement('button');b.type='button';b.className='cochi-mobile-tile';const h=document.createElement('b'),s=document.createElement('small');h.textContent=title;s.textContent=desc;b.append(h,s);b.addEventListener('click',action);return b}
 function draw(){const q=(search?.value||'').toLocaleLowerCase('es');grid.replaceChildren();
 const entries=selected<0?sections.filter(x=>x[3].some(allowed)).map((x,i)=>({title:x[1]+' '+x[0],desc:x[2],action:()=>{selected=sections.indexOf(x);draw()}})):
 sections[selected][3].filter(allowed).map(id=>({title:nav(id).textContent.trim(),desc:'Abrir herramienta',action:()=>{nav(id).click();home.classList.add('cochi-mobile-hidden');sync()}}));
 const back=home.querySelector('.cochi-card-return');if(back)back.hidden=selected<0;
 entries.filter(x=>(x.title+' '+x.desc).toLocaleLowerCase('es').includes(q)).forEach(x=>grid.append(tile(x.title,x.desc,x.action)));
 }
 const back=document.createElement('button');back.type='button';back.className='cochi-card-return';back.textContent='← Volver a categorías';back.addEventListener('click',()=>{selected=-1;if(search)search.value='';draw()});home.insertBefore(back,grid);
 const main=document.querySelector('#appView .main');const returnBtn=document.createElement('button');returnBtn.type='button';returnBtn.className='cochi-mobile-back';returnBtn.textContent='← Volver al inicio';returnBtn.addEventListener('click',()=>{home.classList.remove('cochi-mobile-hidden');selected=-1;draw();sync();window.scrollTo({top:0,behavior:'smooth'})});main?.prepend(returnBtn);
 function sync(){returnBtn.style.display=home.classList.contains('cochi-mobile-hidden')?'block':'none'}
 search?.addEventListener('input',draw);document.getElementById('newAdminMobileBtn')?.addEventListener('click',()=>document.getElementById('newAdminBtn')?.click());
 const sidebar=document.querySelector('.sidebar');if(sidebar)new MutationObserver(()=>{if(!home.classList.contains('cochi-mobile-hidden'))draw()}).observe(sidebar,{subtree:true,attributes:true,attributeFilter:['class']});
 const app=document.getElementById('appView');if(app)new MutationObserver(()=>{if(!app.classList.contains('hidden')&&!home.classList.contains('cochi-mobile-hidden'))draw()}).observe(app,{attributes:true,attributeFilter:['class']});
 draw();sync();
})();