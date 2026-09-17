(() => {
  'use strict';

  const STYLE_ID = 'cochi-cookie-tools-style';
  const COOKIE_ATTRS = new Set(['path','expires','max-age','domain','secure','httponly','samesite','priority','partitioned']);

  function ensureStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      .cookie-tool-box{margin:10px 0 14px;padding:12px;border:1px solid rgba(66,205,255,.24);border-radius:12px;background:rgba(4,31,50,.42)}
      .cookie-tool-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;flex-wrap:wrap}
      .cookie-tool-title strong{color:#dff8ff}
      .cookie-tool-badge{display:inline-flex;align-items:center;padding:3px 7px;border-radius:999px;border:1px solid rgba(64,224,161,.3);background:rgba(27,119,81,.15);color:#7ef0be;font-size:10px;font-weight:900}
      .cookie-tool-box label{margin:9px 0}
      .cookie-tool-box textarea,.cookie-tool-box input{margin-top:6px}
      .cookie-tool-url-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:8px;align-items:end}
      .cookie-tool-url-row label{margin:0;min-width:0}
      .cookie-tool-url-row button{white-space:nowrap;min-height:42px}
      .cookie-tool-status{min-height:18px;margin-top:7px;font-size:11px;color:#8fb8ce;line-height:1.35}
      .cookie-tool-status.ok{color:#69e6ae}.cookie-tool-status.bad{color:#ff9dac}
      @media(max-width:760px){.cookie-tool-url-row{grid-template-columns:1fr}.cookie-tool-url-row button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function stripCookiePrefix(value){
    return String(value||'').trim().replace(/^cookie\s*:\s*/i,'').trim();
  }

  function cookieFromHeadersText(text){
    for(const line of String(text||'').split(/\r?\n/)){
      const m=line.match(/^\s*Cookie\s*(?::|=)\s*(.+)\s*$/i);
      if(m) return m[1].trim();
    }
    return '';
  }

  function setCookieInHeadersText(text,cookie){
    const lines=String(text||'').split(/\r?\n/).filter(line=>!/^\s*Cookie\s*(?::|=)/i.test(line));
    const clean=stripCookiePrefix(cookie);
    if(clean) lines.push(`Cookie: ${clean}`);
    return lines.filter((line,i,arr)=>line.trim()||i<arr.length-1).join('\n').trim();
  }

  function cookiePairsFromString(raw){
    const value=stripCookiePrefix(raw);
    if(!value) return [];
    const out=[];
    for(const part of value.split(';')){
      const p=part.trim();
      if(!p) continue;
      const i=p.indexOf('=');
      if(i<=0) continue;
      const name=p.slice(0,i).trim(),val=p.slice(i+1).trim();
      if(!name||COOKIE_ATTRS.has(name.toLowerCase())) continue;
      out.push([name,val]);
    }
    return out;
  }

  function normalizeManualCookie(raw){
    const text=String(raw||'').trim();
    if(!text) return '';
    const setCookieLines=text.split(/\r?\n/).map(x=>x.trim()).filter(x=>/^set-cookie\s*:/i.test(x));
    if(setCookieLines.length){
      const pairs=[];
      for(const line of setCookieLines){
        const body=line.replace(/^set-cookie\s*:\s*/i,'');
        const first=body.split(';')[0].trim();
        if(first.includes('=')) pairs.push(first);
      }
      return pairs.join('; ');
    }
    return stripCookiePrefix(text.replace(/\r?\n+/g,'; '));
  }

  function mergeCookieStrings(values){
    const map=new Map();
    for(const raw of values){
      for(const [name,val] of cookiePairsFromString(raw)) map.set(name,val);
    }
    return [...map.entries()].map(([k,v])=>`${k}=${v}`).join('; ');
  }

  function collectCookies(value,out=[],seen=new Set(),depth=0){
    if(depth>10||value===null||value===undefined) return out;
    if(typeof value==='string') return out;
    if(typeof value!=='object') return out;
    if(seen.has(value)) return out;
    seen.add(value);
    if(Array.isArray(value)){
      for(const x of value) collectCookies(x,out,seen,depth+1);
      return out;
    }
    for(const [key,val] of Object.entries(value)){
      if(String(key).toLowerCase()==='cookie'&&typeof val==='string'&&val.trim()) out.push(val.trim());
      else collectCookies(val,out,seen,depth+1);
    }
    return out;
  }

  async function apiJson(url,options={}){
    const response=await fetch(url,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});
    let data={};
    try{data=await response.json();}catch{}
    if(!response.ok) throw new Error(data.error||`Error ${response.status}`);
    return data;
  }

  function injectCookieTools(row){
    if(!row||row.dataset.cookieTools==='1') return;
    const headers=row.querySelector('.ci-playback-headers');
    const sourceUrl=row.querySelector('.ci-playback-url');
    if(!headers||!sourceUrl) return;
    row.dataset.cookieTools='1';

    const box=document.createElement('div');
    box.className='cookie-tool-box';
    box.innerHTML=`
      <div class="cookie-tool-title"><strong>Cookie de esta fuente</strong><span class="cookie-tool-badge">HEADER COOKIE</span></div>
      <label>Cookie manual
        <textarea class="ci-cookie-manual" rows="2" spellcheck="false" placeholder="session=abc123; token=xyz456"></textarea>
        <span class="muted tiny">Podés pegar solamente los pares de cookie, una línea “Cookie: …” o varias líneas “Set-Cookie: …”. Se guarda dentro de Headers como Cookie.</span>
      </label>
      <div class="cookie-tool-url-row">
        <label>URL para obtener Cookie
          <input class="ci-cookie-source-url" type="url" placeholder="https://pagina-o-player-que-genera-la-cookie/...">
        </label>
        <button class="ghost ci-cookie-use-source" type="button">USAR URL FUENTE</button>
        <button class="primary ci-cookie-fetch" type="button">OBTENER COOKIE</button>
      </div>
      <div class="cookie-tool-status">La obtención automática usa el analizador dinámico ya existente del PANEL y busca la Cookie enviada por el reproductor.</div>
    `;

    const manual=box.querySelector('.ci-cookie-manual');
    const urlInput=box.querySelector('.ci-cookie-source-url');
    const useSource=box.querySelector('.ci-cookie-use-source');
    const fetchBtn=box.querySelector('.ci-cookie-fetch');
    const status=box.querySelector('.cookie-tool-status');

    manual.value=cookieFromHeadersText(headers.value);

    const syncManualToHeaders=()=>{
      const clean=normalizeManualCookie(manual.value);
      headers.value=setCookieInHeadersText(headers.value,clean);
    };
    const syncHeadersToManual=()=>{
      const cookie=cookieFromHeadersText(headers.value);
      if(manual.value!==cookie) manual.value=cookie;
    };

    manual.addEventListener('input',syncManualToHeaders);
    manual.addEventListener('blur',()=>{
      const clean=normalizeManualCookie(manual.value);
      if(manual.value!==clean) manual.value=clean;
      headers.value=setCookieInHeadersText(headers.value,clean);
    });
    headers.addEventListener('input',syncHeadersToManual);

    useSource.addEventListener('click',()=>{
      urlInput.value=String(sourceUrl.value||'').trim();
      status.className='cookie-tool-status';
      status.textContent=urlInput.value?'URL de esta fuente copiada. Podés intentar obtener la Cookie.':'Esta fuente todavía no tiene URL.';
    });

    fetchBtn.addEventListener('click',async()=>{
      const url=String(urlInput.value||sourceUrl.value||'').trim();
      if(!/^https?:\/\//i.test(url)){
        status.className='cookie-tool-status bad';
        status.textContent='Pegá una URL HTTP/HTTPS válida para obtener la Cookie.';
        return;
      }
      fetchBtn.disabled=true;
      const oldText=fetchBtn.textContent;
      fetchBtn.textContent='BUSCANDO...';
      status.className='cookie-tool-status';
      status.textContent='Abriendo la URL y observando las solicitudes del reproductor. Puede tardar unos segundos…';
      try{
        const result=await apiJson('/api/admin/stream-resolver/dynamic',{method:'POST',body:JSON.stringify({url})});
        const found=collectCookies(result,[]);
        const cookie=mergeCookieStrings(found);
        if(!cookie){
          status.className='cookie-tool-status bad';
          status.textContent='La URL se analizó, pero no apareció ninguna Cookie en las solicitudes detectadas. Podés pegarla manualmente.';
          return;
        }
        manual.value=cookie;
        headers.value=setCookieInHeadersText(headers.value,cookie);
        status.className='cookie-tool-status ok';
        status.textContent=`Cookie detectada y cargada en Headers (${cookiePairsFromString(cookie).length} valor${cookiePairsFromString(cookie).length===1?'':'es'}).`;
      }catch(err){
        status.className='cookie-tool-status bad';
        status.textContent=`No se pudo obtener la Cookie: ${err.message}`;
      }finally{
        fetchBtn.disabled=false;
        fetchBtn.textContent=oldText;
      }
    });

    const headersLabel=headers.closest('label');
    if(headersLabel) headersLabel.insertAdjacentElement('afterend',box);
    else row.appendChild(box);
  }

  function scan(){
    document.querySelectorAll('.playback-source-row').forEach(injectCookieTools);
  }

  ensureStyles();
  scan();
  const modal=document.getElementById('modal');
  if(modal){
    const observer=new MutationObserver(scan);
    observer.observe(modal,{childList:true,subtree:true});
  }
})();
