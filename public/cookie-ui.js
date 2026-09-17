'use strict';

(() => {
  const ROOT_CLASS='cochi-cookie-tools';

  function parseHeaders(text){
    const out={},raw=String(text||'').trim();
    if(!raw)return out;
    if(raw.startsWith('{')){try{const j=JSON.parse(raw);if(j&&typeof j==='object'&&!Array.isArray(j))return j;}catch{}}
    for(const line0 of raw.split(/\r?\n/)){
      const line=line0.trim();if(!line)continue;
      let i=line.indexOf(':');if(i<=0)i=line.indexOf('=');if(i<=0)continue;
      const k=line.slice(0,i).trim(),v=line.slice(i+1).trim();if(k&&v)out[k]=v;
    }
    return out;
  }
  function getHeader(headers,name){
    const lk=name.toLowerCase();for(const [k,v] of Object.entries(headers||{}))if(k.toLowerCase()===lk)return String(v||'');return '';
  }
  function replaceCookieHeader(text,cookie){
    const raw=String(text||'');
    if(raw.trim().startsWith('{')){
      try{const j=JSON.parse(raw);if(j&&typeof j==='object'&&!Array.isArray(j)){for(const k of Object.keys(j))if(k.toLowerCase()==='cookie')delete j[k];if(cookie)j.Cookie=cookie;return JSON.stringify(j,null,2);}}catch{}
    }
    const lines=raw.split(/\r?\n/),out=[];let replaced=false;
    for(const line of lines){
      if(/^\s*Cookie\s*[:=]/i.test(line)){if(!replaced&&cookie)out.push(`Cookie: ${cookie}`);replaced=true;}else out.push(line);
    }
    if(!replaced&&cookie){if(out.length&&out[out.length-1].trim())out.push('');out.push(`Cookie: ${cookie}`);}
    return out.join('\n').replace(/^\s*\n/,'').trimEnd();
  }
  function sourceNumber(row){
    const title=row.querySelector('.playback-source-row-head strong')?.textContent||'FUENTE';return title.trim();
  }
  function setStatus(el,text,kind=''){
    el.textContent=text||'';el.className='cochi-cookie-status'+(kind?` ${kind}`:'');
  }
  function enhance(row){
    if(row.querySelector(`.${ROOT_CLASS}`))return;
    const headersArea=row.querySelector('.ci-playback-headers'),urlArea=row.querySelector('.ci-playback-url');
    if(!headersArea||!urlArea)return;
    const box=document.createElement('div');box.className=ROOT_CLASS;
    box.innerHTML=`
      <div class="cochi-cookie-head"><div><b>COOKIE · ${sourceNumber(row)}</b><div class="cochi-cookie-note">Podés pegar la cookie directamente o pedirle al PANEL que tome los <b>Set-Cookie</b> de una URL. Se guarda como <b>Cookie</b> dentro de los headers de esta misma fuente.</div></div></div>
      <label>Cookie manual<textarea class="cochi-cookie-manual" rows="3" spellcheck="false" placeholder="session=abc123; token=xyz456"></textarea></label>
      <label>URL para obtener / actualizar cookie<input class="cochi-cookie-url" type="url" spellcheck="false" placeholder="https://sitio.com/obtener-cookie"></label>
      <div class="cochi-cookie-actions"><button type="button" class="ghost cochi-cookie-use-source">USAR URL DE ESTA FUENTE</button><button type="button" class="primary cochi-cookie-fetch">OBTENER / ACTUALIZAR COOKIE</button><span class="cochi-cookie-status"></span></div>
    `;
    row.appendChild(box);
    const manual=box.querySelector('.cochi-cookie-manual'),cookieUrl=box.querySelector('.cochi-cookie-url'),status=box.querySelector('.cochi-cookie-status'),fetchBtn=box.querySelector('.cochi-cookie-fetch');
    const syncFromHeaders=()=>{const c=getHeader(parseHeaders(headersArea.value),'Cookie');if(document.activeElement!==manual)manual.value=c;};
    syncFromHeaders();
    headersArea.addEventListener('input',syncFromHeaders);
    manual.addEventListener('input',()=>{headersArea.value=replaceCookieHeader(headersArea.value,manual.value.trim());headersArea.dispatchEvent(new Event('input',{bubbles:true}));setStatus(status,manual.value.trim()?'Cookie lista para guardar en esta fuente.':'Cookie eliminada de los headers.',manual.value.trim()?'ok':'');});
    box.querySelector('.cochi-cookie-use-source').addEventListener('click',()=>{cookieUrl.value=String(urlArea.value||'').trim();setStatus(status,cookieUrl.value?'URL de la fuente copiada.':'La fuente todavía no tiene URL.',cookieUrl.value?'ok':'bad');});
    fetchBtn.addEventListener('click',async()=>{
      const target=String(cookieUrl.value||'').trim(),sourceUrl=String(urlArea.value||'').trim();
      if(!target){setStatus(status,'Ingresá la URL desde donde querés obtener la cookie.','bad');return;}
      const headers=parseHeaders(headersArea.value),currentCookie=getHeader(headers,'Cookie');
      fetchBtn.disabled=true;fetchBtn.textContent='OBTENIENDO...';setStatus(status,'Consultando la URL desde el backend del PANEL...');
      try{
        const r=await fetch('/api/admin/cookie-fetch',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:target,sourceUrl,headers,currentCookie})});
        let d={};try{d=await r.json();}catch{}
        if(!r.ok)throw new Error(d.error||`HTTP ${r.status}`);
        manual.value=String(d.cookie||'');
        headersArea.value=replaceCookieHeader(headersArea.value,manual.value);
        headersArea.dispatchEvent(new Event('input',{bubbles:true}));
        const names=Array.isArray(d.received)&&d.received.length?` · ${d.received.join(', ')}`:'';
        setStatus(status,`Cookie obtenida correctamente${names}. Ahora guardá/actualizá el canal.`, 'ok');
      }catch(e){setStatus(status,String(e?.message||e),'bad');}
      finally{fetchBtn.disabled=false;fetchBtn.textContent='OBTENER / ACTUALIZAR COOKIE';}
    });
  }
  function scan(){document.querySelectorAll('.playback-source-row').forEach(enhance);}
  const observer=new MutationObserver(scan);observer.observe(document.documentElement,{subtree:true,childList:true});scan();
})();
