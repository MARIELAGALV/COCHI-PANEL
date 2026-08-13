const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = { me:null, accounts:[], clients:[], devices:[], promos:[], sources:[], demoSettings:null, adultSettings:null, content:{} };
const roleNames = {1:'ADMINISTRACIÓN',2:'DISTRIBUIDOR',3:'REVENDEDOR',4:'VENDEDOR',5:'CLIENTE'};

function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function fmt(v){if(!v)return '—';const d=new Date(v);return Number.isNaN(d.getTime())?v:d.toLocaleString();}
function days(v){if(!v)return null;return (new Date(v).getTime()-Date.now())/86400000;}
function uid(){let x=localStorage.getItem('cochi_panel_device_uid');if(!x){x='web-'+crypto.randomUUID();localStorage.setItem('cochi_panel_device_uid',x);}return x;}
function deviceName(){return localStorage.getItem('cochi_panel_device_name') || `Navegador ${navigator.platform||''}`.trim();}
function secret(){return localStorage.getItem('cochi_panel_device_secret')||'';}
function setSecret(v){localStorage.setItem('cochi_panel_device_secret',v);}
function setDeviceName(v){localStorage.setItem('cochi_panel_device_name',v);}

async function api(url,opt={}){
  const o={credentials:'same-origin',...opt};
  if(o.body&&typeof o.body!=='string'){o.headers={...(o.headers||{}),'Content-Type':'application/json'};o.body=JSON.stringify(o.body);}
  const r=await fetch(url,o);let d={};try{d=await r.json()}catch{}
  if(!r.ok){const e=new Error(d.error||`Error ${r.status}`);e.status=r.status;e.data=d;throw e;}return d;
}
function show(id){['setupView','activateView','appView'].forEach(x=>$('#'+x).classList.add('hidden'));$('#'+id).classList.remove('hidden');}
function msg(el,text,ok=false){el.textContent=text||'';el.className='msg'+(text?(ok?' ok':' error'):'');}
function openModal(html){$('#modal').innerHTML=html;$('#modalBackdrop').classList.remove('hidden');}
function closeModal(){$('#modalBackdrop').classList.add('hidden');$('#modal').innerHTML='';}
$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal();});

async function bootstrap(){
  const st=await api('/api/setup/status').catch(()=>({needsSetup:false}));
  if(st.needsSetup){show('setupView');return;}
  try{const me=await api('/api/panel/me');state.me=me.account;enterApp();return;}catch{}
  if(secret()){
    try{await loginSaved();return;}catch(e){if(e.status===423){show('activateView');msg($('#activateMsg'),'Esta ficha está bloqueada. Se desbloquea automáticamente cuando reciba una nueva carga de créditos.');$('#existingDeviceBtn').classList.remove('hidden');return;}}
  }
  show('activateView');if(secret())$('#existingDeviceBtn').classList.remove('hidden');
}

$('#setupForm').addEventListener('submit',async e=>{
  e.preventDefault();msg($('#setupMsg'),'');
  try{
    const r=await api('/api/setup',{method:'POST',body:{name:$('#setupName').value,contact:$('#setupContact').value}});
    show('activateView');$('#activateCode').value=r.activationCode;openModal(`<h3>Ficha ADMINISTRACIÓN creada</h3><p>Guardá este código. Sirve para activar hasta 2 dispositivos del PANEL.</p><div class="code-big">${esc(r.activationCode)}</div><div class="modal-actions"><button class="primary" data-close>Continuar</button></div>`);
  }catch(e){msg($('#setupMsg'),e.message);}
});

$('#activateForm').addEventListener('submit',async e=>{
  e.preventDefault();msg($('#activateMsg'),'');
  try{
    const name=$('#panelDeviceName').value.trim();
    const r=await api('/api/panel/activate',{method:'POST',body:{code:$('#activateCode').value,deviceUid:uid(),deviceName:name}});
    setSecret(r.deviceSecret);setDeviceName(name);state.me=r.account;enterApp();
  }catch(e){msg($('#activateMsg'),e.message);}
});
$('#existingDeviceBtn').addEventListener('click',()=>loginSaved().catch(e=>msg($('#activateMsg'),e.message)));
async function loginSaved(){
  const r=await api('/api/panel/session',{method:'POST',body:{deviceUid:uid(),deviceSecret:secret()}});state.me=r.account;enterApp();
}
$('#logoutBtn').addEventListener('click',async()=>{await api('/api/panel/logout',{method:'POST'}).catch(()=>{});show('activateView');$('#existingDeviceBtn').classList.toggle('hidden',!secret());});

function enterApp(){
  show('appView');
  $('#meName').textContent=state.me.name;
  $('#roleEyebrow').textContent=state.me.role_name;
  $('#meCredits').textContent=state.me.role_level===1?'':`${state.me.credits} créditos`;
  $$('.admin-only').forEach(x=>x.classList.toggle('hidden',state.me.role_level!==1));
  switchView('dashboard');
}

$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
$('#refreshBtn').addEventListener('click',refreshCurrent);
function switchView(name){
  $$('.nav-btn').forEach(x=>x.classList.toggle('active',x.dataset.view===name));
  $$('.view').forEach(x=>x.classList.toggle('active',x.id===`view-${name}`));
  document.body.dataset.view=name;
  const t={dashboard:'Inicio',accounts:'Fichas PANEL',clients:'Clientes finales',devices:'Dispositivos',credits:'Créditos',promotions:'Promociones',demos:'Demos',adults:'PIN Adultos',sources:'Fuentes de contenido',content:'Manager de Contenido'};
  $('#pageTitle').textContent=t[name]||name;refreshCurrent();
}
async function refreshMe(){const r=await api('/api/panel/me');state.me=r.account;$('#meName').textContent=state.me.name;$('#meCredits').textContent=state.me.role_level===1?'':`${state.me.credits} créditos`;}
async function refreshCurrent(){
  try{
    await refreshMe();const v=document.body.dataset.view||'dashboard';
    if(v==='dashboard')await loadDashboard();
    if(v==='accounts')await loadAccounts();
    if(v==='clients'){if(state.me.role_level===1)await loadAccounts();await loadClients();}
    if(v==='devices')await Promise.all([loadClients(false),loadDevices()]);
    if(v==='credits')await loadCredits();
    if(v==='promotions'&&state.me.role_level===1)await loadPromos();
    if(v==='demos'&&state.me.role_level===1)await loadDemos();
    if(v==='adults'&&state.me.role_level===1)await loadAdultSettings();
    if(v==='sources'&&state.me.role_level===1)await loadSources();
    if(v==='content'&&state.me.role_level===1)await loadContent();
  }catch(e){if(e.status===401||e.status===423){show('activateView');msg($('#activateMsg'),e.status===423?'Ficha bloqueada hasta recibir una nueva carga de créditos.':'Volvé a ingresar.');}else console.error(e);}
}

async function loadDashboard(){
  const d=await api('/api/admin/dashboard');
  const cards=[
    ['category','Categoría',d.role,''],
    ['credits','Créditos',d.creditsUnlimited?'—':d.credits,d.creditsUnlimited?'':'saldo actual'],
    ['accounts','Fichas PANEL',d.directAccounts,state.me.role_level===1?'total visible':'directas'],
    ['clients','Clientes finales',d.directClients,state.me.role_level===1?'total visible':'directos']
  ];
  $('#dashboardCards').innerHTML=cards.map(([key,l,v,s])=>`<div class="metric metric-${key}${key==='credits'||key==='accounts'?' metric-compact':''}"><div class="label">${esc(l)}</div><div class="value">${esc(v)}</div><div class="muted small">${esc(s)}</div></div>`).join('');
  if(d.activePromotion){$('#promoBanner').classList.remove('hidden');$('#promoBanner').innerHTML=`🎁 <b>${esc(d.activePromotion.name)}</b> — +${d.activePromotion.percent}% en cargas recibidas hasta ${esc(fmt(d.activePromotion.endsAt))}. El bonus lo paga el sistema.`;}else $('#promoBanner').classList.add('hidden');
}

function renderAccounts(){
  const q=($('#accountSearch')?.value||'').trim().toLowerCase();
  const rows=state.accounts.filter(a=>!q||[a.name,a.contact,a.role_name,a.parent_name,a.activation_code,a.active?'activa':'deshabilitada'].some(v=>String(v||'').toLowerCase().includes(q)));
  $('#accountsBody').innerHTML=rows.length?rows.map(a=>{
    const blocked=a.inactivity_blocked;
    const stat=a.is_root_admin?'<span class="badge active">PROTEGIDA</span>':!a.active?'<span class="badge blocked">DESHABILITADA</span>':blocked?'<span class="badge pending">BLOQUEO 2 MESES</span>':'<span class="badge active">ACTIVA</span>';
    const creditValue=a.role_level===1?'—':a.credits;
    const loadBtn=(a.id!==state.me.id&&a.role_level!==1)?`<button class="primary mini-load" data-action="account-credit">CARGAR</button>`:'';
    return `<tr data-account="${a.id}"><td><b>${esc(a.name)}</b>${a.is_root_admin?'<div class="muted small">Administración principal</div>':`<div class="muted small">${esc(a.contact||'')}</div>`}</td><td><span class="role-chip role-${a.role_level}">${esc(a.role_name)}</span></td><td>${esc(a.parent_name||'—')}</td><td class="credit-number"><div>${creditValue}</div>${loadBtn}</td><td>${a.panel_device_count}/2</td><td>${stat}<div class="muted small">${a.next_inactivity_block_at?`Límite: ${esc(fmt(a.next_inactivity_block_at))}`:''}</div></td><td><code>${esc(a.activation_code)}</code></td><td><div class="actions"><button class="ghost" data-action="account-edit">Editar</button><button class="ghost" data-action="account-devices">Paneles</button></div></td></tr>`;
  }).join(''):`<tr><td colspan="8" class="empty">${q?'No hay paneles que coincidan con la búsqueda.':'No hay fichas PANEL visibles.'}</td></tr>`;
}
async function loadAccounts(render=true){const d=await api('/api/admin/accounts');state.accounts=d.accounts;if(render)renderAccounts();}
$('#accountSearch')?.addEventListener('input',renderAccounts);

$('#newAccountBtn').addEventListener('click',()=>openAccountModal());
function allowedRoleOptions(current=null){
  const min=state.me.role_level===1?1:state.me.role_level;return [1,2,3,4].filter(x=>x>=min).map(x=>`<option value="${x}" ${current===x?'selected':''}>${roleNames[x]}</option>`).join('');
}
function openAccountModal(a=null){
  const admin=state.me.role_level===1,root=Boolean(a?.is_root_admin);
  openModal(`<h3>${a?'Editar ficha PANEL':'Nueva ficha PANEL'}</h3>${root?'<div class="protected-note">🔒 ADMINISTRACIÓN principal protegida: podés editar nombre, contacto y notas, pero no deshabilitarla, bajarla de categoría ni cambiar su propietario.</div>':''}<form id="accountForm"><label>Nombre<input id="aName" required value="${esc(a?.name||'')}"></label><div class="form-row"><label>Categoría<select id="aRole" ${(a&&!admin)||root?'disabled':''}>${allowedRoleOptions(a?.role_level||null)}</select></label><label>Contacto<input id="aContact" value="${esc(a?.contact||'')}"></label></div>${a&&admin&&!root?`<label>Propietario<select id="aParent"><option value="">Sin propietario</option>${state.accounts.filter(x=>x.id!==a.id).map(x=>`<option value="${x.id}" ${a.parent_id===x.id?'selected':''}>${esc(x.name)} — ${esc(x.role_name)}</option>`).join('')}</select></label>`:''}<label>Notas<textarea id="aNotes" rows="3">${esc(a?.notes||'')}</textarea></label>${a&&!root?`<label class="switch-row"><input id="aActive" type="checkbox" ${a.active?'checked':''}> Ficha habilitada</label>`:''}<div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">Guardar</button></div><div id="accountMsg" class="msg"></div></form>`);
  $('#accountForm').addEventListener('submit',async e=>{e.preventDefault();try{const payload={name:$('#aName').value,contact:$('#aContact').value,notes:$('#aNotes').value};if(!a)payload.roleLevel=Number($('#aRole').value);else if(admin&&!root)payload.roleLevel=Number($('#aRole').value);if(a&&!root){payload.active=$('#aActive').checked;if(admin)payload.parentId=$('#aParent').value?Number($('#aParent').value):null;}const r=await api(a?`/api/admin/accounts/${a.id}`:'/api/admin/accounts',{method:a?'PUT':'POST',body:payload});if(!a){openModal(`<h3>Ficha PANEL creada</h3><p>${esc(r.role)}</p><div class="code-big">${esc(r.activationCode)}</div><p class="muted">Código para activar hasta 2 dispositivos del PANEL.</p><div class="modal-actions"><button class="primary" data-close>Listo</button></div>`);}else closeModal();await loadAccounts();}catch(err){msg($('#accountMsg'),err.message);}});
}
$('#accountsBody').addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return;const tr=b.closest('tr'),a=state.accounts.find(x=>x.id===Number(tr.dataset.account));if(!a)return;
  if(b.dataset.action==='account-edit')openAccountModal(a);
  if(b.dataset.action==='account-credit')openCreditModal(a);
  if(b.dataset.action==='account-devices')openPanelDevices(a);
});
function openCreditModal(a){
  openModal(`<h3>Cargar créditos</h3><p>Destino: <b>${esc(a.name)}</b> · ${esc(a.role_name)}</p><p class="muted">Carga mínima: <b>10 créditos</b>. La operación respeta automáticamente el saldo disponible y, si hay una promoción activa, aplica el bonus correspondiente.</p>${state.me.role_level===1?'':`<div class="unlimited-box">Saldo disponible: <b>${state.me.credits}</b></div>`}<form id="creditForm"><label>Cantidad<input id="creditAmount" type="number" min="10" step="1" ${state.me.role_level===1?'':`max="${state.me.credits}"`} required value="10"></label><div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">CONFIRMAR CARGA</button></div><div id="creditMsg" class="msg"></div></form>`);
  $('#creditForm').addEventListener('submit',async e=>{e.preventDefault();try{const r=await api(`/api/admin/accounts/${a.id}/credits`,{method:'POST',body:{amount:Number($('#creditAmount').value)}});openModal(`<h3>Carga realizada</h3><p>Se cargaron <b>${r.baseAmount}</b> créditos.</p><p>Bonus automático: <b>${r.promoBonus}</b></p><p>Total recibido: <b>${r.totalReceived}</b></p>${r.senderUnlimited?'':`<p class="muted">A quien cargó se le descontaron ${r.senderCharged} créditos. Saldo restante: ${r.senderBalance}.</p>`}<div class="modal-actions"><button class="primary" data-close>Listo</button></div>`);await refreshMe();await loadAccounts();}catch(err){msg($('#creditMsg'),err.message);}});
}
async function openPanelDevices(a){
  try{const d=await api(`/api/admin/accounts/${a.id}/panel-devices`);openModal(`<h3>Dispositivos PANEL — ${esc(a.name)}</h3><p class="muted">Máximo 2 activos.</p>${d.devices.length?d.devices.map(x=>`<div class="rule-card" data-pdev="${x.id}"><b>${esc(x.device_name||x.device_uid)}</b><span>${esc(x.device_uid)} · ${x.active?'ACTIVO':'LIBERADO'} · Último: ${esc(fmt(x.last_seen_at))}</span>${x.active&&a.id!==state.me.id?`<div class="mt10"><button class="danger-btn" data-action="release-panel">Liberar dispositivo</button></div>`:''}</div>`).join(''):'<p class="empty">Sin dispositivos.</p>'}<div class="modal-actions"><button class="ghost" data-close>Cerrar</button></div>`);}catch(e){alert(e.message);}
}

function clientStatusBadge(c){
  const code=c.display_status_code||'no_service';
  const cls=['active','demo_active'].includes(code)?'active':['blocked','expired','demo_expired'].includes(code)?'blocked':'pending';
  return `<span class="badge ${cls}">${esc(c.display_status||'SIN SERVICIO')}</span>`;
}
function fmtDuration(sec){sec=Math.max(0,Number(sec||0));const m=Math.floor(sec/60),s=Math.floor(sec%60);return `${m}m ${String(s).padStart(2,'0')}s`;}

// Contadores de demo en vivo: descuentan localmente cada segundo, sin consultar Railway cada segundo.
function liveDemoAttrs(remainingSeconds,deviceId=''){return `data-demo-live="1" data-demo-seconds="${Math.max(0,Number(remainingSeconds||0))}" data-demo-start="${Date.now()}"${deviceId!==''?` data-demo-device="${Number(deviceId)}"`:''}`;}
function updateLiveDemoCountdowns(){
  const now=Date.now();
  $$('[data-demo-live="1"]').forEach(el=>{
    const initial=Math.max(0,Number(el.dataset.demoSeconds||0));
    const started=Number(el.dataset.demoStart||now);
    const remaining=Math.max(0,Math.ceil(initial-(now-started)/1000));
    if(remaining>0){el.textContent=`DEMO ACTIVO · ${fmtDuration(remaining)}`;return;}
    if(el.dataset.demoFinished==='1')return;
    el.dataset.demoFinished='1';
    el.classList.remove('active');el.classList.add('blocked');el.textContent='FINALIZADO';
    const deviceId=Number(el.dataset.demoDevice||0);
    const controls=el.closest('.demo-live-controls');
    if(controls&&deviceId&&state.me?.role_level===1){controls.innerHTML=`<span class="badge blocked">FINALIZADO</span><button class="ghost demo-admin-btn" data-action="reset-demo" data-device="${deviceId}">RESETEAR DEMO</button>`;}
    const row=el.closest('tr');
    if(row&&deviceId){const actions=row.querySelector('.demo-table-actions');if(actions&&state.me?.role_level===1)actions.innerHTML=`<span class="muted small">Demo utilizado</span><button class="ghost" data-action="demo-reset" data-device="${deviceId}">RESETEAR DEMO</button>`;}
  });
}
setInterval(updateLiveDemoCountdowns,1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateLiveDemoCountdowns();});

function renderClients(){const q=($('#clientSearch')?.value||'').trim().toLowerCase();const rows=state.clients.filter(c=>!q||[c.name,c.owner_name,c.active?'activo':'inactivo',c.expires_at?'activado':'sin activar'].some(v=>String(v||'').toLowerCase().includes(q)));$('#clientsBody').innerHTML=rows.length?rows.map(c=>{
  const rem=c.days_remaining;const renew=c.renew_available?'<span class="badge active">DISPONIBLE</span>':`<span class="badge pending">En ${Math.max(0,Math.ceil(rem-10))} días</span>`;const stat=clientStatusBadge(c);
  const linked=c.linked_device_count??c.device_count;
  const demoLine=c.demo_active_count?`<div class="muted small success-text">Demo activo en ${c.demo_active_count} dispositivo${c.demo_active_count>1?'s':''}</div>`:'';
  return `<tr data-client="${c.id}"><td><b>${esc(c.name)}</b></td><td>${esc(c.owner_name)}</td><td>${esc(c.expires_at?fmt(c.expires_at):'Sin activar')}</td><td>${renew}</td><td>${c.device_count}/2 <div class="muted small">${linked}/2 códigos vinculados</div>${demoLine}</td><td>${stat}</td><td class="client-actions-cell"><div class="actions client-actions"><button class="code-btn" data-action="client-codes">CÓDIGOS / DEMO</button><button class="ghost" data-action="client-edit">Editar</button><button class="primary" data-action="client-renew">Activar/Renovar</button></div></td></tr>`;
}).join(''):`<tr><td colspan="7" class="empty">${q?'No hay clientes que coincidan con la búsqueda.':'No hay clientes finales.'}</td></tr>`;}
async function loadClients(render=true){const d=await api('/api/admin/clients');state.clients=d.clients;if(render)renderClients();}
$('#clientSearch')?.addEventListener('input',renderClients);
$('#newClientBtn').addEventListener('click',()=>openClientModal());
function openClientModal(c=null){
  const admin=state.me.role_level===1;
  const owners=admin?state.accounts.filter(a=>a.role_level<=4):[];
  openModal(`<h3>${c?'Editar cliente final':'Nuevo cliente final'}</h3>
    <form id="clientForm">
      <label>Nombre<input id="cName" required value="${esc(c?.name||'')}"></label>
      ${admin?`<label>Propietario<select id="cOwner"><option value="${state.me.id}">${esc(state.me.name)} — ADMINISTRACIÓN</option>${owners.filter(a=>a.id!==state.me.id).map(a=>`<option value="${a.id}" ${c?.owner_account_id===a.id?'selected':''}>${esc(a.name)} — ${esc(a.role_name)}</option>`).join('')}</select></label>`:''}
      <label>Notas<textarea id="cNotes" rows="3">${esc(c?.notes||'')}</textarea></label>
      ${c?`<div class="client-code-box">
        <div>
          <b>Códigos de dispositivos CO-CHI</b>
          <p class="muted small">Acá vinculás los códigos que aparecen en el celular, TV o TV Box del cliente.</p>
        </div>
        <button type="button" id="manageCodesBtn" class="code-btn">+ CARGAR / VER CÓDIGOS</button>
      </div>
      <label class="switch-row"><input id="cActive" type="checkbox" ${c.active?'checked':''}> Cliente habilitado</label>`:
      `<div class="client-code-box muted"><b>Códigos CO-CHI</b><span>Primero guardá el cliente. Al terminar se abrirá automáticamente la pantalla para cargar sus códigos.</span></div>`}
      <div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">Guardar</button></div>
      <div id="clientMsg" class="msg"></div>
    </form>`);
  if(c){
    $('#manageCodesBtn')?.addEventListener('click',()=>openClientCodes(c));
  }
  $('#clientForm').addEventListener('submit',async e=>{
    e.preventDefault();
    try{
      const body={name:$('#cName').value,notes:$('#cNotes').value};
      if(admin)body.ownerAccountId=Number($('#cOwner').value);
      if(c)body.active=$('#cActive').checked;
      const r=await api(c?`/api/admin/clients/${c.id}`:'/api/admin/clients',{method:c?'PUT':'POST',body});
      closeModal();
      await loadClients();
      if(!c){
        const created=state.clients.find(x=>x.id===Number(r.id));
        if(created) setTimeout(()=>openClientCodes(created),150);
      }
    }catch(err){msg($('#clientMsg'),err.message);}
  });
}
$('#clientsBody').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const c=state.clients.find(x=>x.id===Number(b.closest('tr').dataset.client));if(!c)return;if(b.dataset.action==='client-codes')openClientCodes(c);if(b.dataset.action==='client-edit')openClientModal(c);if(b.dataset.action==='client-renew'){const q=state.me?.role_level===1?`¿Activar/renovar a ${c.name} por 30 días?`:`¿Usar 1 crédito para activar/renovar a ${c.name}?`;if(!confirm(q))return;try{const r=await api(`/api/admin/clients/${c.id}/renew`,{method:'POST'});alert(`Nuevo vencimiento: ${fmt(r.newExpiry)}`);await refreshMe();await loadClients();}catch(err){alert(err.message);}}});

async function openClientCodes(c){
  try{
    const [d,ds]=await Promise.all([api(`/api/admin/clients/${c.id}/devices`),api('/api/admin/demo-settings')]);
    state.demoSettings=ds;
    const linked=d.devices||[];
    const slots=Math.max(0,2-linked.filter(x=>x.status==='active'||x.status==='pending').length);
    const serviceActive=Boolean(d.clientStatus?.service_active);
    openModal(`
      <h3>Códigos y Demo — ${esc(c.name)}</h3>
      <p class="muted">Vinculá hasta 2 códigos CO-CHI. El cliente no figura ACTIVO hasta tener al menos un código vinculado.</p>
      <form id="clientCodeForm">
        <label>Código de activación CO-CHI
          <input id="clientActivationCode" placeholder="ABCD-1234" autocomplete="off" ${slots===0?'disabled':''} required>
        </label>
        <div class="modal-actions" style="justify-content:flex-start">
          <button class="primary" type="submit" ${slots===0?'disabled':''}>VINCULAR CÓDIGO</button>
        </div>
        <div id="clientCodeMsg" class="msg"></div>
      </form>
      <div class="client-code-slots">
        <div class="slot-head"><b>Dispositivos vinculados</b><span>${linked.filter(x=>x.status!=='blocked').length}/2</span></div>
        ${linked.length?linked.map((x,i)=>{
          const di=x.demo||{};
          let demoAction='';
          if(di.active)demoAction=state.me?.role_level===1
            ? `<div class="demo-live-controls"><span class="badge active" ${liveDemoAttrs(di.remainingSeconds,x.id)}>DEMO ACTIVO · ${fmtDuration(di.remainingSeconds)}</span><button class="ghost demo-admin-btn" data-action="reduce-demo" data-device="${x.id}">10 MIN</button><button class="danger-btn demo-admin-btn" data-action="expire-demo" data-device="${x.id}">CORTAR</button></div>`
            : `<span class="badge active" ${liveDemoAttrs(di.remainingSeconds,x.id)}>DEMO ACTIVO · ${fmtDuration(di.remainingSeconds)}</span>`;
          else if(di.used)demoAction=state.me?.role_level===1 ? `<div class="demo-live-controls"><span class="badge blocked">DEMO YA USADO</span><button class="ghost demo-admin-btn" data-action="reset-demo" data-device="${x.id}">RESETEAR DEMO</button></div>` : '<span class="badge blocked">DEMO YA USADO</span>';
          else if(serviceActive)demoAction='<span class="muted small">Servicio normal activo</span>';
          else if(!ds.enabled)demoAction='<span class="muted small">Demos desactivados</span>';
          else if(!ds.canGrant)demoAction='<span class="badge pending">DEMO NO DISPONIBLE</span>';
          else if(x.status==='blocked')demoAction='<span class="muted small">Dispositivo bloqueado</span>';
          else demoAction=state.me?.role_level===1 ? `<button class="demo-btn" data-action="grant-demo" data-device="${x.id}">DAR DEMO 10 MIN</button>` : '<span class="muted small">Disponible solo para ADMINISTRACIÓN</span>'; 
          return `<div class="rule-card device-demo-card">
            <div><b>Código ${i+1}: <code>${esc(x.activation_code)}</code></b><span>${esc(x.device_name||x.device_uid)} · ${esc((x.status||'pending').toUpperCase())}${x.last_seen_at?` · Último: ${esc(fmt(x.last_seen_at))}`:''}</span></div>
            <div class="demo-action">${demoAction}</div>
          </div>`;
        }).join(''):'<p class="empty">Todavía no hay códigos vinculados.</p>'}
      </div>
      <div class="modal-actions"><button class="ghost" data-close>Cerrar</button></div>
    `);
    const form=$('#clientCodeForm');
    if(form)form.addEventListener('submit',async ev=>{
      ev.preventDefault();msg($('#clientCodeMsg'),'');
      try{
        const r=await api('/api/admin/client-devices/assign-by-code',{method:'POST',body:{activationCode:$('#clientActivationCode').value,clientId:c.id}});
        msg($('#clientCodeMsg'),r.waitingForService?'Código vinculado. Falta activar servicio o dar demo.':'Código vinculado y dispositivo activo.',true);
        await loadClients(false);setTimeout(()=>openClientCodes(state.clients.find(x=>x.id===c.id)||c),250);
      }catch(err){msg($('#clientCodeMsg'),err.message);}
    });
    $$('.demo-btn').forEach(btn=>btn.addEventListener('click',async()=>{
      if(!confirm('¿Dar a este dispositivo un demo de 10 minutos?'))return;
      try{const r=await api(`/api/admin/client-devices/${Number(btn.dataset.device)}/demo`,{method:'POST'});alert(`Demo activo hasta ${fmt(r.expiresAt)}.`);await refreshMe();await loadClients(false);openClientCodes(state.clients.find(x=>x.id===c.id)||c);}catch(err){alert(err.message);}
    }));
    $$('.demo-admin-btn').forEach(btn=>btn.addEventListener('click',async()=>{
      const id=Number(btn.dataset.device),action=btn.dataset.action;
      try{
        if(action==='reduce-demo'){if(!confirm('¿Reducir este demo para que termine dentro de 10 minutos? Si ya le quedan menos de 10 minutos, no se extenderá.'))return;const r=await api(`/api/admin/client-devices/${id}/demo/reduce-10`,{method:'POST'});alert(`Demo ajustado. Vence ${fmt(r.expiresAt)}.`);}
        if(action==='expire-demo'){if(!confirm('¿Cortar este demo ahora? El dispositivo seguirá marcado como DEMO YA USADO.'))return;await api(`/api/admin/client-devices/${id}/demo/expire`,{method:'POST'});alert('Demo cortado. El dispositivo continúa marcado como demo utilizado.');}
        if(action==='reset-demo'){if(!confirm('¿Resetear el demo de este dispositivo? Podrá recibir un demo nuevo de 10 minutos.'))return;await api(`/api/admin/client-devices/${id}/demo/reset`,{method:'POST'});alert('Demo reseteado. El dispositivo puede volver a recibir un demo.');}
        await loadClients(false);openClientCodes(state.clients.find(x=>x.id===c.id)||c);
      }catch(err){alert(err.message);}
    }));
  }catch(err){alert(err.message);}
}

async function loadDevices(){const d=await api('/api/admin/client-devices');state.devices=d.devices;$('#devicesBody').innerHTML=state.devices.length?state.devices.map(x=>{const eff=x.effective_status||x.status.toUpperCase();const cls=eff==='ACTIVO'||eff==='DEMO ACTIVO'?'active':eff==='BLOQUEADO'||eff==='DEMO VENCIDO'?'blocked':'pending';const demo=x.demo?.active?`<div class="muted small success-text" ${liveDemoAttrs(x.demo.remainingSeconds,x.id)}>DEMO ACTIVO · ${fmtDuration(x.demo.remainingSeconds)}</div>`:x.demo?.used?'<div class="muted small">Demo usado</div>':'';return `<tr data-device="${x.id}"><td><code>${esc(x.activation_code)}</code></td><td><b>${esc(x.device_name||x.device_uid)}</b><div class="muted small">${esc(x.device_uid)}</div></td><td>${esc(x.client_name||'Pendiente')}</td><td>${esc(x.owner_name||'—')}</td><td><span class="badge ${cls}">${esc(eff)}</span>${demo}</td><td>${esc(fmt(x.last_seen_at))}</td><td><div class="actions">${x.status==='active'?'<button class="danger-btn" data-action="device-block">Bloquear</button>':''}${x.status==='blocked'?'<button class="ghost" data-action="device-reactivate">Reactivar</button>':''}</div></td></tr>`;}).join(''):`<tr><td colspan="7" class="empty">Sin dispositivos asociados.</td></tr>`;}
$('#manualClientDeviceBtn').addEventListener('click',async()=>{try{const r=await api('/api/admin/client-devices/manual',{method:'POST',body:{deviceName:'Dispositivo de prueba'}});openModal(`<h3>Dispositivo de prueba creado</h3><div class="code-big">${esc(r.activationCode)}</div><p class="muted">Usá “Activar por código” para asociarlo a un cliente.</p><div class="modal-actions"><button class="primary" data-close>Listo</button></div>`);}catch(e){alert(e.message);}});
$('#assignByCodeBtn').addEventListener('click',()=>{if(!state.clients.length){alert('Primero creá un cliente.');return;}openModal(`<h3>Activar dispositivo por código</h3><form id="assignForm"><label>Código CO-CHI<input id="assignCode" placeholder="ABCD-1234" required></label><label>Cliente<select id="assignClient">${state.clients.map(c=>`<option value="${c.id}">${esc(c.name)} (${c.device_count}/2)</option>`).join('')}</select></label><div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">ACTIVAR</button></div><div id="assignMsg" class="msg"></div></form>`);$('#assignForm').addEventListener('submit',async e=>{e.preventDefault();try{await api('/api/admin/client-devices/assign-by-code',{method:'POST',body:{activationCode:$('#assignCode').value,clientId:Number($('#assignClient').value)}});closeModal();await loadDevices();await loadClients(false);}catch(err){msg($('#assignMsg'),err.message);}});});
$('#devicesBody').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const id=Number(b.closest('tr').dataset.device);try{if(b.dataset.action==='device-block'){if(!confirm('¿Bloquear? No se devuelve ningún crédito; solo se libera un lugar de los 2 dispositivos.'))return;await api(`/api/admin/client-devices/${id}/block`,{method:'POST'});}if(b.dataset.action==='device-reactivate')await api(`/api/admin/client-devices/${id}/reactivate`,{method:'POST'});await loadDevices();}catch(err){alert(err.message);}});

async function openCreditChooser(){
  try{
    const d=await api('/api/admin/accounts');
    const targets=d.accounts.filter(a=>a.id!==state.me.id&&a.role_level!==1);
    if(!targets.length){openModal('<h3>Cargar créditos</h3><p class="muted">No tenés fichas habilitadas para recibir cargas.</p><div class="modal-actions"><button class="primary" data-close>Cerrar</button></div>');return;}
    openModal(`<h3>Nueva carga de créditos</h3><p class="muted">Mínimo 10 créditos por carga.</p><label>Destino<select id="creditTarget">${targets.map(a=>`<option value="${a.id}">${esc(a.name)} — ${esc(a.role_name)} — saldo ${a.credits}</option>`).join('')}</select></label><div class="modal-actions"><button class="ghost" data-close>Cancelar</button><button id="continueCreditBtn" class="primary">CONTINUAR</button></div>`);
    $('#continueCreditBtn').addEventListener('click',()=>{const a=targets.find(x=>x.id===Number($('#creditTarget').value));if(a)openCreditModal(a);});
  }catch(err){alert(err.message);}
}
$('#quickCreditBtn')?.addEventListener('click',openCreditChooser);
$('#newCreditBtn')?.addEventListener('click',openCreditChooser);

async function loadCredits(){const d=await api('/api/admin/credit-history');$('#creditsBody').innerHTML=d.movements.length?d.movements.map(x=>`<tr><td>${esc(fmt(x.created_at))}</td><td>${esc(x.kind)}</td><td>${esc(x.from_name||'SISTEMA')}</td><td>${esc(x.to_name)}</td><td class="credit-number">+${x.amount}</td><td>${esc(x.note||'')}</td></tr>`).join(''):`<tr><td colspan="6" class="empty">Sin movimientos.</td></tr>`;}

async function loadPromos(){const d=await api('/api/admin/promotions');state.promos=d.promotions;$('#promotionsBody').innerHTML=state.promos.length?state.promos.map(x=>`<tr data-promo="${x.id}"><td><b>${esc(x.name)}</b></td><td>+${x.percent_bonus}%</td><td>${x.targetLevels.map(l=>roleNames[l]).join(', ')}</td><td>${esc(fmt(x.starts_at))}</td><td>${esc(fmt(x.ends_at))}</td><td><span class="badge ${x.active?'active':'off'}">${x.active?'ACTIVA':'INACTIVA'}</span></td><td><button class="ghost" data-action="promo-toggle">${x.active?'Desactivar':'Activar'}</button></td></tr>`).join(''):`<tr><td colspan="7" class="empty">Sin promociones.</td></tr>`;}
$('#newPromoBtn').addEventListener('click',()=>{const d=new Date(),e=new Date(Date.now()+86400000);const local=x=>new Date(x.getTime()-x.getTimezoneOffset()*60000).toISOString().slice(0,16);openModal(`<h3>Nueva promoción de créditos</h3><form id="promoForm"><label>Nombre<input id="pName" value="Promo +10%" required></label><label>Porcentaje extra<input id="pPct" type="number" min="1" value="10" required></label><div class="form-row"><label>Inicio<input id="pStart" type="datetime-local" value="${local(d)}" required></label><label>Fin<input id="pEnd" type="datetime-local" value="${local(e)}" required></label></div><label>Categorías</label><div class="rule-grid"><label class="switch-row"><input type="checkbox" class="pLevel" value="2" checked> Distribuidor</label><label class="switch-row"><input type="checkbox" class="pLevel" value="3" checked> Revendedor</label><label class="switch-row"><input type="checkbox" class="pLevel" value="4" checked> Vendedor</label></div><div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">Crear promo</button></div><div id="promoMsg" class="msg"></div></form>`);$('#promoForm').addEventListener('submit',async e=>{e.preventDefault();try{await api('/api/admin/promotions',{method:'POST',body:{name:$('#pName').value,percentBonus:Number($('#pPct').value),startsAt:new Date($('#pStart').value).toISOString(),endsAt:new Date($('#pEnd').value).toISOString(),targetLevels:$$('.pLevel:checked').map(x=>Number(x.value))}});closeModal();await loadPromos();}catch(err){msg($('#promoMsg'),err.message);}});});
$('#promotionsBody').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const p=state.promos.find(x=>x.id===Number(b.closest('tr').dataset.promo));if(!p)return;try{await api(`/api/admin/promotions/${p.id}`,{method:'PUT',body:{active:!p.active}});await loadPromos();}catch(err){alert(err.message);}});


async function loadDemos(){
  const d=await api('/api/admin/demo-settings');state.demoSettings=d;
  $('#demoToggleBtn').textContent=d.enabled?'DESACTIVAR DEMOS':'ACTIVAR DEMOS';
  $('#demoToggleBtn').className=d.enabled?'danger-btn':'primary';
  const activeCount=Number(d.activeCount||0);
  $('#demoCutAllBtn').disabled=activeCount===0;
  $('#demoCutAllBtn').textContent=activeCount?`CORTAR TODOS LOS DEMOS ACTIVOS (${activeCount})`:'SIN DEMOS ACTIVOS';
  $('#demoGlobalState').innerHTML=d.enabled
    ? `<span class="badge active">DEMOS ACTIVADOS</span> <span class="muted small">Los nuevos demos pueden iniciarse. ADMINISTRACIÓN puede reducir o cortar cualquier demo activo.</span>`
    : `<span class="badge blocked">DEMOS DESACTIVADOS</span> <span class="muted small">No se pueden iniciar nuevos demos. Los demos activos solo continúan hasta su vencimiento o hasta que ADMINISTRACIÓN los corte.</span>`;
  $('#demosBody').innerHTML=d.demos.length?d.demos.map(x=>{const actions=x.active?`<div class="actions demo-table-actions"><button class="ghost" data-action="demo-10" data-device="${x.device_id}">10 MIN</button><button class="danger-btn" data-action="demo-cut" data-device="${x.device_id}">CORTAR</button></div>`:`<div class="actions demo-table-actions"><span class="muted small">Demo utilizado</span><button class="ghost" data-action="demo-reset" data-device="${x.device_id}">RESETEAR DEMO</button></div>`;return `<tr><td><b>${esc(x.client_name)}</b></td><td>${esc(x.device_name||x.device_uid)}</td><td><code>${esc(x.activation_code)}</code></td><td>${esc(x.granted_by_name)}</td><td>${esc(fmt(x.started_at))}</td><td>${esc(fmt(x.expires_at))}</td><td><span class="badge ${x.active?'active':'blocked'}" ${x.active?liveDemoAttrs(x.remainingSeconds,x.device_id):''}>${x.active?`DEMO ACTIVO · ${fmtDuration(x.remainingSeconds)}`:'FINALIZADO'}</span></td><td>${actions}</td></tr>`;}).join(''):'<tr><td colspan="8" class="empty">Todavía no se otorgaron demos.</td></tr>';
}
$('#demoToggleBtn')?.addEventListener('click',async()=>{try{const enabled=!state.demoSettings?.enabled;if(!confirm(enabled?'¿Activar demos para todas las fichas habilitadas?':'¿Desactivar nuevos demos? Los demos que ya están corriendo seguirán activos salvo que ADMINISTRACIÓN los corte.'))return;await api('/api/admin/demo-settings',{method:'PUT',body:{enabled}});await loadDemos();}catch(e){alert(e.message);}});
$('#demoCutAllBtn')?.addEventListener('click',async()=>{try{const n=Number(state.demoSettings?.activeCount||0);if(!n)return;if(!confirm(`¿CONFIRMAR CORTE DE TODOS LOS DEMOS ACTIVOS?\n\nSe cortarán ${n} demo${n===1?'':'s'} inmediatamente. Los dispositivos seguirán marcados como DEMO UTILIZADO. Los clientes con servicio pago no se modifican.`))return;const r=await api('/api/admin/demos/expire-all',{method:'POST'});alert(`Se cortaron ${r.expiredCount} demo${r.expiredCount===1?'':'s'}.`);await loadDemos();await loadClients(false);}catch(e){alert(e.message);}});
$('#demosBody')?.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const id=Number(b.dataset.device);try{if(b.dataset.action==='demo-10'){if(!confirm('¿Reducir este demo para que termine dentro de 10 minutos?'))return;const r=await api(`/api/admin/client-devices/${id}/demo/reduce-10`,{method:'POST'});alert(`Demo ajustado. Vence ${fmt(r.expiresAt)}.`);}if(b.dataset.action==='demo-cut'){if(!confirm('¿Cortar este demo ahora? El dispositivo seguirá marcado como DEMO UTILIZADO.'))return;await api(`/api/admin/client-devices/${id}/demo/expire`,{method:'POST'});alert('Demo cortado.');}if(b.dataset.action==='demo-reset'){if(!confirm('¿Resetear este demo? El dispositivo podrá recibir un demo nuevo de 10 minutos.'))return;await api(`/api/admin/client-devices/${id}/demo/reset`,{method:'POST'});alert('Demo reseteado.');}await loadDemos();await loadClients(false);}catch(err){alert(err.message);}});

async function loadAdultSettings(){
  const d=await api('/api/admin/adult-settings');state.adultSettings=d;
  $('#adultGlobalEnabled').checked=d.globalEnabled;$('#adultMaxAttempts').value=d.maxAttempts;$('#adultGlobalPin').value='';
  $('#adultPinState').textContent=d.globalPinConfigured?'PIN global configurado. Para cambiarlo ingresá uno nuevo y guardá.':'Todavía no hay PIN global configurado.';
  $('#adultClientsBody').innerHTML=d.clients.length?d.clients.map(c=>{const policy=c.policy==='force_on'?'FORZAR BLOQUEO':c.policy==='force_off'?'DESACTIVAR':'HEREDAR';const pin=c.customPinConfigured?'PROPIO':c.effectivePinConfigured?'GLOBAL':'SIN PIN';const status=c.locked?'<span class="badge blocked">PIN BLOQUEADO</span>':c.effectiveEnabled?'<span class="badge active">PROTEGIDO</span>':'<span class="badge off">SIN BLOQUEO</span>';return `<tr data-adult-client="${c.id}"><td><b>${esc(c.name)}</b></td><td>${esc(c.ownerName)}</td><td>${policy}</td><td>${pin}</td><td>${c.failedAttempts}/${d.maxAttempts}</td><td>${status}</td><td><button class="ghost" data-action="adult-client-config">Configurar</button></td></tr>`;}).join(''):'<tr><td colspan="7" class="empty">Sin clientes finales.</td></tr>';
  msg($('#adultGlobalMsg'),'');
}
$('#adultGlobalForm')?.addEventListener('submit',async e=>{e.preventDefault();try{const pin=$('#adultGlobalPin').value.trim();const body={enabled:$('#adultGlobalEnabled').checked,maxAttempts:Number($('#adultMaxAttempts').value)};if(pin)body.pin=pin;await api('/api/admin/adult-settings',{method:'PUT',body});msg($('#adultGlobalMsg'),'Control de Adultos guardado.',true);await loadAdultSettings();}catch(err){msg($('#adultGlobalMsg'),err.message);}});
$('#adultClientsBody')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const c=state.adultSettings?.clients.find(x=>x.id===Number(b.closest('tr').dataset.adultClient));if(c&&b.dataset.action==='adult-client-config')openAdultClientModal(c);});
function openAdultClientModal(c){
  openModal(`<h3>Adultos — ${esc(c.name)}</h3><form id="adultClientForm"><label>Política<select id="adultPolicy"><option value="inherit" ${c.policy==='inherit'?'selected':''}>Heredar configuración general</option><option value="force_on" ${c.policy==='force_on'?'selected':''}>Forzar bloqueo para este cliente</option><option value="force_off" ${c.policy==='force_off'?'selected':''}>Desactivar bloqueo para este cliente</option></select></label><label>Nuevo PIN exclusivo<input id="adultClientPin" type="password" inputmode="numeric" minlength="4" maxlength="8" placeholder="Vacío = conservar"></label><label class="switch-row"><input id="adultClearPin" type="checkbox"> Quitar PIN exclusivo y volver a usar el global</label><label class="switch-row"><input id="adultLocked" type="checkbox" ${c.locked?'checked':''}> Bloquear PIN de este cliente manualmente</label><div class="muted small">Intentos fallidos actuales: ${c.failedAttempts}. Al desbloquear se reinicia el contador.</div><div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">GUARDAR</button></div><div id="adultClientMsg" class="msg"></div></form>`);
  $('#adultClientForm').addEventListener('submit',async e=>{e.preventDefault();try{const body={policy:$('#adultPolicy').value,locked:$('#adultLocked').checked,clearCustomPin:$('#adultClearPin').checked};const pin=$('#adultClientPin').value.trim();if(pin)body.pin=pin;await api(`/api/admin/clients/${c.id}/adult`,{method:'PUT',body});closeModal();await loadAdultSettings();}catch(err){msg($('#adultClientMsg'),err.message);}});
}

async function loadSources(){const d=await api('/api/admin/sources');state.sources=d.sources;$('#sourcesList').innerHTML=state.sources.map(s=>`<div class="source-row" data-source="${esc(s.source_key)}"><div class="source-title">${esc(s.label)}</div><label>URL<input class="source-url" value="${esc(s.url||'')}" placeholder="https://..."></label><label class="switch-row"><input class="source-enabled" type="checkbox" ${s.enabled?'checked':''}> Habilitada</label></div>`).join('');msg($('#sourcesMsg'),'');}
$('#saveSourcesBtn').addEventListener('click',async()=>{try{const sources=$$('.source-row').map(r=>({key:r.dataset.source,url:r.querySelector('.source-url').value.trim(),enabled:r.querySelector('.source-enabled').checked}));await api('/api/admin/sources',{method:'PUT',body:{sources}});msg($('#sourcesMsg'),'Fuentes guardadas.',true);}catch(e){msg($('#sourcesMsg'),e.message);}});


async function loadContent(){
  const key=$('#contentKey').value;
  try{const d=await api(`/api/admin/content/${key}`);state.content[key]=d;$('#contentJson').value=d.json?JSON.stringify(d.json,null,2):'';$('#contentState').textContent=d.updatedAt?`Guardado: ${fmt(d.updatedAt)}`:'Todavía no hay contenido guardado en el PANEL.';$('#contentPublicUrl').textContent=`URL PANEL: ${location.origin}/api/content/${key}`;msg($('#contentMsg'),'');}catch(e){msg($('#contentMsg'),e.message);}
}
$('#contentKey')?.addEventListener('change',loadContent);
$('#contentLoadBtn')?.addEventListener('click',loadContent);
$('#contentFormatBtn')?.addEventListener('click',()=>{try{const x=JSON.parse($('#contentJson').value);$('#contentJson').value=JSON.stringify(x,null,2);msg($('#contentMsg'),'JSON válido y formateado.',true);}catch(e){msg($('#contentMsg'),'JSON inválido: '+e.message);}});
$('#contentImportBtn')?.addEventListener('click',async()=>{try{const key=$('#contentKey').value;const r=await api(`/api/admin/content/${key}/import`,{method:'POST'});$('#contentJson').value=JSON.stringify(r.json,null,2);msg($('#contentMsg'),`Importado correctamente desde ${r.sourceUrl}. Revisalo y presioná GUARDAR CONTENIDO.`,true);}catch(e){msg($('#contentMsg'),e.message);}});
$('#contentSaveBtn')?.addEventListener('click',async()=>{try{const key=$('#contentKey').value;const json=JSON.parse($('#contentJson').value);await api(`/api/admin/content/${key}`,{method:'PUT',body:{json}});msg($('#contentMsg'),'Contenido guardado en CO-CHI PANEL.',true);await loadContent();}catch(e){msg($('#contentMsg'),e instanceof SyntaxError?'JSON inválido: '+e.message:e.message);}});
$('#contentUseBtn')?.addEventListener('click',async()=>{try{const key=$('#contentKey').value;const url=`${location.origin}/api/content/${key}`;const d=await api('/api/admin/sources');const sources=d.sources.map(s=>({key:s.source_key,url:s.source_key===key?url:s.url,enabled:s.source_key===key?true:s.enabled}));await api('/api/admin/sources',{method:'PUT',body:{sources}});msg($('#contentMsg'),`Listo. ${key.toUpperCase()} ahora usa el contenido administrado desde este PANEL.`,true);}catch(e){msg($('#contentMsg'),e.message);}});

$('#modal').addEventListener('click',async e=>{
  if(e.target.closest('[data-close]')){closeModal();return;}
  const rel=e.target.closest('[data-action="release-panel"]');if(rel){const card=rel.closest('[data-pdev]');if(!confirm('¿Liberar este dispositivo del PANEL?'))return;try{await api(`/api/admin/panel-devices/${Number(card.dataset.pdev)}/release`,{method:'POST'});closeModal();await loadAccounts();}catch(err){alert(err.message);}}
});

if('serviceWorker' in navigator && location.protocol==='https:'){
  window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}
bootstrap();
