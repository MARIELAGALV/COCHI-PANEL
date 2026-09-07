const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = { me:null, accounts:[], clients:[], devices:[], promos:[], sources:[], demoSettings:null, adultSettings:null, playbackSecurity:null, tvGateways:null, homeBanner:null, appTheme:null, roleSettings:{enabledRoleLevels:[1,2,3,4],creatableRoleLevels:[1,2,3,4]}, content:{} };
const roleNames = {1:'ADMINISTRACIÓN',2:'DISTRIBUIDOR',3:'REVENDEDOR',4:'VENDEDOR',5:'CLIENTE'};

function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function fmt(v){if(!v)return '—';const d=new Date(v);return Number.isNaN(d.getTime())?v:d.toLocaleString();}
function days(v){if(!v)return null;return (new Date(v).getTime()-Date.now())/86400000;}
function uid(){let x=localStorage.getItem('cochi_panel_device_uid');if(!x){x='web-'+crypto.randomUUID();localStorage.setItem('cochi_panel_device_uid',x);}return x;}
function deviceName(){return localStorage.getItem('cochi_panel_device_name') || `Navegador ${navigator.platform||''}`.trim();}
function secret(){return localStorage.getItem('cochi_panel_device_secret')||'';}
function setSecret(v){localStorage.setItem('cochi_panel_device_secret',v);}
function setDeviceName(v){localStorage.setItem('cochi_panel_device_name',v);}

function blockedPanelMessage(err){
  const d=err?.data||{};
  const reason=String(d.blockReason||'').trim();
  const byAdmin=String(d.blockedByRole||'').toUpperCase()==='ADMINISTRACIÓN';
  if(d.reason==='manual_block'){
    return `${byAdmin?'Panel bloqueado por Administración':'Panel bloqueado'}${reason?`\nMotivo: ${reason}`:''}`;
  }
  if(d.reason==='panel_deleted')return 'Este panel fue eliminado. Sus clientes activos continúan hasta su vencimiento.';
  if(d.reason==='no_credit_load_for_two_months')return 'Panel bloqueado por inactividad de créditos.';
  return 'Panel bloqueado.';
}

async function api(url,opt={}){
  const o={credentials:'same-origin',...opt};
  if(o.body&&typeof o.body!=='string'){o.headers={...(o.headers||{}),'Content-Type':'application/json'};o.body=JSON.stringify(o.body);}
  const r=await fetch(url,o);let d={};try{d=await r.json()}catch{}
  if(!r.ok){const e=new Error(d.error||`Error ${r.status}`);e.status=r.status;e.data=d;throw e;}return d;
}
function show(id){['setupView','activateView','appView'].forEach(x=>$('#'+x).classList.add('hidden'));$('#'+id).classList.remove('hidden');}
function msg(el,text,ok=false){el.textContent=text||'';el.className='msg'+(text?(ok?' ok':' error'):'');}

function toast(text,kind='ok'){
  let t=$('#appToast');
  if(!t){
    t=document.createElement('div');t.id='appToast';t.className='app-toast';document.body.appendChild(t);
  }
  t.className=`app-toast ${kind}`;
  t.textContent=text;
  t.classList.add('show');
  clearTimeout(window.__cochiToastTimer);
  window.__cochiToastTimer=setTimeout(()=>t.classList.remove('show'),4200);
}
function openModal(html){$('#modal').innerHTML=html;$('#modalBackdrop').classList.remove('hidden');}
function closeModal(){$('#modalBackdrop').classList.add('hidden');$('#modal').classList.remove('content-editor-modal');$('#modal').innerHTML='';}
$('#modalBackdrop').addEventListener('click',e=>{if(e.target!==$('#modalBackdrop'))return;/* El editor de contenido no se cierra tocando fuera: evita cierres accidentales al hacer scroll/tocar en móvil o TV. */if($('#modal').classList.contains('content-editor-modal')){toast('Editor protegido: usá X, Cancelar o Guardar para salir.','ok');return;}closeModal();});

async function bootstrap(){
  const st=await api('/api/setup/status').catch(()=>({needsSetup:false}));
  if(st.needsSetup){show('setupView');return;}
  try{const me=await api('/api/panel/me');state.me=me.account;enterApp();return;}catch{}
  if(secret()){
    try{await loginSaved();return;}catch(e){if(e.status===423){show('activateView');msg($('#activateMsg'),blockedPanelMessage(e));$('#existingDeviceBtn').classList.remove('hidden');return;}}
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

function applyAccessVisibility(){
  $$('.admin-only').forEach(x=>x.classList.toggle('hidden',state.me?.role_level!==1));
  $$('.root-admin-only').forEach(x=>x.classList.toggle('hidden',!state.me?.is_root_admin));
}
function enterApp(){
  show('appView');
  $('#meName').textContent=state.me.name;
  $('#roleEyebrow').textContent=state.me.is_root_admin?'ADMINISTRACIÓN PRINCIPAL':state.me.role_name;
  $('#meCredits').textContent=state.me.role_level===1?'':`${state.me.credits} créditos`;
  applyAccessVisibility();
  switchView('dashboard');
}

$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
$('#contentToolsToggle')?.addEventListener('click',()=>{
  const group=$('#contentToolsGroup');
  const collapsed=group.classList.toggle('collapsed');
  $('#contentToolsToggle').setAttribute('aria-expanded',collapsed?'false':'true');
});
$('#refreshBtn').addEventListener('click',refreshCurrent);
function switchView(name){
  $$('.nav-btn').forEach(x=>x.classList.toggle('active',x.dataset.view===name));
  const contentGroup=$('#contentToolsGroup');
  if(contentGroup&&['content','sources','resolver'].includes(name))contentGroup.classList.remove('collapsed');
  $$('.view').forEach(x=>x.classList.toggle('active',x.id===`view-${name}`));
  document.body.dataset.view=name;
  const t={dashboard:'Inicio',accounts:'Fichas PANEL',clients:'Clientes finales',devices:'Dispositivos',credits:'Créditos',promotions:'Promociones',demos:'Demos',adults:'PIN Adultos',sources:'Fuentes de contenido',content:'Manager de Contenido',resolver:'Resolver stream web',security:'Seguridad de reproducción',appearance:'Diseño y apariencia'};
  $('#pageTitle').textContent=t[name]||name;refreshCurrent();
}
async function refreshMe(){const r=await api('/api/panel/me');state.me=r.account;$('#meName').textContent=state.me.name;$('#roleEyebrow').textContent=state.me.is_root_admin?'ADMINISTRACIÓN PRINCIPAL':state.me.role_name;$('#meCredits').textContent=state.me.role_level===1?'':`${state.me.credits} créditos`;applyAccessVisibility();}
async function refreshCurrent(){
  try{
    await refreshMe();const v=document.body.dataset.view||'dashboard';
    if(v==='dashboard'){await loadDashboard();if(state.me.role_level===1)await loadGlobalCommercialSettings();}
    if(v==='accounts')await loadAccounts();
    if(v==='clients'){if(state.me.role_level===1)await loadAccounts();await loadClients();}
    if(v==='devices')await Promise.all([loadClients(false),loadDevices()]);
    if(v==='credits')await loadCredits();
    if(v==='promotions'&&state.me.role_level===1)await loadPromos();
    if(v==='demos'&&state.me.role_level===1)await loadDemos();
    if(v==='adults'&&state.me.role_level===1)await loadAdultSettings();
    if(v==='security'&&state.me.role_level===1){await loadPlaybackSecurity();await loadTvGateways();}
    if(v==='appearance'&&state.me.role_level===1)await loadAppTheme();
    if(v==='sources'&&state.me.role_level===1){await loadSources();await loadHomeBanner();}
    if(v==='resolver'&&state.me.role_level===1){}
    if(v==='content'&&state.me.role_level===1)await loadContent();
  }catch(e){if(e.status===401||e.status===423){show('activateView');msg($('#activateMsg'),e.status===423?blockedPanelMessage(e):'Volvé a ingresar.');}else console.error(e);}
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

async function loadGlobalCommercialSettings(){
  const [policy,src]=await Promise.all([api('/api/admin/device-policy'),api('/api/admin/sources')]);
  state.devicePolicy=policy;state.sources=src.sources||[];
  const input=$('#globalDeviceBlockSize');if(input)input.value=String(policy.blockSize||2);
  if($('#globalDeviceBlockState'))$('#globalDeviceBlockState').textContent=`Regla activa: 1 crédito = ${policy.blockSize} dispositivo${Number(policy.blockSize)===1?'':'s'} por bloque.`;
  if($('#globalSourceVisibility'))$('#globalSourceVisibility').innerHTML=state.sources.map(x=>`<label class="switch-row"><input type="checkbox" class="global-source-visible" value="${esc(x.source_key)}" ${x.enabled?'checked':''}> ${esc(x.label)} <span class="muted small">${x.enabled?'VISIBLE':'OCULTA'}</span></label>`).join('');
}
$('#saveGlobalDeviceBlockBtn')?.addEventListener('click',async()=>{
  try{const n=Number($('#globalDeviceBlockSize').value);if(!confirm(`¿Cambiar el bloque global a ${n} dispositivo${n===1?'':'s'}?\n\nLa nueva base se aplicará a todos los clientes. Las ampliaciones anteriores se conservan y las próximas sumarán +${n}.`))return;const r=await api('/api/admin/device-policy',{method:'PUT',body:{blockSize:n}});msg($('#globalDeviceBlockState'),`Bloque global actualizado a ${r.blockSize}. Clientes actualizados: ${r.clientsUpdated}.`,true);await loadClients(false).catch(()=>{});await loadGlobalCommercialSettings();}catch(e){msg($('#globalDeviceBlockState'),e.message);}
});
$('#saveGlobalVisibilityBtn')?.addEventListener('click',async()=>{
  try{const visible=new Set($$('.global-source-visible:checked').map(x=>x.value));const sources=(state.sources||[]).map(x=>({key:x.source_key,url:x.url||'',enabled:visible.has(x.source_key)}));const hidden=(state.sources||[]).filter(x=>!visible.has(x.source_key)).map(x=>x.label);if(!confirm(`¿Guardar la visibilidad global?\n\nOcultas: ${hidden.length?hidden.join(', '):'ninguna'}\nEste cambio se entrega a todas las apps desde el backend.`))return;await api('/api/admin/sources',{method:'PUT',body:{sources}});msg($('#globalVisibilityState'),'Visibilidad global actualizada.',true);await loadGlobalCommercialSettings();}catch(e){msg($('#globalVisibilityState'),e.message);}
});

function renderAccounts(){
  const q=($('#accountSearch')?.value||'').trim().toLowerCase();
  const rows=state.accounts.filter(x=>!q||[x.name,x.contact,x.role_name,x.parent_name,x.active?'activa':'deshabilitada',x.manual_blocked?'bloqueada':''].some(v=>String(v||'').toLowerCase().includes(q)));
  $('#accountsBody').innerHTML=rows.length?rows.map(x=>{
    const blocked=x.inactivity_blocked;
    const stat=x.is_root_admin?'<span class="badge active">PROTEGIDA</span>':x.manual_blocked?`<span class="badge blocked">BLOQUEADA</span><div class="muted small">${esc(x.block_reason||'')}</div>`:!x.active?'<span class="badge blocked">DESHABILITADA</span>':blocked?'<span class="badge pending">BLOQUEO 2 MESES</span>':'<span class="badge active">ACTIVA</span>';
    const creditValue=x.role_level===1?'—':x.credits;
    const adminLabel=x.is_root_admin?'Panel principal':(x.role_level===1?'Administrador independiente':esc(x.contact||''));
    const action=x.can_edit!==false?'<button class="ghost" data-action="account-edit">Editar</button>':'<span class="muted small">Protegido</span>';
    return `<tr data-account="${x.id}"><td><b>${esc(x.name)}</b><div class="muted small">${adminLabel}</div></td><td><span class="role-chip role-${x.role_level}">${esc(x.role_name)}</span></td><td>${esc(x.parent_name||'—')}</td><td class="credit-number"><div>${creditValue}</div></td><td>${x.panel_device_count}/2</td><td>${stat}<div class="muted small">${x.next_inactivity_block_at?`Límite: ${esc(fmt(x.next_inactivity_block_at))}`:''}</div></td><td>${action}</td></tr>`;
  }).join(''):`<tr><td colspan="7" class="empty">${q?'No hay paneles que coincidan con la búsqueda.':'No hay fichas PANEL visibles.'}</td></tr>`;
}
async function loadAccounts(render=true){
  const d=await api('/api/admin/accounts');
  state.accounts=d.accounts;
  state.roleSettings={enabledRoleLevels:Array.isArray(d.enabledRoleLevels)?d.enabledRoleLevels:[1,2,3,4],creatableRoleLevels:Array.isArray(d.creatableRoleLevels)?d.creatableRoleLevels:[]};
  renderRoleCreationSettings();
  updateNewAccountButton();
  updateAdminManagementCard();
  if(render)renderAccounts();
}
$('#accountSearch')?.addEventListener('input',renderAccounts);

$('#newAccountBtn').addEventListener('click',()=>openAccountModal());
$('#newAdminBtn')?.addEventListener('click',()=>openAccountModal(null,1));
function currentCreatableRoleLevels(){return Array.isArray(state.roleSettings?.creatableRoleLevels)?state.roleSettings.creatableRoleLevels.map(Number):[];}
function updateAdminManagementCard(){
  const card=$('#adminManagementCard'),count=$('#secondaryAdminCount'),stateEl=$('#adminManagementState'),btn=$('#newAdminBtn');
  if(!card)return;
  const root=Boolean(state.me?.is_root_admin);card.classList.toggle('hidden',!root);if(!root)return;
  const admins=(state.accounts||[]).filter(x=>Number(x.role_level)===1&&!x.is_root_admin);
  if(count)count.textContent=String(admins.length);
  const enabled=(state.roleSettings?.enabledRoleLevels||[]).map(Number).includes(1);
  if(btn){btn.disabled=!enabled;btn.title=enabled?'Crear un administrador con código propio':'Habilitá la categoría Administración para crear nuevos administradores';}
  if(stateEl)stateEl.textContent=enabled?'Cada administrador usa su propio código y sus propias sesiones.':'La creación de Administradores está desactivada en Categorías habilitadas.';
}
function updateNewAccountButton(){
  const b=$('#newAccountBtn');if(!b)return;
  const levels=currentCreatableRoleLevels();
  b.classList.toggle('hidden',levels.length===0);
  b.disabled=levels.length===0;
}
function renderRoleCreationSettings(){
  if(state.me?.role_level!==1)return;
  const enabled=new Set((state.roleSettings?.enabledRoleLevels||[]).map(Number));
  $$('.role-create-toggle').forEach(x=>x.checked=enabled.has(Number(x.value)));
  const names=[...enabled].sort((a,b)=>a-b).map(x=>roleNames[x]).filter(Boolean);
  const st=$('#roleCreationState');if(st)st.textContent=names.length?`Habilitadas: ${names.join(', ')}`:'Todas las categorías PANEL están desactivadas para nuevas altas.';
}
$('#roleSettingsForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const enabledRoleLevels=$$('.role-create-toggle:checked').map(x=>Number(x.value));
  try{
    const r=await api('/api/admin/role-settings',{method:'PUT',body:{enabledRoleLevels}});
    state.roleSettings.enabledRoleLevels=r.enabledRoleLevels||[];
    msg($('#roleSettingsMsg'),'Categorías de creación guardadas.',true);
    await loadAccounts();
  }catch(err){msg($('#roleSettingsMsg'),err.message);}
});
function allowedRoleOptions(current=null){
  let levels=currentCreatableRoleLevels();
  if(current!==null&&current!==undefined&&!levels.includes(Number(current)))levels=[Number(current),...levels];
  levels=[...new Set(levels)].filter(x=>[1,2,3,4].includes(x));
  return levels.map(x=>`<option value="${x}" ${Number(current)===x?'selected':''}>${roleNames[x]}</option>`).join('');
}
function openAccountModal(a=null,forcedRole=null){
  const admin=state.me.role_level===1,root=Boolean(a?.is_root_admin),secondaryAdmin=Boolean(a&&Number(a.role_level)===1&&!root),adminIdentityLocked=Boolean(a?.admin_identity_locked);
  if(a&&a.can_edit===false){toast('Esta cuenta ADMINISTRACIÓN está protegida.','error');return;}
  if(!a&&forcedRole===1&&!state.me?.is_root_admin){toast('Solo la ADMINISTRACIÓN principal puede crear administradores.','error');return;}
  if(!a&&forcedRole!==null&&!currentCreatableRoleLevels().includes(Number(forcedRole))){toast('Esa categoría no está habilitada para nuevas altas.','error');return;}
  if(!a&&forcedRole===null&&currentCreatableRoleLevels().length===0){toast('No hay categorías PANEL habilitadas para crear.','error');return;}
  
  const accountSummary=a?`
    <div class="edit-summary-grid">
      <div class="summary-box"><span>Categoría</span><strong>${esc(a.role_name||'—')}</strong></div>
      <div class="summary-box"><span>Propietario</span><strong>${esc(state.accounts.find(x=>x.id===a.parent_id)?.name||'Administración')}</strong></div>
      <div class="summary-box"><span>Créditos</span><strong>${a.credits_unlimited?'∞':esc(String(a.credits??0))}</strong></div>
      <div class="summary-box"><span>Estado</span><strong class="${a.manual_blocked?'status-red':a.active?'status-green':'status-muted'}">${a.manual_blocked?'🔴 BLOQUEADA':a.active?'🟢 ACTIVA':'⚪ DESHABILITADA'}</strong></div>
      <div class="summary-box"><span>Paneles</span><strong>${esc(String(a.devices_active??0))}/${esc(String(a.devices_limit??2))}</strong></div>
      <div class="summary-box"><span>Código acceso</span><strong class="mono">${esc(a.activation_code||a.code||'—')}</strong></div>
    </div>
    <div class="panel-manage-card">
      <h4>Gestión comercial</h4>
      <div class="panel-control-actions">
        ${!a.credits_unlimited?'<button type="button" class="primary" id="editLoadCredits">Cargar créditos</button>':''}
        <button type="button" class="ghost" id="editPanelDevices">Paneles / dispositivos</button>
        <button type="button" class="ghost" id="editRegenerateCode">Regenerar código</button>
      </div>
    </div>`:'';

const controlSection=a&&!root&&!adminIdentityLocked?`
    <div class="panel-control-card">
      <h4>Control del panel</h4>
      <p class="muted small">Estas acciones no devuelven créditos ni transfieren clientes. Los clientes activos siguen funcionando hasta su vencimiento.</p>
      ${a.manual_blocked
        ? `<div class="block-current"><b>Panel bloqueado</b><div class="muted small">Motivo actual: ${esc(a.block_reason||'Sin motivo')}</div></div>
           <div class="panel-control-actions">
             <button type="button" class="success-action" id="editUnblockPanel">🟢 Desbloquear / Activar panel</button>
             <button type="button" class="danger-btn" id="editDeletePanel">Eliminar panel</button>
           </div>`
        : `<label>Motivo del bloqueo<textarea id="editBlockReason" rows="3" placeholder="Ej.: saldo pendiente, cuenta en revisión, dejó de vender..."></textarea></label>
           <div class="panel-control-actions">
             <button type="button" class="danger-action" id="editBlockPanel">🔴 Bloquear panel</button>
             <button type="button" class="danger-btn" id="editDeletePanel">Eliminar panel</button>
           </div>`}
    </div>`:'';

  const creatingAdmin=!a&&Number(forcedRole)===1;
  const protectedNote=root
    ? '<div class="protected-note">🔒 ADMINISTRACIÓN principal protegida: podés editar nombre, contacto y notas, pero no deshabilitarla, bajarla de categoría ni cambiar su propietario.</div>'
    : adminIdentityLocked?'<div class="protected-note">🔒 Esta cuenta ADMINISTRACIÓN es independiente. Desde este usuario solo se pueden editar sus datos básicos; su categoría, propietario y estado están protegidos.</div>':'';
  const roleValue=a?.role_level||(forcedRole!==null?Number(forcedRole):null);
  const roleField=creatingAdmin
    ? `<label>Categoría<input value="ADMINISTRACIÓN" disabled></label>`
    : `<label>Categoría<select id="aRole" ${(a&&!admin)||root||adminIdentityLocked?'disabled':''}>${allowedRoleOptions(roleValue)}</select></label>`;
  const parentField=a&&admin&&!root&&!adminIdentityLocked?`<label>Propietario<select id="aParent"><option value="">Sin propietario</option>${state.accounts.filter(x=>x.id!==a.id).map(x=>`<option value="${x.id}" ${a.parent_id===x.id?'selected':''}>${esc(x.name)} — ${esc(x.role_name)}</option>`).join('')}</select></label>`:'';
  const activeField=a&&!root&&!adminIdentityLocked?`<label class="switch-row"><input id="aActive" type="checkbox" ${a.active?'checked':''}> Ficha habilitada</label>`:'';
  openModal(`<h3>${a?'Editar ficha PANEL':creatingAdmin?'Nuevo administrador independiente':'Nueva ficha PANEL'}</h3>${creatingAdmin?'<div class="protected-note">🔐 Se creará una cuenta ADMINISTRACIÓN con código propio. Sus inicios de sesión y dispositivos quedan separados de la ADMINISTRACIÓN principal.</div>':''}${protectedNote}${accountSummary}<form id="accountForm"><label>Nombre<input id="aName" required value="${esc(a?.name||'')}"></label><div class="form-row">${roleField}<label>Contacto<input id="aContact" value="${esc(a?.contact||'')}"></label></div>${parentField}<label>Notas<textarea id="aNotes" rows="3">${esc(a?.notes||'')}</textarea></label>${activeField}${controlSection}<div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">Guardar</button></div><div id="accountMsg" class="msg"></div></form>`);

  $('#accountForm').addEventListener('submit',async e=>{
    e.preventDefault();
    try{
      const payload={name:$('#aName').value,contact:$('#aContact').value,notes:$('#aNotes').value};
      if(!a)payload.roleLevel=forcedRole!==null?Number(forcedRole):Number($('#aRole').value);
      else if(admin&&!root&&!adminIdentityLocked)payload.roleLevel=Number($('#aRole').value);
      if(a&&!root&&!adminIdentityLocked){
        payload.active=$('#aActive').checked;
        if(admin)payload.parentId=$('#aParent').value?Number($('#aParent').value):null;
      }
      const r=await api(a?`/api/admin/accounts/${a.id}`:'/api/admin/accounts',{method:a?'PUT':'POST',body:payload});
      if(!a){
        const isIndependentAdmin=Boolean(r.independentAdmin||Number(payload.roleLevel)===1);
        openModal(`<h3>${isIndependentAdmin?'Administrador creado':'Ficha PANEL creada'}</h3><p>${esc(r.role)}</p><div class="code-big">${esc(r.activationCode)}</div><p class="muted">${isIndependentAdmin?'Este es su código propio. Puede activar hasta 2 dispositivos y sus sesiones no reemplazan ni cierran las de la ADMINISTRACIÓN principal.':'Código para activar hasta 2 dispositivos del PANEL.'}</p><div class="modal-actions"><button class="primary" data-close>Listo</button></div>`);
      }else closeModal();
      await loadAccounts();
    }catch(err){msg($('#accountMsg'),err.message);}
  });

  if(a&&!root&&!adminIdentityLocked){
    $('#editBlockPanel')?.addEventListener('click',async()=>{
      const reason=String($('#editBlockReason')?.value||'').trim();
      if(!reason)return msg($('#accountMsg'),'Escribí el motivo del bloqueo.');
      if(!confirm(`¿Bloquear ${a.name}?\n\nNo se devolverán créditos y sus clientes activos seguirán funcionando hasta su vencimiento.`))return;
      try{
        await api(`/api/admin/accounts/${a.id}/block`,{method:'POST',body:{reason}});
        closeModal();await loadAccounts();
      }catch(err){msg($('#accountMsg'),err.message);}
    });

    $('#editUnblockPanel')?.addEventListener('click',async()=>{
      if(!confirm(`¿Desbloquear ${a.name}?`))return;
      try{
        await api(`/api/admin/accounts/${a.id}/unblock`,{method:'POST',body:{}});
        closeModal();await loadAccounts();
      }catch(err){msg($('#accountMsg'),err.message);}
    });

    $('#editDeletePanel')?.addEventListener('click',async()=>{
      if(!confirm(`¿Eliminar el panel ${a.name}?\n\nNO se devolverán créditos.\nNO se transferirán sus clientes.\nLos clientes activos seguirán funcionando hasta su vencimiento.`))return;
      const c=prompt('Escribí ELIMINAR para confirmar definitivamente:');
      if(c!=='ELIMINAR')return;
      try{
        await api(`/api/admin/accounts/${a.id}`,{method:'DELETE',body:{confirm:'ELIMINAR'}});
        closeModal();await loadAccounts();
      }catch(err){msg($('#accountMsg'),err.message);}
    });
    $('#editLoadCredits')?.addEventListener('click',()=>openCreditModal(a));

  }

  // Gestión de dispositivos y código disponible también para la ADMINISTRACIÓN principal.
  if(a){
    $('#editPanelDevices')?.addEventListener('click',()=>openPanelDevices(a));
    $('#editRegenerateCode')?.addEventListener('click',async()=>{
      if(!confirm(`¿Regenerar el código de acceso de ${a.name}?`))return;
      try{
        const r=await api(`/api/admin/accounts/${a.id}/regenerate-code`,{method:'POST',body:{}});
        alert(`Nuevo código: ${r.activationCode||r.code||'generado'}`);
        closeModal();await loadAccounts();
      }catch(err){msg($('#accountMsg'),err.message);}
    });
  }
}

$('#accountsBody').addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return;const tr=b.closest('tr'),a=state.accounts.find(x=>x.id===Number(tr.dataset.account));if(!a)return;
  if(b.dataset.action==='account-edit')openAccountModal(a);
  if(b.dataset.action==='account-credit')openCreditModal(a);
  if(b.dataset.action==='account-devices')openPanelDevices(a);
  if(b.dataset.action==='account-block'){
    const reason=prompt(`Motivo del bloqueo de ${a.name}:`);
    if(reason===null)return;if(!reason.trim())return alert('El motivo es obligatorio.');
    if(!confirm(`¿Bloquear ${a.name}?\n\nNo se devolverán créditos y sus clientes activos seguirán funcionando hasta su vencimiento.`))return;
    try{await api(`/api/admin/accounts/${a.id}/block`,{method:'POST',body:{reason:reason.trim()}});await loadAccounts();}catch(err){alert(err.message);}
  }
  if(b.dataset.action==='account-unblock'){
    if(!confirm(`¿Desbloquear ${a.name}?`))return;
    try{await api(`/api/admin/accounts/${a.id}/unblock`,{method:'POST',body:{}});await loadAccounts();}catch(err){alert(err.message);}
  }
  if(b.dataset.action==='account-delete'){
    if(!confirm(`¿Eliminar el panel ${a.name}?\n\nNO se devolverán créditos.\nNO se transferirán sus clientes.\nLos clientes activos seguirán funcionando hasta su vencimiento.`))return;
    const c=prompt('Escribí ELIMINAR para confirmar:');if(c!=='ELIMINAR')return;
    try{await api(`/api/admin/accounts/${a.id}`,{method:'DELETE',body:{confirm:'ELIMINAR'}});await loadAccounts();}catch(err){alert(err.message);}
  }
});
function openCreditModal(a){
  openModal(`<h3>Cargar créditos</h3><p>Destino: <b>${esc(a.name)}</b> · ${esc(a.role_name)}</p><p class="muted">Carga mínima: <b>10 créditos</b>. Antes de acreditar, el PANEL mostrará un resumen final obligatorio para confirmar el monto.</p>${state.me.role_level===1?'':`<div class="unlimited-box">Saldo disponible: <b>${state.me.credits}</b></div>`}<form id="creditForm"><label>Cantidad<input id="creditAmount" type="number" min="10" step="1" ${state.me.role_level===1?'':`max="${state.me.credits}"`} required value="10"></label><div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">REVISAR CARGA</button></div><div id="creditMsg" class="msg"></div></form>`);
  $('#creditForm').addEventListener('submit',e=>{
    e.preventDefault();const amount=Number($('#creditAmount').value);if(!Number.isInteger(amount)||amount<10){msg($('#creditMsg'),'La carga mínima es de 10 créditos.');return;}
    const current=Number(a.credits||0),result=current+amount;
    openModal(`<h3>Confirmar carga de créditos</h3><div class="credit-confirm-card"><div><span>Destino</span><b>${esc(a.name)} · ${esc(a.role_name)}</b></div><div><span>Saldo actual</span><b>${current}</b></div><div><span>Créditos a cargar</span><strong>+${amount}</strong></div><div><span>Saldo estimado</span><b>${result}${state.me.role_level===1?'':'*'}</b></div></div><p class="muted small">${state.me.role_level===1?'Administración tiene saldo ilimitado.':'*El saldo del destinatario puede incluir bonus de promoción al confirmar.'}</p><div class="warning-card"><b>¿Confirmás que el monto de ${amount} créditos es correcto?</b><span>La operación quedará registrada en el historial con fecha, origen y destino.</span></div><div class="modal-actions"><button type="button" class="ghost" id="backCreditBtn">VOLVER</button><button type="button" class="primary" id="confirmCreditBtn">CONFIRMAR ${amount} CRÉDITOS</button></div><div id="creditConfirmMsg" class="msg"></div>`);
    $('#backCreditBtn').addEventListener('click',()=>openCreditModal(a));
    $('#confirmCreditBtn').addEventListener('click',async()=>{try{const r=await api(`/api/admin/accounts/${a.id}/credits`,{method:'POST',body:{amount}});openModal(`<h3>Carga realizada</h3><p>Se cargaron <b>${r.baseAmount}</b> créditos.</p><p>Bonus automático: <b>${r.promoBonus}</b></p><p>Total recibido: <b>${r.totalReceived}</b></p>${r.senderUnlimited?'':`<p class="muted">A quien cargó se le descontaron ${r.senderCharged} créditos. Saldo restante: ${r.senderBalance}.</p>`}<div class="modal-actions"><button class="primary" data-close>Listo</button></div>`);await refreshMe();await loadAccounts();}catch(err){msg($('#creditConfirmMsg'),err.message);}});
  });
}

async function openPanelDevices(a){
  try{
    const d=await api(`/api/admin/accounts/${a.id}/panel-devices`);
    const own=Number(a.id)===Number(state.me.id);
    const currentUid=uid();
    openModal(`<h3>Dispositivos PANEL — ${esc(a.name)}</h3>
      <p class="muted">Máximo 2 activos.${own?' Para usar un equipo nuevo, liberá uno de los actuales y luego activá el nuevo con el mismo código de acceso.':''}</p>
      ${d.devices.length?d.devices.map(x=>{
        const current=String(x.device_uid)===String(currentUid);
        return `<div class="rule-card" data-pdev="${x.id}" data-current="${current?'1':'0'}">
          <b>${esc(x.device_name||x.device_uid)}${current?' · ESTE DISPOSITIVO':''}</b>
          <span>${esc(x.device_uid)} · ${x.active?'ACTIVO':'LIBERADO'} · Último: ${esc(fmt(x.last_seen_at))}</span>
          ${x.active?`<div class="mt10"><button class="danger-btn" data-action="release-panel">${own?'Liberar para reemplazar':'Liberar dispositivo'}</button></div>`:''}
        </div>`;
      }).join(''):'<p class="empty">Sin dispositivos.</p>'}
      ${own?`<div class="warning-card mt10"><b>Reemplazar equipo</b><span>La ADMINISTRACIÓN principal debe conservar al menos 1 dispositivo activo. Si liberás el equipo que estás usando ahora, esta sesión se cerrará.</span></div>`:''}
      <div class="modal-actions"><button class="ghost" data-close>Cerrar</button></div>`);
  }catch(e){alert(e.message);}
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

function renderClients(){
  const q=($('#clientSearch')?.value||'').trim().toLowerCase();
  const rows=state.clients.filter(c=>!q||[c.name,c.owner_name,c.display_status,c.active?'activo':'inactivo',c.expires_at?'activado':'sin activar'].some(v=>String(v||'').toLowerCase().includes(q)));
  $('#clientsBody').innerHTML=rows.length?rows.map(c=>{
    const rem=c.days_remaining;
    let remainingLabel='<span class="badge off">SIN ACTIVAR</span>';
    if(c.expires_at&&Number.isFinite(Number(rem))){
      const whole=Math.ceil(Number(rem));
      remainingLabel=whole>0?`<span class="badge active">Vence en ${whole} día${whole===1?'':'s'}</span>`:`<span class="badge blocked">VENCIDO</span>`;
    }
    const stat=clientStatusBadge(c);
    const linked=c.linked_device_count??c.device_count;
    const demoLine=c.demo_active_count?`<div class="muted small success-text">Demo activo en ${c.demo_active_count} dispositivo${c.demo_active_count>1?'s':''}</div>`:'';
    return `<tr data-client="${c.id}"><td><b>${esc(c.name)}</b></td><td>${esc(c.owner_name)}</td><td>${esc(c.expires_at?fmt(c.expires_at):'Sin activar')}</td><td>${remainingLabel}</td><td>${c.device_count}/${c.device_limit||2} <div class="muted small">${linked}/${c.device_limit||2} códigos vinculados</div>${demoLine}</td><td>${stat}</td><td><button class="ghost" data-action="client-edit">Editar</button></td></tr>`;
  }).join(''):`<tr><td colspan="7" class="empty">${q?'No hay clientes que coincidan con la búsqueda.':'No hay clientes finales.'}</td></tr>`;
}
async function loadClients(render=true){const d=await api('/api/admin/clients');state.clients=d.clients;if(render)renderClients();}
$('#clientSearch')?.addEventListener('input',renderClients);
$('#newClientBtn').addEventListener('click',()=>openClientModal());

function openClientModal(c=null){
  const admin=state.me.role_level===1;
  const owners=admin?state.accounts.filter(x=>x.role_level<=4):[];
  const rem=c?.expires_at&&Number.isFinite(Number(c.days_remaining))?Math.max(0,Math.ceil(Number(c.days_remaining))):null;
  const remainingText=c?.expires_at?(rem>0?`${rem} día${rem===1?'':'s'}`:'Vencido'):'Sin activar';
  const renewDisabled=Boolean(c&&!c.renew_available);
  const renewTitle=renewDisabled?'Se habilita cuando queden 10 días o menos':'Activar o sumar 30 días';
  const clientSummary=c?`
    <div class="edit-summary-grid">
      <div class="summary-box"><span>Estado</span><strong>${esc(c.display_status||'—')}</strong></div>
      <div class="summary-box"><span>Vencimiento</span><strong>${esc(c.expires_at?fmt(c.expires_at):'Sin activar')}</strong></div>
      <div class="summary-box"><span>Tiempo restante</span><strong>${esc(remainingText)}</strong></div>
      <div class="summary-box"><span>Dispositivos</span><strong>${esc(String(c.device_count??0))}/${esc(String(c.device_limit||2))}</strong></div>
      <div class="summary-box"><span>Propietario</span><strong>${esc(c.owner_name||'—')}</strong></div>
    </div>
    <div class="client-manage-card">
      <h4>Gestión del cliente</h4>
      <div class="panel-control-actions">
        <button type="button" class="primary" id="clientRenewBtn" ${renewDisabled?'disabled':''} title="${esc(renewTitle)}">${c.expires_at?'Renovar 30 días':'Activar 30 días'}</button>
        ${c.demo_active_count?'<button type="button" class="success-btn" id="clientConvertDemoBtn">CONVERTIR DEMO EN CLIENTE</button>':''}
        <button type="button" class="code-btn" id="clientCodesBtn">Códigos / Dispositivos</button>
        <button type="button" class="danger-btn" id="clientDeleteBtn">Eliminar cliente</button>
      </div>
      <p class="muted small">La renovación conserva los días restantes. Los demos se rigen por la configuración global de ADMINISTRACIÓN.</p>
    </div>`:'';

  openModal(`<h3>${c?'Editar cliente final':'Nuevo cliente final'}</h3>${clientSummary}
    <form id="clientForm">
      <label>Nombre<input id="cName" required value="${esc(c?.name||'')}"></label>
      ${admin?`<label>Propietario<select id="cOwner"><option value="${state.me.id}">${esc(state.me.name)} — PANEL PRINCIPAL</option>${owners.filter(x=>x.id!==state.me.id).map(x=>`<option value="${x.id}" ${c?.owner_account_id===x.id?'selected':''}>${esc(x.name)} — ${esc(x.role_name)}</option>`).join('')}</select></label><div class="client-code-box muted"><b>Capacidad global</b><span>Base y ampliaciones se administran con la regla global de dispositivos. No se modifica manualmente por cliente.</span></div>`:''}
      <label>Notas<textarea id="cNotes" rows="3">${esc(c?.notes||'')}</textarea></label>
      ${c?`<label class="switch-row"><input id="cActive" type="checkbox" ${c.active?'checked':''}> Cliente habilitado</label>`:
      `<div class="client-code-box muted"><b>Códigos CO-CHI</b><span>Primero guardá el cliente. Luego podrás vincular sus dispositivos.</span></div>`}
      <div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">Guardar</button></div>
      <div id="clientMsg" class="msg"></div>
    </form>`);

  $('#clientCodesBtn')?.addEventListener('click',()=>openClientCodes(c));
  $('#clientRenewBtn')?.addEventListener('click',async()=>{
    if(renewDisabled)return;
    const renewCost=Number(c.renew_credit_cost||Math.max(1,Math.ceil(Number(c.device_limit||2)/2)));
    const q=state.me?.role_level===1?`¿Activar/renovar a ${c.name} por 30 días?`:`¿Usar ${renewCost} crédito${renewCost===1?'':'s'} para activar/renovar a ${c.name}?`;
    if(!confirm(q))return;
    try{
      const r=await api(`/api/admin/clients/${c.id}/renew`,{method:'POST'});
      alert(`Nuevo vencimiento: ${fmt(r.newExpiry)}`);
      closeModal();await refreshMe();await loadClients();
    }catch(err){msg($('#clientMsg'),err.message);}
  });
  $('#clientConvertDemoBtn')?.addEventListener('click',async()=>{
    const cost=Number(c.renew_credit_cost||Math.max(1,Math.ceil(Number(c.device_limit||2)/2)));
    if(!confirm(`¿Convertir ahora el demo de ${c.name} en servicio normal por 30 días?\n\nCosto: ${state.me.role_level===1?'sin descuento para ADMINISTRACIÓN':cost+' crédito(s) al propietario'}.\nEl demo termina ahora y todos los dispositivos del perfil compartirán el mismo vencimiento.`))return;
    try{const r=await api(`/api/admin/clients/${c.id}/convert-demo`,{method:'POST'});alert(`Demo convertido a servicio normal. Nuevo vencimiento: ${fmt(r.newExpiry)}.`);closeModal();await refreshMe();await loadClients();}catch(err){msg($('#clientMsg'),err.message);}
  });
  $('#clientDeleteBtn')?.addEventListener('click',()=>openDeleteClientModal(c));

  $('#clientForm').addEventListener('submit',async e=>{
    e.preventDefault();
    try{
      const body={name:$('#cName').value,notes:$('#cNotes').value};
      if(admin){body.ownerAccountId=Number($('#cOwner').value);}
      if(c)body.active=$('#cActive').checked;
      const r=await api(c?`/api/admin/clients/${c.id}`:'/api/admin/clients',{method:c?'PUT':'POST',body});
      closeModal();
      await loadClients();
      if(!c){
        const created=state.clients.find(x=>x.id===Number(r.id));
        if(created)setTimeout(()=>openClientModal(created),150);
      }
    }catch(err){msg($('#clientMsg'),err.message);}
  });
}
$('#clientsBody').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  const c=state.clients.find(x=>x.id===Number(b.closest('tr')?.dataset.client));if(!c)return;
  if(b.dataset.action==='client-edit')openClientModal(c);
});

function openDeleteClientModal(c){
  openModal(`<h3>Eliminar cliente</h3><div class="danger-card"><b>Vas a eliminar a ${esc(c.name)}</b><p>Se eliminarán también sus dispositivos y sesiones vinculadas. Esta acción no se puede deshacer desde esta pantalla.</p></div><label>Motivo (opcional)<textarea id="deleteClientReason" rows="2" placeholder="Ej.: cliente dado de baja"></textarea></label><div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button type="button" class="danger" id="confirmDeleteClientBtn">CONFIRMAR ELIMINACIÓN</button></div><div id="deleteClientMsg" class="msg"></div>`);
  $('#confirmDeleteClientBtn').addEventListener('click',async()=>{try{await api(`/api/admin/clients/${c.id}`,{method:'DELETE',body:{confirm:'ELIMINAR',reason:$('#deleteClientReason').value}});closeModal();await loadClients();alert(`Cliente ${c.name} eliminado.`);}catch(err){msg($('#deleteClientMsg'),err.message);}});
}

async function openClientCodes(c){
  const admin=state.me?.role_level===1;
  try{
    const d=await api(`/api/admin/clients/${c.id}/devices`);
    const linked=d.devices||[];
    const limit=Number(d.deviceLimit||d.clientStatus?.device_limit||c.device_limit||2);
    const slots=Math.max(0,limit-linked.filter(x=>x.status==='active'||x.status==='pending').length);
    const changes=Number(d.changesThisMonth||0),changesRemaining=Number(d.changesRemaining??Math.max(0,2-changes)),blockSize=Number(d.deviceBlockSize||2),extraBlocks=Number(d.extraDeviceBlocks||0);
    openModal(`
      <h3>Códigos y dispositivos — ${esc(c.name)}</h3>
      <p class="muted">Vinculá códigos de activación CO-CHI y administrá los dispositivos de este cliente. ADMINISTRACIÓN define si los demos están habilitados y si duran 10 minutos o 1 hora. Al vincular un código a un cliente sin servicio, el demo se aplica automáticamente si está habilitado.</p>
      <form id="clientCodeForm">
        <label>Código de activación CO-CHI
          <input id="clientActivationCode" placeholder="ABCD-1234" autocomplete="off" ${slots===0?'disabled':''} required>
        </label>
        <div class="modal-actions" style="justify-content:flex-start">
          <button type="submit" class="primary" ${slots===0?'disabled':''}>VINCULAR CÓDIGO</button>
        </div>
        <div id="clientCodeMsg" class="msg"></div>
      </form>
      <div class="client-device-stats">
        <div class="compact-rule"><b>Capacidad</b><span>${linked.length}/${limit} dispositivos vinculados · ${slots} lugar${slots===1?'':'es'} disponible${slots===1?'':'s'}.</span></div>
        <div class="compact-rule"><b>Reemplazos</b><span>${changes}/2 usados este mes · ${changesRemaining} disponible${changesRemaining===1?'':'s'}.</span></div>
        <div class="compact-rule"><b>Vencimiento único</b><span>${c.expires_at?esc(fmt(c.expires_at)):'Sin servicio activo'}. Los adicionales vencen el mismo día.</span></div>
      </div>
      <div class="rule-card profile-expand-card"><div><b>Ampliar capacidad</b><span>Bloque vigente: +${blockSize} dispositivos · ${extraBlocks} ampliación${extraBlocks===1?'':'es'} contratada${extraBlocks===1?'':'s'}. Cada ampliación comparte el vencimiento del cliente y suma 1 crédito al costo de renovación.</span></div><button type="button" class="primary" id="addDeviceBlockBtn">+ ${blockSize} DISPOSITIVOS · 1 CRÉDITO</button></div>
      <div class="client-devices-list">
        ${linked.length?linked.map((x,i)=>`<div class="rule-card device-demo-card">
          <div class="device-main-info"><div class="device-title-row"><b>${esc(x.device_name||'Dispositivo '+(i+1))}</b><span class="badge ${x.status==='active'?'active':x.status==='blocked'?'blocked':'pending'}">${esc((x.status||'pending').toUpperCase())}</span></div><code class="device-code">${esc(x.activation_code)}</code><span class="device-uid">${esc(x.device_uid)}</span>${x.last_seen_at?`<span class="device-last">Última actividad: ${esc(fmt(x.last_seen_at))}</span>`:''}</div>
          <div class="demo-action">
            <button type="button" class="danger-btn device-delete-btn" data-device="${x.id}">DESVINCULAR / REEMPLAZAR</button>
          </div>
        </div>`).join(''):'<p class="empty">Todavía no hay códigos vinculados.</p>'}
      </div>
      <div class="modal-actions"><button class="ghost" data-close>Cerrar</button></div>
    `);
    const form=$('#clientCodeForm');
    if(form)form.addEventListener('submit',async ev=>{
      ev.preventDefault();msg($('#clientCodeMsg'),'');
      try{
        const r=await api('/api/admin/client-devices/assign-by-code',{method:'POST',body:{activationCode:$('#clientActivationCode').value,clientId:c.id}});
        msg($('#clientCodeMsg'),r.autoDemo?`Código vinculado. DEMO AUTOMÁTICO DE ${r.demoDurationMinutes===60?'1 HORA':r.demoDurationMinutes+' MINUTOS'} activo hasta ${fmt(r.demoExpiresAt)}.`:(r.waitingForService?(r.autoDemoReason==='demos_disabled'?'Código vinculado. Los demos están desactivados por ADMINISTRACIÓN.':r.autoDemoReason==='demo_already_used'?'Código vinculado, pero este dispositivo ya utilizó su demo.':'Código vinculado. Sin servicio activo.'):'Código vinculado y dispositivo activo.'),true);
        await loadClients(false);setTimeout(()=>openClientCodes(state.clients.find(x=>x.id===c.id)||c),250);
      }catch(err){msg($('#clientCodeMsg'),err.message);}
    });
    $('#addDeviceBlockBtn')?.addEventListener('click',async()=>{
      const costText=state.me?.role_level===1?'ADMINISTRACIÓN no descuenta saldo.':'Se descontará 1 crédito de la ficha propietaria.';
      if(!confirm(`¿Agregar +${blockSize} dispositivos a ${c.name}?\n\n${costText}\nLos nuevos dispositivos tendrán el mismo vencimiento del cliente.`))return;
      try{const r=await api(`/api/admin/clients/${c.id}/extra-devices`,{method:'POST'});alert(`Capacidad ampliada: ${r.oldLimit} → ${r.newLimit} dispositivos. Bloque agregado: +${r.blockSize}. Crédito consumido: ${r.creditsSpent}.`);await refreshMe();await loadClients(false);openClientCodes(state.clients.find(x=>x.id===c.id)||c);}catch(err){alert(err.message);}
    });
    $$('.device-delete-btn').forEach(btn=>btn.addEventListener('click',async()=>{
      if(!confirm(`¿Desvincular este dispositivo para reemplazarlo? Este cambio cuenta dentro del límite mensual (máximo 2). No devuelve créditos ni reinicia demos. Después podrás vincular el nuevo equipo.`))return;
      try{const r=await api(`/api/admin/client-devices/${Number(btn.dataset.device)}`,{method:'DELETE'});alert(`Dispositivo desvinculado. Cambios este mes: ${r.changesThisMonth}/2.`);await loadClients(false);openClientCodes(state.clients.find(x=>x.id===c.id)||c);}catch(err){alert(err.message);}
    }));
  }catch(err){alert(err.message);}
}

async function loadDeviceCleanup(){
  if(!state.me?.is_root_admin)return;
  const r=await api('/api/admin/device-cleanup');
  if($('#cleanupPendingCount'))$('#cleanupPendingCount').textContent=String(r.pendingUnassigned||0);
  if($('#cleanupReleasedCount'))$('#cleanupReleasedCount').textContent=String(r.releasedPanel||0);
  if($('#cleanupStaleCount'))$('#cleanupStaleCount').textContent=String(r.stalePending||0);
  if($('#cleanupDays'))$('#cleanupDays').textContent=String(r.automaticAfterDays||7);
  if($('#deviceCleanupState'))$('#deviceCleanupState').textContent=`Inactivos para limpieza manual: ${Number(r.totalInactive||0)} · La limpieza automática solo elimina PENDIENTES sin actividad.`;
}
async function loadDevices(){
  const d=await api('/api/admin/client-devices');state.devices=d.devices;
  $('#devicesBody').innerHTML=state.devices.length?state.devices.map(x=>{const eff=x.effective_status||x.status.toUpperCase();const cls=eff==='ACTIVO'||eff==='DEMO ACTIVO'?'active':eff==='BLOQUEADO'||eff==='DEMO VENCIDO'?'blocked':'pending';const demo=x.demo?.active?`<div class="muted small success-text" ${liveDemoAttrs(x.demo.remainingSeconds,x.id)}>DEMO ACTIVO · ${fmtDuration(x.demo.remainingSeconds)}</div>`:x.demo?.used?'<div class="muted small">Demo usado</div>':'';return `<tr data-device="${x.id}"><td><code>${esc(x.activation_code)}</code></td><td><b>${esc(x.device_name||x.device_uid)}</b><div class="muted small">${esc(x.device_uid)}</div></td><td>${esc(x.client_name||'Pendiente')}</td><td>${esc(x.owner_name||'—')}</td><td><span class="badge ${cls}">${esc(eff)}</span>${demo}</td><td>${esc(fmt(x.last_seen_at))}</td><td><div class="actions">${x.status==='active'?'<button class="danger-btn" data-action="device-block">Bloquear</button>':''}${x.status==='blocked'?'<button class="ghost" data-action="device-reactivate">Reactivar</button>':''}</div></td></tr>`;}).join(''):`<tr><td colspan="7" class="empty">Sin dispositivos asociados.</td></tr>`;
  if(state.me?.is_root_admin)await loadDeviceCleanup();
}
$('#manualClientDeviceBtn').addEventListener('click',async()=>{try{const r=await api('/api/admin/client-devices/manual',{method:'POST',body:{deviceName:'Dispositivo de prueba'}});openModal(`<h3>Dispositivo de prueba creado</h3><div class="code-big">${esc(r.activationCode)}</div><p class="muted">Usá “Activar por código” para asociarlo a un cliente.</p><div class="modal-actions"><button class="primary" data-close>Listo</button></div>`);}catch(e){alert(e.message);}});
$('#assignByCodeBtn').addEventListener('click',()=>{if(!state.clients.length){alert('Primero creá un cliente.');return;}openModal(`<h3>Activar dispositivo por código</h3><form id="assignForm"><label>Código CO-CHI<input id="assignCode" placeholder="ABCD-1234" required></label><label>Cliente<select id="assignClient">${state.clients.map(c=>`<option value="${c.id}">${esc(c.name)} (${c.device_count}/${c.device_limit||2})</option>`).join('')}</select></label><div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">ACTIVAR</button></div><div id="assignMsg" class="msg"></div></form>`);$('#assignForm').addEventListener('submit',async e=>{e.preventDefault();try{await api('/api/admin/client-devices/assign-by-code',{method:'POST',body:{activationCode:$('#assignCode').value,clientId:Number($('#assignClient').value)}});closeModal();await loadDevices();await loadClients(false);}catch(err){msg($('#assignMsg'),err.message);}});});
$('#devicesBody').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const id=Number(b.closest('tr').dataset.device);try{if(b.dataset.action==='device-block'){if(!confirm('¿Bloquear? No se devuelve ningún crédito; se libera un lugar dentro del límite de dispositivos definido por ADMINISTRACIÓN.'))return;await api(`/api/admin/client-devices/${id}/block`,{method:'POST'});}if(b.dataset.action==='device-reactivate')await api(`/api/admin/client-devices/${id}/reactivate`,{method:'POST'});await loadDevices();}catch(err){alert(err.message);}});

async function runDeviceCleanup(kind){
  if(!state.me?.is_root_admin)return;
  try{
    const st=await api('/api/admin/device-cleanup');
    const pending=Number(st.pendingUnassigned||0),released=Number(st.releasedPanel||0);
    let count=0,label='';
    if(kind==='pending'){count=pending;label='PENDIENTES sin cliente';}
    if(kind==='released'){count=released;label='LIBERADOS del PANEL';}
    if(kind==='all'){count=pending+released;label='INACTIVOS (PENDIENTES + LIBERADOS)';}
    if(count<1){alert(`No hay registros ${label} para eliminar.`);await loadDeviceCleanup();return;}
    const warning=`Se eliminarán ${count} registro(s) ${label}.

PENDIENTES: ${pending}
LIBERADOS: ${released}

NO se eliminarán dispositivos ACTIVOS, BLOQUEADOS, clientes, créditos ni cuentas ADMINISTRACIÓN.`;
    if(!confirm(`${warning}

¿Querés continuar?`))return;
    if(kind==='all'&&!confirm('CONFIRMACIÓN FINAL: esta limpieza elimina todo el historial inactivo indicado arriba. Los ACTIVOS quedan protegidos. ¿Continuar?'))return;
    const r=await api(`/api/admin/device-cleanup/${kind}`,{method:'POST'});
    const text=`Limpieza finalizada · ${Number(r.deletedPending||0)} PENDIENTES · ${Number(r.deletedReleased||0)} LIBERADOS eliminados.`;
    alert(text);toast(text,'ok');
    await loadDevices();
  }catch(err){alert(err.message);}
}
$('#cleanupPendingBtn')?.addEventListener('click',()=>runDeviceCleanup('pending'));
$('#cleanupReleasedBtn')?.addEventListener('click',()=>runDeviceCleanup('released'));
$('#cleanupAllBtn')?.addEventListener('click',()=>runDeviceCleanup('all'));

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


async function loadPlaybackSecurity(){
  const d=await api('/api/admin/playback-security');state.playbackSecurity=d;
  const on=Boolean(d.enabled),workerOk=Boolean(d.worker?.ok);
  $('#playbackSecurityBadge').className=`badge ${on?'active':'off'}`;
  $('#playbackSecurityBadge').textContent=on?'SEGURIDAD ENCENDIDA':'MODO COMPATIBLE';
  $('#playbackSecurityToggleBtn').textContent=on?'APAGAR SEGURIDAD':'ENCENDER SEGURIDAD';
  $('#playbackSecurityToggleBtn').className=on?'danger-btn':'primary';
  $('#playbackSecurityRotateBtn').disabled=!d.gatewayConfigured;
  $('#playbackSecuritySyncBtn').disabled=!d.gatewayConfigured;
  $('#playbackSecurityState').innerHTML=`<div><b>Gateway:</b> ${esc(d.gatewayConfigured?(d.gatewayUrl||'configurado'):'NO CONFIGURADO')}</div><div><b>Worker:</b> ${workerOk?'EN LÍNEA':'SIN RESPUESTA'} · <b>Generación:</b> ${esc(d.generation)} · <b>Ticket:</b> ${Math.round(Number(d.ticketTtlSeconds||0)/60)} min</div>${d.worker?.error?`<div class="muted small">${esc(d.worker.error)}</div>`:''}`;
  msg($('#playbackSecurityMsg'),'');
}
$('#playbackSecurityToggleBtn')?.addEventListener('click',async()=>{try{
  const enabled=!state.playbackSecurity?.enabled;
  if(!confirm(enabled?'¿ENCENDER SEGURIDAD DE REPRODUCCIÓN? El panel verificará primero el Worker. Si no responde, no se activará.':'¿Volver a MODO COMPATIBLE? Las listas volverán a usar sus URLs de reproducción actuales.'))return;
  await api('/api/admin/playback-security',{method:'PUT',body:{enabled}});await loadPlaybackSecurity();
  toast(enabled?'Seguridad de reproducción activada.':'Modo compatible restaurado.');
}catch(e){msg($('#playbackSecurityMsg'),e.message);}});
$('#playbackSecurityRotateBtn')?.addEventListener('click',async()=>{try{
  if(!confirm('¿ROTAR LA CLAVE AHORA? Los tickets de reproducción anteriores dejarán de ser válidos cuando el Worker reciba la nueva generación.'))return;
  const r=await api('/api/admin/playback-security/rotate',{method:'POST'});await loadPlaybackSecurity();toast(`Clave rotada · generación ${r.generation}`);
}catch(e){msg($('#playbackSecurityMsg'),e.message);}});
$('#playbackSecuritySyncBtn')?.addEventListener('click',async()=>{try{await api('/api/admin/playback-security/sync',{method:'POST'});await loadPlaybackSecurity();toast('Worker sincronizado.');}catch(e){msg($('#playbackSecurityMsg'),e.message);}});

async function loadTvGateways(){
  const d=await api('/api/admin/tv-gateways');state.tvGateways=d;
  for(const key of ['tv1','tv2']){
    const x=d[key]||{},on=Boolean(x.enabled),ok=Boolean(x.worker?.ok),btn=$(`#${key}GatewayToggleBtn`),box=$(`#${key}GatewayState`);
    if(btn){btn.textContent=on?`APAGAR ${key.toUpperCase()}`:`ENCENDER ${key.toUpperCase()}`;btn.className=on?'danger-btn':'primary';btn.disabled=!x.configured&&!on;}
    if(box)box.innerHTML=`${x.configured?esc(x.gatewayUrl||'configurado'):'NO CONFIGURADO'}<br><b>${ok?'WORKER EN LÍNEA':'WORKER SIN RESPUESTA'}</b> · ${Math.round(Number(x.ticketTtlSeconds||d.ticketTtlSeconds||0)/60)} min`;
  }
  msg($('#tvGatewaysMsg'),'');
}
async function toggleTvGateway(key){
  try{
    const x=state.tvGateways?.[key]||{},enabled=!x.enabled,label=key.toUpperCase();
    if(!confirm(enabled?`¿ENCENDER ${label} GATEWAY? Desde ese momento las URLs de ${label} para la app nueva pasarán por su Worker exclusivo.`:`¿APAGAR ${label} GATEWAY? ${label} volverá a usar el flujo compatible.`))return;
    await api(`/api/admin/tv-gateways/${key}`,{method:'PUT',body:{enabled}});
    await loadTvGateways();toast(`${label} Gateway ${enabled?'activado':'apagado'}.`);
  }catch(e){msg($('#tvGatewaysMsg'),e.message);}
}
$('#tv1GatewayToggleBtn')?.addEventListener('click',()=>toggleTvGateway('tv1'));
$('#tv2GatewayToggleBtn')?.addEventListener('click',()=>toggleTvGateway('tv2'));

async function loadDemos(){
  const d=await api('/api/admin/demo-settings');state.demoSettings=d;
  $('#demoToggleBtn').textContent=d.enabled?'DESACTIVAR DEMOS':'ACTIVAR DEMOS';
  $('#demoToggleBtn').className=d.enabled?'danger-btn':'primary';
  const activeCount=Number(d.activeCount||0);
  const demoMinutes=Number(d.durationMinutes||10);
  $('#demoDuration10Btn').className=demoMinutes===10?'primary':'ghost';
  $('#demoDuration60Btn').className=demoMinutes===60?'primary':'ghost';
  $('#demoDurationState').textContent=`Duración actual para nuevos demos: ${demoMinutes===60?'1 hora':'10 minutos'}.`;
  $('#demoCutAllBtn').disabled=activeCount===0;
  $('#demoCutAllBtn').textContent=activeCount?`CORTAR TODOS LOS DEMOS ACTIVOS (${activeCount})`:'SIN DEMOS ACTIVOS';
  $('#demoGlobalState').innerHTML=d.enabled
    ? `<span class="badge active">DEMOS ACTIVADOS</span> <span class="muted small">Los nuevos demos pueden iniciarse. ADMINISTRACIÓN puede reducir o cortar cualquier demo activo.</span>`
    : `<span class="badge blocked">DEMOS DESACTIVADOS</span> <span class="muted small">No se pueden iniciar nuevos demos. Los demos activos solo continúan hasta su vencimiento o hasta que ADMINISTRACIÓN los corte.</span>`;
  const blocked=new Set((d.blockedCategories||[]).map(x=>String(x).toLocaleLowerCase('es')));
  const available=d.availableCategories||[];
  $('#demoCategoryOptions').innerHTML=available.length?available.map(name=>`<label class="switch-row demo-category-option"><input type="checkbox" class="demoBlockedCategory" value="${esc(name)}" ${blocked.has(String(name).toLocaleLowerCase('es'))?'checked':''}> <span>${esc(name)}</span></label>`).join(''):`<span class="muted small">Publicá contenido para ver las categorías disponibles.</span>`;
  $('#demoCategoryState').textContent=(d.blockedCategories||[]).length?`Bloqueadas en demos: ${(d.blockedCategories||[]).join(', ')}`:'Las demos actualmente reciben todas las categorías.';
  $('#demosBody').innerHTML=d.demos.length?d.demos.map(x=>{const actions=x.active?`<div class="actions demo-table-actions"><button class="ghost" data-action="demo-10" data-device="${x.device_id}">10 MIN</button><button class="danger-btn" data-action="demo-cut" data-device="${x.device_id}">CORTAR</button></div>`:`<div class="actions demo-table-actions"><span class="muted small">Demo utilizado</span><button class="ghost" data-action="demo-reset" data-device="${x.device_id}">RESETEAR DEMO</button></div>`;return `<tr><td><b>${esc(x.client_name)}</b></td><td>${esc(x.device_name||x.device_uid)}</td><td><code>${esc(x.activation_code)}</code></td><td>${esc(x.granted_by_name)}</td><td>${esc(fmt(x.started_at))}</td><td>${esc(fmt(x.expires_at))}</td><td><span class="badge ${x.active?'active':'blocked'}" ${x.active?liveDemoAttrs(x.remainingSeconds,x.device_id):''}>${x.active?`DEMO ACTIVO · ${fmtDuration(x.remainingSeconds)}`:'FINALIZADO'}</span></td><td>${actions}</td></tr>`;}).join(''):'<tr><td colspan="8" class="empty">Todavía no se otorgaron demos.</td></tr>';
}
$('#demoToggleBtn')?.addEventListener('click',async()=>{try{const enabled=!state.demoSettings?.enabled;if(!confirm(enabled?'¿Activar demos para todas las fichas habilitadas?':'¿Desactivar nuevos demos? Los demos que ya están corriendo seguirán activos salvo que ADMINISTRACIÓN los corte.'))return;await api('/api/admin/demo-settings',{method:'PUT',body:{enabled}});await loadDemos();}catch(e){alert(e.message);}});
$('#demoDuration10Btn')?.addEventListener('click',async()=>{try{await api('/api/admin/demo-settings',{method:'PUT',body:{durationMinutes:10}});await loadDemos();}catch(e){alert(e.message);}});
$('#demoDuration60Btn')?.addEventListener('click',async()=>{try{await api('/api/admin/demo-settings',{method:'PUT',body:{durationMinutes:60}});await loadDemos();}catch(e){alert(e.message);}});
$('#demoCategoriesSaveBtn')?.addEventListener('click',async()=>{try{const blockedCategories=$$('.demoBlockedCategory:checked').map(x=>x.value);await api('/api/admin/demo-settings',{method:'PUT',body:{blockedCategories}});await loadDemos();alert(blockedCategories.length?'Restricciones de demos guardadas.':'Las demos vuelven a recibir todas las categorías.');}catch(e){alert(e.message);}});
$('#demoCutAllBtn')?.addEventListener('click',async()=>{try{const n=Number(state.demoSettings?.activeCount||0);if(!n)return;if(!confirm(`¿CONFIRMAR CORTE DE TODOS LOS DEMOS ACTIVOS?\n\nSe cortarán ${n} demo${n===1?'':'s'} inmediatamente. Los dispositivos seguirán marcados como DEMO UTILIZADO. Los clientes con servicio pago no se modifican.`))return;const r=await api('/api/admin/demos/expire-all',{method:'POST'});alert(`Se cortaron ${r.expiredCount} demo${r.expiredCount===1?'':'s'}.`);await loadDemos();await loadClients(false);}catch(e){alert(e.message);}});
$('#demosBody')?.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const id=Number(b.dataset.device);try{if(b.dataset.action==='demo-10'){if(!confirm('¿Reducir este demo para que termine dentro de 10 minutos?'))return;const r=await api(`/api/admin/client-devices/${id}/demo/reduce-10`,{method:'POST'});alert(`Demo ajustado. Vence ${fmt(r.expiresAt)}.`);}if(b.dataset.action==='demo-cut'){if(!confirm('¿Cortar este demo ahora? El dispositivo seguirá marcado como DEMO UTILIZADO.'))return;await api(`/api/admin/client-devices/${id}/demo/expire`,{method:'POST'});alert('Demo cortado.');}if(b.dataset.action==='demo-reset'){if(!confirm('¿Resetear este demo? El dispositivo podrá recibir nuevamente un demo de 10 minutos o 1 hora.'))return;await api(`/api/admin/client-devices/${id}/demo/reset`,{method:'POST'});alert('Demo reseteado.');}await loadDemos();await loadClients(false);}catch(err){alert(err.message);}});

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

async function loadHomeBanner(){
  const d=await api('/api/admin/home-banner');const b=d.banner||{};state.homeBanner=b;
  $('#homeBannerEnabled').checked=!!b.enabled;$('#homeBannerType').value=b.type||'image';$('#homeBannerMediaUrl').value=b.mediaUrl||'';$('#homeBannerFallback').value=b.fallbackImage||'';$('#homeBannerEyebrow').value=b.eyebrow||'DESTACADO';$('#homeBannerTitle').value=b.title||'';$('#homeBannerDescription').value=b.description||'';$('#homeBannerMeta').value=b.meta||'';$('#homeBannerButtonText').value=b.buttonText||'Ver ahora';$('#homeBannerExploreText').value=b.exploreButtonText||'Explorar';$('#homeBannerShowPrimary').checked=b.showPrimaryButton!==false;$('#homeBannerShowExplore').checked=b.showExploreButton!==false;$('#homeBannerShowEyebrow').checked=b.showEyebrow!==false;$('#homeBannerShowTitle').checked=b.showTitle!==false;$('#homeBannerShowDescription').checked=b.showDescription!==false;$('#homeBannerShowMeta').checked=b.showMeta!==false;$('#homeBannerShowScrim').checked=b.showScrim!==false;$('#homeBannerTargetSource').value=b.targetSource||'';$('#homeBannerTargetId').value=b.targetId||'';
  const extras=Array.isArray(b.extraMediaUrls)?b.extraMediaUrls:[];const box=$('#homeBannerExtraUrls');if(box)box.innerHTML=Array.from({length:9},(_,i)=>`<label>PORTADA ${i+2}<input class="home-banner-extra" type="url" value="${esc(extras[i]||'')}" placeholder="https://.../portada-${i+2}.jpg"></label>`).join('');
  if($('#homeBannerRotationSeconds'))$('#homeBannerRotationSeconds').value=Number(b.rotationSeconds||8);msg($('#homeBannerMsg'),'');
}
$('#saveHomeBannerBtn')?.addEventListener('click',async()=>{
  const extraMediaUrls=$$('.home-banner-extra').map(x=>x.value.trim()).filter(Boolean).slice(0,9);
  const banner={enabled:$('#homeBannerEnabled').checked,type:$('#homeBannerType').value,mediaUrl:$('#homeBannerMediaUrl').value.trim(),fallbackImage:$('#homeBannerFallback').value.trim(),eyebrow:$('#homeBannerEyebrow').value.trim(),title:$('#homeBannerTitle').value.trim(),description:$('#homeBannerDescription').value.trim(),meta:$('#homeBannerMeta').value.trim(),buttonText:$('#homeBannerButtonText').value.trim(),exploreButtonText:$('#homeBannerExploreText').value.trim(),showPrimaryButton:$('#homeBannerShowPrimary').checked,showExploreButton:$('#homeBannerShowExplore').checked,showEyebrow:$('#homeBannerShowEyebrow').checked,showTitle:$('#homeBannerShowTitle').checked,showDescription:$('#homeBannerShowDescription').checked,showMeta:$('#homeBannerShowMeta').checked,showScrim:$('#homeBannerShowScrim').checked,targetSource:$('#homeBannerTargetSource').value,targetId:$('#homeBannerTargetId').value.trim(),extraMediaUrls,rotationSeconds:Number($('#homeBannerRotationSeconds')?.value||8)};
  try{await api('/api/admin/home-banner',{method:'PUT',body:{banner}});msg($('#homeBannerMsg'),'BANNER GUARDADO. Hasta 10 destacados disponibles para rotación.',true);toast('Banner principal actualizado','ok');await loadHomeBanner()}catch(e){msg($('#homeBannerMsg'),e.message);toast(e.message,'bad')}
});


const THEME_PRESETS={
  blue:{primary:'#00CFFF',selection:'#1E90FF',background:'#0A0F1B',button:'#162338',border:'#1E3D6B',text:'#FFFFFF',secondary:'#B0B0B0'},
  red:{primary:'#FF3948',selection:'#E8192E',background:'#12090D',button:'#2A1118',border:'#6A2631',text:'#FFFFFF',secondary:'#D2B8BD'},
  green:{primary:'#38E87A',selection:'#14B85B',background:'#07140D',button:'#10281A',border:'#245F3B',text:'#FFFFFF',secondary:'#B5CEBE'},
  violet:{primary:'#B14CFF',selection:'#8534D8',background:'#100918',button:'#21122F',border:'#59307A',text:'#FFFFFF',secondary:'#C6B7D0'},
  orange:{primary:'#FF9D24',selection:'#F27016',background:'#160E06',button:'#2F1D0D',border:'#74451D',text:'#FFFFFF',secondary:'#D5C1AA'},
  dark:{primary:'#E8F0F7',selection:'#64798C',background:'#06090D',button:'#151A20',border:'#38434E',text:'#FFFFFF',secondary:'#A7B0B8'}
};
function themeRead(){return {preset:$('#themePreset').value,primary:$('#themePrimaryHex').value.toUpperCase(),selection:$('#themeSelectionHex').value.toUpperCase(),background:$('#themeBackgroundHex').value.toUpperCase(),button:$('#themeButtonHex').value.toUpperCase(),border:$('#themeBorderHex').value.toUpperCase(),text:$('#themeTextHex').value.toUpperCase(),secondary:$('#themeSecondaryHex').value.toUpperCase()}}
function themePut(x){const t=x||THEME_PRESETS.blue;$('#themePreset').value=t.preset||'custom';for(const k of ['Primary','Selection','Background','Button','Border','Text','Secondary']){const key=k.toLowerCase();const val=t[key]||THEME_PRESETS.blue[key];$('#theme'+k).value=val;$('#theme'+k+'Hex').value=val;}themePreview()}
function themePreview(){const t=themeRead(),p=$('#themePreview');if(!p)return;p.style.setProperty('--tp',t.primary);p.style.setProperty('--ts',t.selection);p.style.setProperty('--tb',t.background);p.style.setProperty('--tbtn',t.button);p.style.setProperty('--tborder',t.border);p.style.setProperty('--tt',t.text);p.style.setProperty('--tm',t.secondary)}
async function loadAppTheme(){const d=await api('/api/admin/app-theme');state.appTheme=d;themePut(d.draft||d.published||d.defaults);$('#themePublishedBadge').textContent='TEMA PUBLICADO';msg($('#themeMsg'),'')}
$('#themePreset')?.addEventListener('change',()=>{const v=$('#themePreset').value;if(v!=='custom'&&THEME_PRESETS[v])themePut({preset:v,...THEME_PRESETS[v]});else themePreview()});
for(const k of ['Primary','Selection','Background','Button','Border','Text','Secondary']){const c='#theme'+k,h='#theme'+k+'Hex';$(c)?.addEventListener('input',()=>{$(h).value=$(c).value.toUpperCase();$('#themePreset').value='custom';themePreview()});$(h)?.addEventListener('input',()=>{if(/^#[0-9A-Fa-f]{6}$/.test($(h).value)){$(c).value=$(h).value;$('#themePreset').value='custom';themePreview()}})}
$('#saveThemeDraftBtn')?.addEventListener('click',async()=>{try{const r=await api('/api/admin/app-theme/draft',{method:'PUT',body:{theme:themeRead()}});state.appTheme.draft=r.theme;msg($('#themeMsg'),'BORRADOR GUARDADO. Los clientes todavía conservan el tema publicado.',true);toast('Borrador de diseño guardado','ok')}catch(e){msg($('#themeMsg'),e.message);toast(e.message,'bad')}});
$('#publishThemeBtn')?.addEventListener('click',async()=>{if(!confirm('¿Publicar estos colores para CO-CHI? Los dispositivos los tomarán al actualizar su configuración.'))return;try{const r=await api('/api/admin/app-theme/publish',{method:'POST',body:{theme:themeRead()}});state.appTheme.published=r.theme;msg($('#themeMsg'),'TEMA PUBLICADO CORRECTAMENTE.',true);toast('Diseño publicado en CO-CHI','ok')}catch(e){msg($('#themeMsg'),e.message);toast(e.message,'bad')}});
$('#resetThemeBtn')?.addEventListener('click',async()=>{try{const r=await api('/api/admin/app-theme/reset',{method:'POST'});themePut(r.theme);msg($('#themeMsg'),'Azul CO-CHI restaurado en el borrador. Publicá para aplicarlo a clientes.',true)}catch(e){msg($('#themeMsg'),e.message)}});

async function loadSources(){
  const d=await api('/api/admin/sources');state.sources=d.sources;
  $('#sourcesList').innerHTML=state.sources.map(s=>{const priv=s.private_upload;const privInfo=priv?`<div class="source-private-info"><span class="badge active">FUENTE PRIVADA EN PANEL</span><b>${esc(priv.fileName||`${s.source_key}.json`)}</b><span>${Number(priv.stats?.categories||0)} categorías · ${Number(priv.stats?.items||0)} contenidos · ${(Number(priv.bytes||0)/1024).toFixed(1)} KB</span><span>Actualizada: ${esc(fmt(priv.updatedAt||priv.uploadedAt))}</span></div>`:'';return `<div class="source-row" data-source="${esc(s.source_key)}"><div class="source-head"><div class="source-title">${esc(s.label)}</div><label class="switch-row"><input class="source-enabled" type="checkbox" ${s.enabled?'checked':''}> Habilitada</label></div>${privInfo}<div class="source-fields"><label>URL EXTERNA DE ORIGEN${priv?' (opcional / desvinculada)':''}<input class="source-url" value="${esc(s.url||'')}" placeholder="https://github.com/.../lista.json" title="${esc(s.url||'')}"></label><label>ENDPOINT PROTEGIDO PARA CO-CHI<input class="source-delivery" value="${esc(s.delivery_url||'')}" readonly title="${esc(s.delivery_url||'')}"></label></div><div class="source-actions"><input class="private-json-file" type="file" accept=".json,application/json" hidden><button class="primary source-upload-json" type="button">SUBIR JSON AL PANEL</button>${!priv?'<button class="primary source-migrate-private" type="button">MIGRAR URL AL PANEL</button>':'<button class="ghost source-remove-private" type="button">VOLVER A URL EXTERNA</button>'}<button class="primary source-save-import" type="button">GUARDAR E IMPORTAR URL</button><span class="source-status muted small"></span></div><div class="muted small source-help">${priv?'Esta lista maestra vive dentro del PANEL. La app nunca necesita GitHub para cargarla. Podés dejar la URL externa vacía. Guardar en JSON original actualiza esta copia privada.':'Podés subir un JSON directamente o usar MIGRAR URL AL PANEL para copiar la lista actual al almacenamiento privado y desvincular la URL externa.'}</div></div>`}).join('');msg($('#sourcesMsg'),'');}
$('#saveSourcesBtn').addEventListener('click',async()=>{try{const sources=$$('.source-row').map(r=>({key:r.dataset.source,url:r.querySelector('.source-url').value.trim(),enabled:r.querySelector('.source-enabled').checked}));await api('/api/admin/sources',{method:'PUT',body:{sources}});const text='CAMBIOS GUARDADOS CORRECTAMENTE';msg($('#sourcesMsg'),text,true);toast(text,'ok');await loadSources();msg($('#sourcesMsg'),text,true);}catch(e){const text='NO SE PUDIERON GUARDAR LOS CAMBIOS · '+e.message;msg($('#sourcesMsg'),text);toast(text,'bad');}});
$('#sourcesList')?.addEventListener('click',async e=>{
  const row=e.target.closest('.source-row');if(!row)return;const key=row.dataset.source,status=row.querySelector('.source-status'),label=(row.querySelector('.source-title')?.textContent||key).trim();
  const upload=e.target.closest('.source-upload-json');if(upload){const input=row.querySelector('.private-json-file');input.value='';input.click();return;}
  const migrate=e.target.closest('.source-migrate-private');if(migrate){const url=row.querySelector('.source-url').value.trim();if(!url){toast(`${label}: ingresá primero la URL externa que querés migrar.`,'bad');return;}if(!confirm(`¿Migrar ${label} al almacenamiento privado del PANEL?\n\nEl panel copiará la lista, la guardará cifrada y luego quitará la dependencia de la URL externa. No borres todavía el archivo externo hasta probar que CO-CHI carga correctamente.`))return;migrate.disabled=true;const old=migrate.textContent;migrate.textContent='MIGRANDO...';status.textContent='Copiando lista al almacenamiento privado...';try{const r=await api(`/api/admin/sources/${key}/migrate-private`,{method:'POST',body:{url,fileName:`${key}.json`}});const text=`${label}: MIGRADA AL PANEL · ${r.stats.categories} categorías · ${r.stats.items} contenidos`;toast(text,'ok');msg($('#sourcesMsg'),text,true);await loadSources();}catch(err){const text=`${label}: NO SE PUDO MIGRAR · ${err.message}`;status.textContent=text;status.className='source-status msg error';toast(text,'bad');}finally{migrate.disabled=false;migrate.textContent=old;}return;}
  const remove=e.target.closest('.source-remove-private');if(remove){if(!confirm(`¿Quitar la fuente privada de ${label} y volver a depender de una URL externa? La copia gestionada y la publicada en la app no se borrarán.`))return;try{await api(`/api/admin/sources/${key}/private-upload`,{method:'DELETE'});toast(`${label}: fuente privada quitada.`,'ok');await loadSources();}catch(err){toast(err.message,'bad')}return;}
  const b=e.target.closest('.source-save-import');if(!b)return;const url=row.querySelector('.source-url').value.trim(),enabled=row.querySelector('.source-enabled').checked;if(!url){const text='Ingresá una URL externa para importar. Si la lista ya está privada en el panel, no necesitás usar este botón.';status.textContent=text;status.className='source-status msg error';toast(text,'bad');return;}b.disabled=true;const old=b.textContent;b.textContent='IMPORTANDO...';status.textContent='Guardando URL e importando JSON...';status.className='source-status muted small';try{const r=await api(`/api/admin/sources/${key}/save-import`,{method:'POST',body:{url,enabled}});const st=r.stats?`${r.stats.categories} categorías · ${r.stats.items} contenidos${r.stats.nested?` · ${r.stats.nested} capítulos/entradas`:''}`:'contenido actualizado';const text=`${label}: GUARDADO E IMPORTADO CORRECTAMENTE · ${st}`;status.textContent=text;status.className='source-status msg ok';msg($('#sourcesMsg'),text,true);toast(text,'ok');await loadSources();}catch(err){const text=`${label}: NO SE PUDO IMPORTAR · ${err.message}`;status.textContent=text;status.className='source-status msg error';msg($('#sourcesMsg'),text);toast(text,'bad');}finally{b.disabled=false;b.textContent=old;}
});
$('#sourcesList')?.addEventListener('change',async e=>{const input=e.target.closest('.private-json-file');if(!input||!input.files?.[0])return;const row=input.closest('.source-row'),key=row.dataset.source,label=(row.querySelector('.source-title')?.textContent||key).trim(),status=row.querySelector('.source-status'),file=input.files[0];if(file.size>25*1024*1024){toast('El JSON supera 25 MB.','bad');return;}if(!confirm(`¿Subir ${file.name} como FUENTE MAESTRA PRIVADA de ${label}?\n\nEl archivo quedará en el almacenamiento privado del PANEL. Se conservarán hasta 5 respaldos anteriores.`))return;status.textContent='Leyendo y validando JSON...';status.className='source-status muted small';try{const raw=await file.text();const json=JSON.parse(raw);if(!Array.isArray(json))throw new Error('El JSON debe ser un arreglo de categorías');const r=await api(`/api/admin/sources/${key}/upload-json`,{method:'POST',body:{fileName:file.name,json}});const text=`${label}: FUENTE PRIVADA GUARDADA · ${r.stats.categories} categorías · ${r.stats.items} contenidos`;toast(text,'ok');msg($('#sourcesMsg'),text,true);await loadSources();}catch(err){const text='NO SE PUDO SUBIR EL JSON · '+err.message;status.textContent=text;status.className='source-status msg error';toast(text,'bad');}});


function contentPlain(){
  const raw=$('#contentJson').value.trim();if(!raw)return [];
  const x=JSON.parse(raw);if(!Array.isArray(x))throw new Error('La lista debe ser un arreglo de categorías.');return x;
}
function setContentPlain(x){$('#contentJson').value=x?JSON.stringify(x,null,2):'';renderContentVisual();}
function contentItemName(x){return x?.name||x?.title||x?.nombre||'(sin nombre)';}
function contentItemMeta(x){const bits=[];if(x?.uri)bits.push(x.uri);if(Array.isArray(x?.temp))bits.push(`${x.temp.length} capítulos/entradas`);return bits.join(' · ');}
function contentItemHidden(x){return x?._cochiHidden===true;}
function contentCategoryHidden(x){return x?._cochiHidden===true;}
function contentAutoHideDate(x){const ms=Date.parse(String(x?._cochiAutoHideAt||''));return Number.isFinite(ms)?new Date(ms):null;}
function contentAutoHideLabel(x){const d=contentAutoHideDate(x);if(!d)return '';return `Se oculta ${d.toLocaleDateString([], {day:'2-digit',month:'2-digit'})} ${d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;}
function localDateTimeValue(date){const d=date instanceof Date?date:new Date(date);if(!Number.isFinite(d.getTime()))return '';const pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;}
function moveArrayItem(arr,from,to){
  if(!Array.isArray(arr)||from<0||from>=arr.length)return;
  to=Math.max(0,Math.min(arr.length-1,to));if(from===to)return;
  const [item]=arr.splice(from,1);arr.splice(to,0,item);
}
function ensureContentUiState(){
  if(!state.contentOpen)state.contentOpen=new Set();
  if(state.contentQuery===undefined)state.contentQuery='';
}
function renderContentVisual(){
  ensureContentUiState();
  const box=$('#contentVisual');if(!box)return;let data;
  try{data=contentPlain();}catch(e){box.innerHTML=`<div class="empty error">JSON inválido: ${esc(e.message)}</div>`;return;}
  if(!data.length){box.innerHTML='<div class="empty muted">La lista está vacía. Podés agregar una categoría.</div>';return;}
  const q=String($('#contentSearch')?.value||state.contentQuery||'').trim().toLowerCase();state.contentQuery=q;
  const contentKey=$('#contentKey')?.value||'',isTvGrid=contentKey==='tv1'||contentKey==='tv2';
  const visible=data.map((g,gi)=>{
    const items=Array.isArray(g.samples)?g.samples:[];
    const catMatch=String(g.name||'').toLowerCase().includes(q);
    const matchedItems=q&&!catMatch?items.map((x,si)=>({x,si})).filter(({x})=>[contentItemName(x),contentItemMeta(x)].some(v=>String(v||'').toLowerCase().includes(q))):items.map((x,si)=>({x,si}));
    if(q&&!catMatch&&!matchedItems.length)return '';
    const isOpen=q?true:state.contentOpen.has(gi);
    const shown=catMatch?items.map((x,si)=>({x,si})):matchedItems;
    const categoryHidden=isTvGrid&&contentCategoryHidden(g),categoryTimer=isTvGrid?contentAutoHideLabel(g):'';
    return `<div class="content-category ${isOpen?'open':''} ${categoryHidden?'content-category-hidden':''}">
      <div class="content-category-head">
        <button class="category-toggle" data-category-toggle="${gi}" aria-expanded="${isOpen?'true':'false'}">
          <span class="category-chevron">${isOpen?'▾':'▸'}</span>
          <span><strong>${esc(g.name||`Categoría ${gi+1}`)}${categoryHidden?' <span class="hidden-channel-badge">OCULTA</span>':''}${categoryTimer?` <span class="scheduled-hide-badge">⏱ ${esc(categoryTimer)}</span>`:''}</strong><span class="muted small">${items.length} contenidos${isTvGrid&&items.some(contentItemHidden)?` · ${items.filter(contentItemHidden).length} canal${items.filter(contentItemHidden).length===1?'':'es'} oculto${items.filter(contentItemHidden).length===1?'':'s'}`:''}${categoryHidden?' · categoría fuera de CO-CHI':''} · posición ${gi+1}/${data.length}</span></span>
        </button>
        <div class="content-category-actions"><button class="order-btn" title="Subir categoría" data-cat-quick="${gi}:up">↑</button><button class="order-btn" title="Bajar categoría" data-cat-quick="${gi}:down">↓</button>${isTvGrid?`<button class="ghost mini timer-btn" title="Programar ocultamiento automático" data-auto-hide-category="${gi}">⏱</button>${categoryHidden?`<button class="primary mini" data-category-show="${gi}">MOSTRAR</button>`:''}`:''}<button class="ghost mini" data-content-add="${gi}">+ CONTENIDO</button><button class="ghost mini" data-category-edit="${gi}">EDITAR</button><button class="danger mini" data-category-delete="${gi}">ELIMINAR</button></div>
      </div>
      <div class="content-items ${isOpen?'':'collapsed'}">${shown.map(({x,si})=>{const timer=isTvGrid?contentAutoHideLabel(x):'';return `<div class="content-item ${contentItemHidden(x)?'content-item-hidden':''}">
        ${x?.icon?`<img src="${esc(x.icon)}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}
        <div class="content-item-main"><strong>${esc(contentItemName(x))}${contentItemHidden(x)?' <span class="hidden-channel-badge">OCULTO</span>':''}${timer?` <span class="scheduled-hide-badge">⏱ ${esc(timer)}</span>`:''}</strong><span class="muted small">${esc(contentItemMeta(x))}</span><span class="muted tiny">Posición ${si+1}/${items.length}${contentItemHidden(x)?' · no aparece en CO-CHI':''}</span></div>
        <div class="content-item-actions"><button class="order-btn" title="Subir contenido" data-item-quick="${gi}:${si}:up">↑</button><button class="order-btn" title="Bajar contenido" data-item-quick="${gi}:${si}:down">↓</button>${isTvGrid?`<button class="ghost mini timer-btn" title="Programar ocultamiento automático" data-auto-hide-item="${gi}:${si}">⏱</button><button class="${contentItemHidden(x)?'primary':'ghost'} mini" data-content-visibility="${gi}:${si}">${contentItemHidden(x)?'MOSTRAR':'OCULTAR'}</button>`:''}<button class="ghost mini" data-content-edit="${gi}:${si}">EDITAR</button><button class="danger mini" data-content-delete="${gi}:${si}">ELIMINAR</button></div>
      </div>`}).join('')||'<div class="empty muted small">Sin contenidos.</div>'}</div>
    </div>`;
  }).join('');
  box.innerHTML=visible||'<div class="empty muted">No hay resultados para esa búsqueda.</div>';

  $$('[data-category-toggle]').forEach(b=>b.onclick=()=>{
    const i=Number(b.dataset.categoryToggle);
    if(state.contentOpen.has(i))state.contentOpen.delete(i);else state.contentOpen.add(i);
    renderContentVisual();
  });
  $$('[data-cat-quick]').forEach(b=>b.onclick=()=>{
    const [i0,dir]=b.dataset.catQuick.split(':'),i=Number(i0),d=contentPlain();
    const to=dir==='up'?Math.max(0,i-1):Math.min(d.length-1,i+1);
    if(to===i)return;
    moveArrayItem(d,i,to);state.contentOpen=new Set([to]);setContentPlain(d);
  });
  $$('[data-item-quick]').forEach(b=>b.onclick=()=>{
    const [g0,i0,dir]=b.dataset.itemQuick.split(':'),g=Number(g0),i=Number(i0),d=contentPlain();
    const items=d[g]?.samples||[],to=dir==='up'?Math.max(0,i-1):Math.min(items.length-1,i+1);
    if(to===i)return;
    moveArrayItem(items,i,to);d[g].samples=items;state.contentOpen.add(g);setContentPlain(d);
  });
  $$('[data-content-add]').forEach(b=>b.onclick=()=>editContentItem(Number(b.dataset.contentAdd),null));
  $$('[data-content-edit]').forEach(b=>b.onclick=()=>{const [g,i]=b.dataset.contentEdit.split(':').map(Number);editContentItem(g,i);});
  $$('[data-content-visibility]').forEach(b=>b.onclick=async()=>{
    const [g,i]=b.dataset.contentVisibility.split(':').map(Number),d=contentPlain(),item=d[g]?.samples?.[i];if(!item)return;
    const key=$('#contentKey')?.value||'';if(!['tv1','tv2'].includes(key))return;
    const wasHidden=contentItemHidden(item),name=contentItemName(item);
    b.disabled=true;const oldText=b.textContent;b.textContent=wasHidden?'MOSTRANDO...':'OCULTANDO...';
    try{
      if(wasHidden)delete item._cochiHidden;else item._cochiHidden=true;
      await quickPublishContent(key,d,{syncOriginal:true,successText:`${name} ${wasHidden?'MOSTRADO':'OCULTADO'}`});
      state.contentOpen.add(g);setContentPlain(d);
    }catch(err){
      if(wasHidden)item._cochiHidden=true;else delete item._cochiHidden;
      msg($('#contentMsg'),'No se pudo cambiar la visibilidad: '+err.message);toast(err.message,'bad');b.disabled=false;b.textContent=oldText;
    }
  });
  $$('[data-auto-hide-item]').forEach(b=>b.onclick=()=>{const [g,i]=b.dataset.autoHideItem.split(':').map(Number);openAutoHideScheduler('item',g,i);});
  $$('[data-auto-hide-category]').forEach(b=>b.onclick=()=>openAutoHideScheduler('category',Number(b.dataset.autoHideCategory),null));
  $$('[data-category-show]').forEach(b=>b.onclick=async()=>{
    const g=Number(b.dataset.categoryShow),d=contentPlain(),group=d[g];if(!group)return;
    const key=$('#contentKey')?.value||'';b.disabled=true;b.textContent='MOSTRANDO...';
    try{delete group._cochiHidden;delete group._cochiAutoHideAt;await quickPublishContent(key,d,{syncOriginal:true,successText:`${group.name||'CATEGORÍA'} MOSTRADA`});state.contentOpen.add(g);setContentPlain(d);}
    catch(err){msg($('#contentMsg'),'No se pudo mostrar la categoría: '+err.message);toast(err.message,'bad');b.disabled=false;b.textContent='MOSTRAR';}
  });
  $$('[data-content-delete]').forEach(b=>b.onclick=()=>{
    const [g,i]=b.dataset.contentDelete.split(':').map(Number),d=contentPlain(),name=contentItemName(d[g].samples[i]);
    if(confirm(`¿Eliminar ${name}?`)){d[g].samples.splice(i,1);setContentPlain(d);}
  });
  $$('[data-category-edit]').forEach(b=>b.onclick=()=>editCategory(Number(b.dataset.categoryEdit)));
  $$('[data-category-delete]').forEach(b=>b.onclick=()=>{
    const i=Number(b.dataset.categoryDelete),d=contentPlain();
    if(confirm(`¿Eliminar la categoría ${d[i]?.name||''} y todos sus contenidos?`)){d.splice(i,1);state.contentOpen=new Set();setContentPlain(d);}
  });
}
function openAutoHideScheduler(kind,groupIndex,itemIndex=null){
  let d;try{d=contentPlain();}catch(e){return alert(e.message);}
  const key=$('#contentKey')?.value||'';if(!['tv1','tv2'].includes(key))return;
  const target=kind==='category'?d[groupIndex]:d[groupIndex]?.samples?.[itemIndex];if(!target)return;
  const name=kind==='category'?(target.name||`Categoría ${groupIndex+1}`):contentItemName(target);
  const current=contentAutoHideDate(target),defaultEnd=current||new Date(Date.now()+2*60*60*1000);
  openModal(`<h3>Ocultamiento automático</h3><p class="muted">${kind==='category'?'Categoría':'Canal'}: <b>${esc(name)}</b></p>${current?`<div class="schedule-current">⏱ Actualmente: <b>${esc(contentAutoHideLabel(target))}</b></div>`:''}<form id="autoHideForm"><label>Modo<select id="autoHideMode"><option value="duration">Duración del evento</option><option value="exact">Fecha y hora de finalización</option></select></label><div id="autoHideDurationFields" class="two"><label>Horas<input id="autoHideHours" type="number" min="0" max="168" step="1" value="2"></label><label>Minutos<input id="autoHideMinutes" type="number" min="0" max="59" step="1" value="0"></label></div><div id="autoHideExactFields" style="display:none"><label>Se ocultará en<input id="autoHideExact" type="datetime-local" value="${esc(localDateTimeValue(defaultEnd))}"></label></div><p class="muted tiny">El servidor hará el ocultamiento aunque cierres el panel. Al finalizar, no se borra nada: queda como OCULTO y se puede volver a MOSTRAR.</p><div id="autoHideMsg" class="msg"></div><div class="modal-actions">${current?'<button type="button" id="cancelAutoHideBtn" class="danger">CANCELAR PROGRAMACIÓN</button>':''}<button type="button" class="ghost" data-close>VOLVER</button><button type="submit" class="primary">PROGRAMAR</button></div></form>`);
  $$('[data-close]').forEach(x=>x.onclick=closeModal);
  const refresh=()=>{const exact=$('#autoHideMode').value==='exact';$('#autoHideDurationFields').style.display=exact?'none':'grid';$('#autoHideExactFields').style.display=exact?'block':'none';};$('#autoHideMode').addEventListener('change',refresh);refresh();
  if($('#cancelAutoHideBtn'))$('#cancelAutoHideBtn').onclick=async()=>{const btn=$('#cancelAutoHideBtn');btn.disabled=true;try{delete target._cochiAutoHideAt;await quickPublishContent(key,d,{syncOriginal:true,successText:`PROGRAMACIÓN CANCELADA · ${name}`});setContentPlain(d);closeModal();}catch(err){msg($('#autoHideMsg'),err.message);btn.disabled=false;}};
  $('#autoHideForm').onsubmit=async e=>{e.preventDefault();try{let end;if($('#autoHideMode').value==='duration'){const hours=Math.max(0,Math.min(168,Number($('#autoHideHours').value)||0)),minutes=Math.max(0,Math.min(59,Number($('#autoHideMinutes').value)||0)),totalMinutes=Math.round(hours*60+minutes);if(totalMinutes<1)throw new Error('Indicá una duración mínima de 1 minuto.');end=new Date(Date.now()+totalMinutes*60*1000);}else{end=new Date($('#autoHideExact').value);if(!Number.isFinite(end.getTime()))throw new Error('Elegí una fecha y hora válidas.');if(end.getTime()<=Date.now()+15000)throw new Error('La finalización debe estar en el futuro.');}target._cochiAutoHideAt=end.toISOString();delete target._cochiHidden;const submit=e.submitter;if(submit)submit.disabled=true;await quickPublishContent(key,d,{syncOriginal:true,successText:`${name} PROGRAMADO`});state.contentOpen.add(groupIndex);setContentPlain(d);closeModal();}catch(err){msg($('#autoHideMsg'),err.message);const submit=$('#autoHideForm button[type="submit"]');if(submit)submit.disabled=false;}};
}

function editCategory(index=null){
  let d;try{d=contentPlain();}catch(e){return alert(e.message);}
  const cur=index===null?{name:'',samples:[]}:d[index];
  const currentPos=index===null?d.length+1:index+1;
  openModal(`<h3>${index===null?'Agregar':'Editar'} categoría</h3><form id="contentCategoryForm">
    <label>Nombre<input id="contentCategoryName" value="${esc(cur.name||'')}" required></label>
    <label>Posición<input id="contentCategoryPosition" type="number" min="1" max="${Math.max(1,d.length+(index===null?1:0))}" value="${currentPos}"></label>
    ${index!==null?`<div class="reorder-actions"><button type="button" class="ghost" data-cat-move="first">Primera</button><button type="button" class="ghost" data-cat-move="up">↑ Subir</button><button type="button" class="ghost" data-cat-move="down">↓ Bajar</button><button type="button" class="ghost" data-cat-move="last">Última</button></div>`:''}
    <div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">GUARDAR</button></div>
  </form>`);
  $$('[data-close]').forEach(x=>x.onclick=closeModal);
  $$('[data-cat-move]').forEach(b=>b.onclick=()=>{
    let to=index;
    if(b.dataset.catMove==='first')to=0;
    if(b.dataset.catMove==='up')to=Math.max(0,index-1);
    if(b.dataset.catMove==='down')to=Math.min(d.length-1,index+1);
    if(b.dataset.catMove==='last')to=d.length-1;
    moveArrayItem(d,index,to);state.contentOpen=new Set([to]);setContentPlain(d);closeModal();
  });
  $('#contentCategoryForm').onsubmit=e=>{
    e.preventDefault();const name=$('#contentCategoryName').value.trim();if(!name)return;
    let pos=Math.max(1,Number($('#contentCategoryPosition').value)||1)-1;
    if(index===null){const obj={name,samples:[]};d.splice(Math.min(pos,d.length),0,obj);state.contentOpen=new Set([Math.min(pos,d.length-1)]);}
    else{d[index].name=name;pos=Math.min(pos,d.length-1);moveArrayItem(d,index,pos);state.contentOpen=new Set([pos]);}
    setContentPlain(d);closeModal();
  };
}
function inferSeasonEpisodeFromTemplate(value){
  let text='';
  try{text=JSON.stringify(value);}catch{text=String(value||'');}
  const patterns=[
    /Temporada\s*0?(\d+)\s*[-–—:]?\s*(?:Cap(?:í|i)?tulo|Episodio)\s*0?(\d+)/i,
    /S0?(\d+)E0?(\d+)/i,
    /(?:^|[^0-9])0?(\d+)[xX]0?(\d+)(?=[^0-9]|$)/,
    /(?:^|[^A-Za-z0-9])T0?(\d+)[^0-9]+(?:Cap(?:í|i)?tulo|Episodio)?\s*0?(\d+)/i
  ];
  for(const re of patterns){const m=text.match(re);if(m)return {season:Number(m[1])||1,episode:Number(m[2])||1};}
  const ep=text.match(/(?:Cap(?:í|i)?tulo|Episodio)\s*0?(\d+)/i);
  return {season:1,episode:ep?(Number(ep[1])||1):1};
}
function replaceEpisodeSequenceDeep(value,targetSeason,targetEpisode,sourceSeason=1,sourceEpisode=1){
  if(Array.isArray(value))return value.map(v=>replaceEpisodeSequenceDeep(v,targetSeason,targetEpisode,sourceSeason,sourceEpisode));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,replaceEpisodeSequenceDeep(v,targetSeason,targetEpisode,sourceSeason,sourceEpisode)]));
  if(typeof value!=='string')return value;
  const ts=String(targetSeason),te=String(targetEpisode),ss=String(sourceSeason),se=String(sourceEpisode);
  const ts2=ts.padStart(2,'0'),te2=te.padStart(2,'0');
  let out=value;
  // Temporada X - Capítulo Y / Episodio Y.
  out=out.replace(new RegExp(`(temporada\\s*)0?${ss}(\\s*[-–—:]?\\s*(?:cap(?:í|i)?tulo|episodio)\\s*)0?${se}(?=\\D|$)`,'gi'),(_,a,b)=>`${a}${targetSeason}${b}${targetEpisode}`);
  // Patrones de archivos/URLs: 01x13, 1x13, S01E13 / s01e13.
  out=out.replace(new RegExp(`(^|[^0-9])0?${ss}[xX]0?${se}(?=[^0-9]|$)`,'g'),(_,pre)=>`${pre}${ts2}x${te2}`);
  out=out.replace(new RegExp(`S0?${ss}E0?${se}`,'gi'),m=>`${m[0]==='s'?'s':'S'}${ts2}${m.includes('e')?'e':'E'}${te2}`);
  // Si el texto solo trae capítulo/episodio, actualizamos el episodio.
  out=out.replace(new RegExp(`(cap(?:í|i)?tulo\\s*)0?${se}(?=\\D|$)`,'gi'),(_,pre)=>`${pre}${targetEpisode}`);
  out=out.replace(new RegExp(`(episodio\\s*)0?${se}(?=\\D|$)`,'gi'),(_,pre)=>`${pre}${targetEpisode}`);
  return out;
}
function buildSeasonFromTemplate(template,season,count,firstEpisode=1){
  const source=inferSeasonEpisodeFromTemplate(template);
  const out=[];
  for(let i=0;i<count;i++){
    const ep=firstEpisode+i;
    const item=replaceEpisodeSequenceDeep(structuredClone(template),season,ep,source.season,source.episode);
    // Estructura compatible con las series que CO-CHI ya separa correctamente (ej. SILO):
    // T1 usa nombres 1,2,3...; T2+ usa 2-1,2-2 / 3-1,3-2...
    item.name=season===1?String(ep):`${season}-${ep}`;
    if(item.number!==undefined)item.number=ep;
    if(typeof item.id==='string'&&item.id.trim()){
      item.id=item.id.replace(/-s\d+e\d+$/i,`-s${season}e${ep}`);
    }
    out.push(item);
  }
  return out;
}
function inferSeasonFromEpisodeEntry(ep){
  if(!ep||typeof ep!=='object')return null;
  const name=String(ep.name||'').trim();
  let m=name.match(/^(\d+)\s*[-x]\s*(\d+)$/i);if(m)return Number(m[1])||1;
  m=name.match(/^Temporada\s*(\d+)\s*[-–—:]?\s*(?:Cap(?:í|i)?tulo|Episodio)\s*\d+/i);if(m)return Number(m[1])||1;
  const text=(()=>{try{return JSON.stringify(ep)}catch{return ''}})();
  m=text.match(/S0?(\d+)E0?\d+/i);if(m)return Number(m[1])||1;
  m=text.match(/(?:^|[^0-9])0?(\d+)[xX]0?\d+(?=[^0-9]|$)/);if(m)return Number(m[1])||1;
  // En el formato histórico, capítulos con nombre simple pertenecen a Temporada 1.
  if(/^\d+$/.test(name))return 1;
  return null;
}

function markerTimeToSeconds(value){
  const raw=String(value??'').trim();
  if(!raw)return null;
  if(/^\d+(?:\.\d+)?$/.test(raw))return Math.max(0,Math.round(Number(raw)));
  const parts=raw.split(':').map(x=>x.trim());
  if(parts.some(x=>!/^\d+(?:\.\d+)?$/.test(x))||parts.length<2||parts.length>3)throw new Error(`Tiempo inválido: ${raw}. Usá MM:SS o HH:MM:SS`);
  let sec=0;
  if(parts.length===2)sec=Number(parts[0])*60+Number(parts[1]);
  else sec=Number(parts[0])*3600+Number(parts[1])*60+Number(parts[2]);
  return Math.max(0,Math.round(sec));
}
function markerSecondsToTime(value){
  if(value===null||value===undefined||value==='')return '';
  const total=Math.max(0,Math.round(Number(value)||0));
  const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),sec=total%60;
  return h?`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}
function cleanMarkerRange(start,end,label){
  if(start===null&&end===null)return null;
  if(start===null||end===null)throw new Error(`${label}: completá inicio y fin`);
  if(end<=start)throw new Error(`${label}: el fin debe ser posterior al inicio`);
  return {start,end};
}
function playbackMarkersFromExtra(extra){
  const src=(extra&&typeof extra.playbackMarkers==='object'&&extra.playbackMarkers)||{};
  return {version:1,seasons:{...(src.seasons||{})}};
}

async function quickPublishContent(key,json,{syncOriginal=true,successText='ACTUALIZADO'}={}){
  const r=await api(`/api/admin/content/${key}/quick-update`,{method:'POST',body:{json}});
  const stats=r.stats?` · ${r.stats.items} contenidos`:'';
  const text=`${successText} · ${key.toUpperCase()}${stats} · IMPACTO INMEDIATO EN CO-CHI`;
  msg($('#contentMsg'),text,true);toast(text,'ok');
  if(syncOriginal){
    // La app ya quedó actualizada. La fuente original se sincroniza después para no frenar el impacto.
    api(`/api/admin/content/${key}`,{method:'PUT',body:{json}}).then(rr=>{
      const remote=rr.remote||{};
      const where=remote.kind==='private_upload'||rr.originalStorage==='private_panel'?'JSON PRIVADO DEL PANEL':'JSON ORIGINAL';
      const done=`${where} SINCRONIZADO · ${key.toUpperCase()}`;
      msg($('#contentMsg'),`${text} · ${done}`,true);toast(done,'ok');
    }).catch(err=>{
      const warn=`CO-CHI YA FUE ACTUALIZADO, pero no se pudo sincronizar el JSON original: ${err.message}`;
      msg($('#contentMsg'),warn);toast(warn,'bad');
    });
  }
  return r;
}

function editContentItem(groupIndex,itemIndex=null){
  let d;try{d=contentPlain();}catch(e){return alert(e.message);}
  const sourceItems=Array.isArray(d[groupIndex]?.samples)?d[groupIndex].samples:[];
  const cur=itemIndex===null?{name:'',icon:'',uri:''}:structuredClone(sourceItems[itemIndex]);
  const extras={...cur};delete extras.name;delete extras.icon;delete extras.uri;
  const targetOptions=d.map((g,i)=>`<option value="${i}" ${i===groupIndex?'selected':''}>${esc(g.name||`Categoría ${i+1}`)}</option>`).join('');
  const currentPos=itemIndex===null?sourceItems.length+1:itemIndex+1;
  const contentKey=$('#contentKey')?.value||'';
  const isSeries=contentKey==='series';
  const isTv=contentKey==='tv1'||contentKey==='tv2';
  const isQuickEditable=itemIndex!==null&&(isTv||contentKey==='movies');
  const existingFirst=Array.isArray(cur.temp)&&cur.temp.length?cur.temp[0]:{name:'1',icon:cur.icon||'',uri:cur.uri||''};
  const streamType=String(cur.type||cur.tipo||'auto').toLowerCase();
  const drmScheme=String(cur.drm_scheme||'').toLowerCase();
  const existingKeys=Array.isArray(cur.keys)?cur.keys.map(x=>x&&x.kid&&x.key?`${x.kid}:${x.key}`:'').filter(Boolean).join('\n'):(drmScheme==='clearkey'?String(cur.drm_license_url||''):'');
  const existingLicenseUrl=drmScheme==='widevine'?String(cur.drm_license_url||cur.license_url||''):'';
  const existingLicenseHeaders=(cur.drm_license_headers&&typeof cur.drm_license_headers==='object'?cur.drm_license_headers:(cur.license_headers&&typeof cur.license_headers==='object'?cur.license_headers:{}));
  const existingLicenseHeaderText=Object.entries(existingLicenseHeaders).map(([k,v])=>`${k}: ${v}`).join('\n');
  const existingHeaders=cur.headers&&typeof cur.headers==='object'?Object.entries(cur.headers).map(([k,v])=>`${k}: ${v}`).join('\n'):'';
  const cleanPlaybackHeadersObj=(primary={},legacy=null)=>{const out={};const merge=o=>{if(!o||typeof o!=='object'||Array.isArray(o))return;for(const [k,v] of Object.entries(o)){const lk=String(k).toLowerCase();if(['drm_scheme','drm_header','drm_headers','drm_license_url','drm_license_headers','license_url','license_headers','keys','key','kid'].includes(lk))continue;if(v===undefined||v===null||typeof v==='object')continue;const sv=String(v).trim();if(sv)out[k]=sv;}};merge(primary);if(Array.isArray(legacy))legacy.forEach(merge);else merge(legacy);return out;};
  const primaryPlaybackHeaders=cleanPlaybackHeadersObj(cur.headers,cur.drm_header||cur.drm_headers);
  const legacyBackups=Array.isArray(cur.backupUris)?cur.backupUris.map(x=>String(x||'').trim()).filter(Boolean):[];
  const playbackSources=(Array.isArray(cur.playbackSources)&&cur.playbackSources.length?cur.playbackSources.map(x=>({url:String(x?.url||'').trim(),headers:cleanPlaybackHeadersObj(x?.headers,x?.drm_header||x?.drm_headers),type:String(x?.type||x?.tipo||'auto').toLowerCase(),drm_scheme:String(x?.drm_scheme||'').toLowerCase(),keys:Array.isArray(x?.keys)?x.keys:[],drm_license_url:String(x?.drm_license_url||x?.license_url||'').trim(),drm_license_headers:(x?.drm_license_headers&&typeof x.drm_license_headers==='object')?x.drm_license_headers:((x?.license_headers&&typeof x.license_headers==='object')?x.license_headers:{}),enabled:x?.enabled===true})):[{url:String(cur.uri||'').trim(),headers:primaryPlaybackHeaders,type:streamType,drm_scheme:drmScheme,keys:Array.isArray(cur.keys)?cur.keys:[],drm_license_url:existingLicenseUrl,drm_license_headers:existingLicenseHeaders,enabled:true},...legacyBackups.map(url=>({url,headers:primaryPlaybackHeaders,type:'auto',drm_scheme:'',keys:[],drm_license_url:'',drm_license_headers:{},enabled:false}))]).filter((x,i)=>x.url||i===0);
  let activePlaybackSource=Number.isInteger(cur.activePlaybackSource)?cur.activePlaybackSource:playbackSources.findIndex(x=>x&&x.enabled===true);if(activePlaybackSource<0||activePlaybackSource>=playbackSources.length)activePlaybackSource=0;
  openModal(`<div class="content-editor-head"><div><h3>${itemIndex===null?'Agregar':'Editar'} contenido</h3><p class="muted small">Edición ampliada: cada fuente de TV conserva su URL, headers, formato y DRM de forma independiente.</p></div><button type="button" class="ghost compact-close" data-close>✕</button></div><form id="contentItemForm" class="content-editor-form">
    <div class="content-editor-grid">
      <section class="content-editor-column">
        <label>Nombre<input id="ciName" value="${esc(cur.name||'')}" required></label>
        <label>Icono / carátula<input id="ciIcon" value="${esc(cur.icon||'')}" placeholder="https://..."></label>
        ${isSeries?`<label>URL principal de la serie (opcional)<textarea id="ciUri" class="content-main-url" rows="2" spellcheck="false" placeholder="https://...">${esc(cur.uri||'')}</textarea><span class="muted tiny">No es un tráiler. Si cada capítulo tiene su propia URL, podés dejar este campo vacío.</span></label>`:(isTv?`<div class="source-selector-note"><b>Reproducción TV por fuentes</b><span class="muted tiny">Configurá URL 1, URL 2 y sus datos. Tocá ACTIVAR en la fuente que querés usar; solo una puede quedar EN USO.</span></div>`:`<label>URL principal de reproducción<textarea id="ciUri" class="content-main-url" rows="2" spellcheck="false" placeholder="https://...">${esc(cur.uri||'')}</textarea><span class="muted tiny">La URL usa todo el ancho del editor y se muestra en varias líneas para poder revisarla completa.</span></label>`)}
        ${isTv?`<div class="stream-format-box"><div class="playback-source-box"><div class="playback-source-title"><div><h4>URLS DE REPRODUCCIÓN / RESPALDO</h4><span class="muted tiny">Cada URL conserva su formato, headers y DRM. Usá ACTIVAR / DETENER para elegir claramente cuál usa CO-CHI.</span></div><button id="ciAddPlaybackSource" class="ghost" type="button">+ AGREGAR URL</button></div><div id="ciPlaybackSources"></div></div><p class="muted tiny">La configuración es independiente por fuente: una URL puede ser HLS sin DRM y otra DASH con ClearKey o Widevine. Al activar una fuente se publican juntos su URL, headers, formato y DRM.</p></div>`:''}
        <div class="form-row"><label>Mover a categoría<select id="ciCategory">${targetOptions}</select></label><label>Posición<input id="ciPosition" type="number" min="1" value="${currentPos}"></label></div>
        ${itemIndex!==null&&!isQuickEditable?`<div class="reorder-actions"><button type="button" class="ghost" data-item-move="first">Primero</button><button type="button" class="ghost" data-item-move="up">↑ Subir</button><button type="button" class="ghost" data-item-move="down">↓ Bajar</button><button type="button" class="ghost" data-item-move="last">Último</button></div>`:''}
      </section>
      ${isTv?'':`<section class="content-editor-column content-editor-extra">
        <label>Datos adicionales desencriptados<textarea id="ciExtras" class="content-item-json content-item-json-wide" spellcheck="false">${esc(JSON.stringify(extras,null,2))}</textarea></label>
        <p class="muted small">Podés cambiar de categoría y orden. En Series, el PANEL mantiene el formato histórico compatible con CO-CHI y cifra al guardar.</p>
      </section>`}
    </div>
    ${isSeries?`<div class="content-editor-series-grid"><div class="series-bulk-box">
      <h4>CARGA RÁPIDA DE TEMPORADA</h4>
      <p class="muted small">Pegá o revisá el JSON del primer capítulo. El PANEL conserva la estructura que CO-CHI ya interpreta correctamente: <b>T1 = 1, 2, 3...</b>; <b>T2 = 2-1, 2-2...</b>; <b>T3 = 3-1, 3-2...</b>. También avanza patrones de URL como <b>01x01</b> y <b>S01E01</b>, conservando claves, headers e iconos de la plantilla.</p>
      <div class="form-row"><label>Temporada<input id="ciSeasonNumber" type="number" min="1" value="1"></label><label>Cantidad de capítulos<input id="ciSeasonCount" type="number" min="1" value="${Array.isArray(cur.temp)&&cur.temp.length?cur.temp.length:1}"></label><label>Primer capítulo<input id="ciFirstEpisode" type="number" min="1" value="1"></label></div>
      <label>Plantilla del primer capítulo<textarea id="ciSeasonTemplate" class="content-item-json" spellcheck="false">${esc(JSON.stringify(existingFirst,null,2))}</textarea></label>
      <div class="reorder-actions"><button id="ciGenerateSeason" type="button" class="primary">GENERAR TEMPORADA</button></div>
      <div id="ciSeasonMsg" class="msg"></div>
    </div>
    <div class="series-bulk-box">
      <h4>OMITIR INTRO / RESUMEN / SIGUIENTE EPISODIO</h4>
      <p class="muted small">Configurá una vez los tiempos de cada temporada. Se aplican a todos sus capítulos. Si un capítulo es diferente, escribí su número en <b>Excepción de capítulo</b> y guardá tiempos propios. Formato: <b>MM:SS</b> o <b>HH:MM:SS</b>.</p>
      <div class="form-row"><label>Temporada<input id="ciMarkerSeason" type="number" min="1" value="1"></label><label>Excepción de capítulo (opcional)<input id="ciMarkerEpisode" type="number" min="1" placeholder="Ej. 3"></label></div>
      <div class="form-row"><label>Resumen · inicio<input id="ciRecapStart" placeholder="00:00"></label><label>Resumen · fin<input id="ciRecapEnd" placeholder="00:45"></label></div>
      <div class="form-row"><label>Intro · inicio<input id="ciIntroStart" placeholder="00:45"></label><label>Intro · fin<input id="ciIntroEnd" placeholder="01:30"></label></div>
      <label>Siguiente episodio desde<input id="ciNextEpisodeAt" placeholder="42:10"><span class="muted tiny">Cuando la app llegue a este punto podrá ofrecer SIGUIENTE EPISODIO.</span></label>
      <div class="reorder-actions"><button id="ciLoadMarkers" type="button" class="ghost">CARGAR TIEMPOS</button><button id="ciSaveMarkers" type="button" class="primary">GUARDAR TIEMPOS</button><button id="ciClearMarkers" type="button" class="danger">BORRAR TIEMPOS</button></div>
      <div id="ciMarkerMsg" class="msg"></div>
    </div></div>`:''}
    <div class="modal-actions content-editor-actions"><button type="button" class="ghost" data-close>Cancelar</button><button id="ciSubmitBtn" class="primary" type="submit">${isQuickEditable?'ACTUALIZAR':(itemIndex===null?'AGREGAR':'GUARDAR')}</button></div><div id="ciMsg" class="msg"></div>
  </form>`);
  $('#modal').classList.add('content-editor-modal');
  // El cierre del editor se maneja por delegación en #modal; evitamos doble ejecución de closeModal().
  const headerText=o=>Object.entries(o&&typeof o==='object'?o:{}).map(([k,v])=>`${k}: ${v}`).join('\n');
  const sourceKeysText=src=>Array.isArray(src?.keys)?src.keys.map(x=>x&&x.kid&&x.key?`${x.kid}:${x.key}`:'').filter(Boolean).join('\n'):'';
  const looseHeaders=text=>{const raw=String(text||'').trim(),out={};if(!raw)return out;if(raw.startsWith('{')){try{const j=JSON.parse(raw);if(j&&typeof j==='object'&&!Array.isArray(j)){for(const [k,v] of Object.entries(j)){if(v!==undefined&&v!==null&&String(k).trim()&&String(v).trim())out[String(k).trim()]=String(v).trim();}return out;}}catch{}}for(const line0 of raw.split(/\r?\n/)){const line=line0.trim();if(!line||line.startsWith('#'))continue;if(/^https?:\/\//i.test(line)){if(!out.Referer&&!out.referer)out.Referer=line;continue;}let i=line.indexOf(':');if(i<=0){i=line.indexOf('=');if(i<=0)continue;}const k=line.slice(0,i).trim(),v=line.slice(i+1).trim();if(k&&v)out[k]=v;}return out;};
  const looseKeys=text=>String(text||'').split(/[\r\n,;]+/).map(x=>x.trim()).filter(Boolean).map(p=>{const i=p.indexOf(':');return i>0?{kid:p.slice(0,i).trim(),key:p.slice(i+1).trim()}:null;}).filter(x=>x&&x.kid&&x.key);
  const syncPlaybackSourcesFromDom=()=>{
    if(!isTv)return;
    $$('[data-playback-source]').forEach(row=>{const i=Number(row.dataset.playbackSource);if(!Number.isInteger(i)||!playbackSources[i])return;const src=playbackSources[i];src.url=String(row.querySelector('.ci-playback-url')?.value||'').trim();src.headers=looseHeaders(row.querySelector('.ci-playback-headers')?.value||'');src.type=String(row.querySelector('.ci-playback-type')?.value||'auto').toLowerCase();src.drm_scheme=String(row.querySelector('.ci-playback-drm')?.value||'').toLowerCase();src.keys=looseKeys(row.querySelector('.ci-playback-keys')?.value||'');src.drm_license_url=String(row.querySelector('.ci-playback-license-url')?.value||'').trim();src.drm_license_headers=looseHeaders(row.querySelector('.ci-playback-license-headers')?.value||'');});
  };
  const updatePlaybackActiveUi=()=>{
    $$('[data-playback-source]').forEach(row=>{const i=Number(row.dataset.playbackSource),active=i===activePlaybackSource;row.classList.toggle('playback-source-active',active);const status=row.querySelector('[data-source-status]');if(status){status.textContent=active?'EN USO':'DETENIDA';status.className=`badge ${active?'active':'off'}`;}const btn=row.querySelector('[data-toggle-playback-source]');if(btn){btn.textContent=active?'DETENER':'ACTIVAR';btn.className=active?'danger small-btn':'primary small-btn';}});
  };
  const renderPlaybackSources=()=>{
    if(!isTv||!$('#ciPlaybackSources'))return;
    $('#ciPlaybackSources').innerHTML=playbackSources.map((src,i)=>{const drm=String(src.drm_scheme||'').toLowerCase(),active=i===activePlaybackSource;return `<div class="playback-source-row ${active?'playback-source-active':''}" data-playback-source="${i}"><div class="playback-source-row-head"><strong>URL ${i+1}${i===0?' · PRINCIPAL':' · SOPORTE'}</strong><span data-source-status class="badge ${active?'active':'off'}">${active?'EN USO':'DETENIDA'}</span><button type="button" class="${active?'danger':'primary'} small-btn" data-toggle-playback-source="${i}">${active?'DETENER':'ACTIVAR'}</button>${i>0?`<button type="button" class="danger small-btn" data-remove-playback-source="${i}">ELIMINAR</button>`:''}</div><label>URL ${i+1}<textarea class="ci-playback-url" rows="2" spellcheck="false" placeholder="https://...">${esc(src.url||'')}</textarea></label><label>Headers de URL ${i+1}<textarea class="ci-playback-headers" rows="4" spellcheck="false" placeholder="Referer: https://...&#10;Origin: https://...&#10;User-Agent: ...">${esc(headerText(src.headers))}</textarea></label><div class="form-row"><label>Formato de URL ${i+1}<select class="ci-playback-type"><option value="auto" ${String(src.type||'auto').toLowerCase()==='auto'?'selected':''}>Automático (recomendado)</option><option value="hls" ${String(src.type||'').toLowerCase()==='hls'?'selected':''}>HLS / M3U8</option><option value="dash" ${String(src.type||'').toLowerCase()==='dash'?'selected':''}>DASH / MPD</option><option value="youtube" ${String(src.type||'').toLowerCase()==='youtube'?'selected':''}>YouTube</option><option value="remote_playlist" ${String(src.type||'').toLowerCase()==='remote_playlist'?'selected':''}>Lista remota M3U/M3U8</option></select></label><label>DRM de URL ${i+1}<select class="ci-playback-drm"><option value="" ${!drm?'selected':''}>Sin DRM</option><option value="clearkey" ${drm==='clearkey'?'selected':''}>ClearKey / MultiKey</option><option value="widevine" ${drm==='widevine'?'selected':''}>Widevine</option></select></label></div><div class="ci-source-clearkey" style="display:${drm==='clearkey'?'grid':'none'}"><label>Claves ClearKey / MultiKey de URL ${i+1}<textarea class="ci-playback-keys" rows="4" spellcheck="false" placeholder="KID:KEY&#10;KID2:KEY2">${esc(sourceKeysText(src))}</textarea></label></div><div class="ci-source-widevine" style="display:${drm==='widevine'?'grid':'none'}"><label>Licencia Widevine de URL ${i+1}<textarea class="ci-playback-license-url" rows="2" spellcheck="false" placeholder="https://licencias.ejemplo.com/widevine">${esc(src.drm_license_url||'')}</textarea></label><label>Headers de licencia Widevine de URL ${i+1}<textarea class="ci-playback-license-headers" rows="4" spellcheck="false" placeholder="Authorization: Bearer ...&#10;Origin: https://...">${esc(headerText(src.drm_license_headers))}</textarea></label></div></div>`}).join('');
    $$('[data-toggle-playback-source]').forEach(b=>b.onclick=()=>{syncPlaybackSourcesFromDom();const i=Number(b.dataset.togglePlaybackSource);activePlaybackSource=activePlaybackSource===i?-1:i;updatePlaybackActiveUi();});
    $$('.ci-playback-drm').forEach(sel=>sel.onchange=()=>{const row=sel.closest('[data-playback-source]'),drm=sel.value||'';row.querySelector('.ci-source-clearkey').style.display=drm==='clearkey'?'grid':'none';row.querySelector('.ci-source-widevine').style.display=drm==='widevine'?'grid':'none';});
    $$('.ci-playback-type').forEach(sel=>sel.onchange=()=>{if(sel.value!=='remote_playlist')return;const row=sel.closest('[data-playback-source]'),drmSel=row.querySelector('.ci-playback-drm');if(drmSel){drmSel.value='';drmSel.dispatchEvent(new Event('change'));}});
    $$('[data-remove-playback-source]').forEach(b=>b.onclick=()=>{syncPlaybackSourcesFromDom();const i=Number(b.dataset.removePlaybackSource);playbackSources.splice(i,1);if(activePlaybackSource===i)activePlaybackSource=playbackSources.length?0:-1;else if(activePlaybackSource>i)activePlaybackSource--;renderPlaybackSources();});
  };
  if(isTv){renderPlaybackSources();if($('#ciAddPlaybackSource'))$('#ciAddPlaybackSource').onclick=()=>{syncPlaybackSourcesFromDom();playbackSources.push({url:'',headers:{},type:'auto',drm_scheme:'',keys:[],drm_license_url:'',drm_license_headers:{}});renderPlaybackSources();};}
  $$('[data-item-move]').forEach(b=>b.onclick=()=>{
    if(itemIndex===null)return;
    let to=itemIndex;
    if(b.dataset.itemMove==='first')to=0;
    if(b.dataset.itemMove==='up')to=Math.max(0,itemIndex-1);
    if(b.dataset.itemMove==='down')to=Math.min(sourceItems.length-1,itemIndex+1);
    if(b.dataset.itemMove==='last')to=sourceItems.length-1;
    moveArrayItem(sourceItems,itemIndex,to);d[groupIndex].samples=sourceItems;state.contentOpen.add(groupIndex);setContentPlain(d);closeModal();
  });
  if(isSeries&&$('#ciGenerateSeason'))$('#ciGenerateSeason').onclick=()=>{
    try{
      const season=Math.max(1,Number($('#ciSeasonNumber').value)||1);
      const count=Math.max(1,Number($('#ciSeasonCount').value)||1);
      const firstEpisode=Math.max(1,Number($('#ciFirstEpisode').value)||1);
      const template=JSON.parse($('#ciSeasonTemplate').value.trim()||'{}');
      const generated=buildSeasonFromTemplate(template,season,count,firstEpisode);
      const extraText=$('#ciExtras').value.trim(),extra=extraText?JSON.parse(extraText):{};
      const existing=Array.isArray(extra.temp)?extra.temp:[];
      // Las temporadas se acumulan. Detectamos el número con la misma convención histórica de SILO.
      const seasonExists=existing.some(ep=>inferSeasonFromEpisodeEntry(ep)===season);
      if(seasonExists){
        const text=`LA TEMPORADA ${season} YA EXISTE. No se modificó ni reemplazó ningún capítulo.`;
        msg($('#ciSeasonMsg'),text);toast(text,'error');return;
      }
      extra.temp=[...existing,...generated];$('#ciExtras').value=JSON.stringify(extra,null,2);
      const totalSeasons=new Set(extra.temp.map(inferSeasonFromEpisodeEntry).filter(Boolean)).size;
      const text=`TEMPORADA ${season} AGREGADA · ${count} capítulos · ${totalSeasons} temporada${totalSeasons===1?'':'s'} en la serie`;

      msg($('#ciSeasonMsg'),text,true);toast(text,'ok');
    }catch(err){msg($('#ciSeasonMsg'),'No se pudo generar la temporada: '+err.message);}
  };
  if(isSeries&&$('#ciLoadMarkers')){
    const markerFields=()=>({season:Math.max(1,Number($('#ciMarkerSeason').value)||1),episode:Math.max(0,Number($('#ciMarkerEpisode').value)||0)});
    const readExtra=()=>{const t=$('#ciExtras').value.trim();return t?JSON.parse(t):{};};
    const writeExtra=x=>{$('#ciExtras').value=JSON.stringify(x,null,2);};
    const loadMarkerFields=()=>{
      try{
        const {season,episode}=markerFields(),extra=readExtra(),pm=playbackMarkersFromExtra(extra);
        const seasonData=pm.seasons[String(season)]||{};
        const data=episode?((seasonData.episodes||{})[String(episode)]||{}):seasonData;
        $('#ciRecapStart').value=markerSecondsToTime(data.recap?.start);$('#ciRecapEnd').value=markerSecondsToTime(data.recap?.end);
        $('#ciIntroStart').value=markerSecondsToTime(data.intro?.start);$('#ciIntroEnd').value=markerSecondsToTime(data.intro?.end);
        $('#ciNextEpisodeAt').value=markerSecondsToTime(data.nextEpisodeAt);
        msg($('#ciMarkerMsg'),`Tiempos cargados: ${episode?`T${season} · capítulo ${episode}`:`Temporada ${season}`}`,true);
      }catch(err){msg($('#ciMarkerMsg'),'No se pudieron cargar los tiempos: '+err.message);}
    };
    $('#ciLoadMarkers').onclick=loadMarkerFields;
    $('#ciSaveMarkers').onclick=()=>{
      try{
        const {season,episode}=markerFields(),extra=readExtra(),pm=playbackMarkersFromExtra(extra),sk=String(season);
        const recap=cleanMarkerRange(markerTimeToSeconds($('#ciRecapStart').value),markerTimeToSeconds($('#ciRecapEnd').value),'Resumen');
        const intro=cleanMarkerRange(markerTimeToSeconds($('#ciIntroStart').value),markerTimeToSeconds($('#ciIntroEnd').value),'Intro');
        const nextEpisodeAt=markerTimeToSeconds($('#ciNextEpisodeAt').value);
        if(!recap&&!intro&&nextEpisodeAt===null)throw new Error('Ingresá al menos un marcador');
        const data={};if(recap)data.recap=recap;if(intro)data.intro=intro;if(nextEpisodeAt!==null)data.nextEpisodeAt=nextEpisodeAt;
        const seasonData={...(pm.seasons[sk]||{})};
        if(episode){seasonData.episodes={...(seasonData.episodes||{}),[String(episode)]:data};}
        else{const episodes=seasonData.episodes;if(recap)seasonData.recap=recap;else delete seasonData.recap;if(intro)seasonData.intro=intro;else delete seasonData.intro;if(nextEpisodeAt!==null)seasonData.nextEpisodeAt=nextEpisodeAt;else delete seasonData.nextEpisodeAt;if(episodes)seasonData.episodes=episodes;}
        pm.seasons[sk]=seasonData;extra.playbackMarkers=pm;writeExtra(extra);
        const scope=episode?`T${season} · capítulo ${episode}`:`Temporada ${season}`;msg($('#ciMarkerMsg'),`MARCADORES GUARDADOS · ${scope}`,true);toast(`Marcadores guardados · ${scope}`,'ok');
      }catch(err){msg($('#ciMarkerMsg'),'No se pudieron guardar los tiempos: '+err.message);}
    };
    $('#ciClearMarkers').onclick=()=>{
      try{
        const {season,episode}=markerFields(),extra=readExtra(),pm=playbackMarkersFromExtra(extra),sk=String(season),seasonData={...(pm.seasons[sk]||{})};
        if(episode&&seasonData.episodes){delete seasonData.episodes[String(episode)];if(!Object.keys(seasonData.episodes).length)delete seasonData.episodes;}
        else if(!episode){delete seasonData.recap;delete seasonData.intro;delete seasonData.nextEpisodeAt;}
        if(Object.keys(seasonData).length)pm.seasons[sk]=seasonData;else delete pm.seasons[sk];
        if(Object.keys(pm.seasons).length)extra.playbackMarkers=pm;else delete extra.playbackMarkers;writeExtra(extra);loadMarkerFields();toast('Marcadores borrados','ok');
      }catch(err){msg($('#ciMarkerMsg'),'No se pudieron borrar los tiempos: '+err.message);}
    };
    $('#ciMarkerSeason').onchange=loadMarkerFields;$('#ciMarkerEpisode').onchange=loadMarkerFields;loadMarkerFields();
  }
  // v0.9.80: parser tolerante y persistente de headers. Acepta JSON, `Nombre: valor` y `Nombre=valor`.
  // Importante: una URL sola NO se interpreta como nombre de header (antes `https://...` podía quedar como `https: //...`).
  const parseHeaderLines=text=>{
    const raw=String(text||'').trim(),out={};if(!raw)return out;
    if(raw.startsWith('{')){try{const j=JSON.parse(raw);if(j&&typeof j==='object'&&!Array.isArray(j)){for(const [k,v] of Object.entries(j)){if(v!==undefined&&v!==null&&String(k).trim()&&String(v).trim())out[String(k).trim()]=String(v).trim();}return out;}}catch{}
    }
    for(const line0 of raw.split(/\r?\n/)){
      const line=line0.trim();if(!line||line.startsWith('#'))continue;
      let i=line.indexOf(':');
      // Si el usuario pega una URL sola en Headers, se interpreta como Referer y se conserva.
      if(/^https?:\/\//i.test(line)){if(!out.Referer&&!out.referer)out.Referer=line;continue;}
      if(i<=0){i=line.indexOf('=');if(i<=0)continue;}
      const k=line.slice(0,i).trim(),v=line.slice(i+1).trim();if(k&&v)out[k]=v;
    }
    return out;
  };
  const parseKeyLines=text=>{const out=[];for(const line of String(text||'').split(/[\r\n,;]+/)){const p=line.trim();if(!p)continue;const i=p.indexOf(':');if(i<=0||i>=p.length-1)throw new Error('Clave inválida. Usá KID:KEY, una por línea.');const kid=p.slice(0,i).trim(),key=p.slice(i+1).trim();if(!kid||!key)throw new Error('Clave inválida. Usá KID:KEY.');out.push({kid,key});}return out;};
  $('#contentItemForm').onsubmit=async e=>{
    e.preventDefault();
    const submitBtn=$('#ciSubmitBtn');
    try{
      if(submitBtn){submitBtn.disabled=true;if(isQuickEditable)submitBtn.textContent='ACTUALIZANDO...';}
      const managedTvFields=new Set(['name','icon','uri','headers','type','tipo','drm_scheme','keys','drm_license_url','drm_license_headers','license_url','license_headers','backupUris','playbackSources','activePlaybackSource','drm_header','drm_headers','_failover']);
      const tvExtra=isTv?Object.fromEntries(Object.entries(cur||{}).filter(([k])=>!managedTvFields.has(k))):null;
      const extraText=isTv?'':($('#ciExtras')?.value||'').trim(),extra=isTv?tvExtra:(extraText?JSON.parse(extraText):{});
      const obj={...extra,name:$('#ciName').value.trim()};
      const icon=$('#ciIcon').value.trim(),uri=String($('#ciUri')?.value||'').trim();
      if(icon)obj.icon=icon;else delete obj.icon;if(uri)obj.uri=uri;else delete obj.uri;
      if(isTv){
        const sourceRows=$$('[data-playback-source]'),collected=[];
        const selectedOriginalIndex=activePlaybackSource;
        if(!Number.isInteger(selectedOriginalIndex)||selectedOriginalIndex<0)throw new Error('No hay una URL activa. Tocá ACTIVAR en la fuente que querés usar antes de actualizar.');
        let selectedCollectedIndex=0;
        for(const row of sourceRows){
          const originalIndex=Number(row.dataset.playbackSource)||0;
          const u=String(row.querySelector('.ci-playback-url')?.value||'').trim();
          const h=parseHeaderLines(row.querySelector('.ci-playback-headers')?.value||'');
          const sourceType=String(row.querySelector('.ci-playback-type')?.value||'auto').trim().toLowerCase();
          let sourceDrm=String(row.querySelector('.ci-playback-drm')?.value||'').trim().toLowerCase();
          if(!u)continue;
          if(sourceType==='remote_playlist')sourceDrm='';
          const src={url:u,headers:h,type:sourceType||'auto',drm_scheme:sourceDrm};
          if(sourceDrm==='clearkey'){
            const keys=parseKeyLines(row.querySelector('.ci-playback-keys')?.value||'');
            if(!keys.length)throw new Error(`ClearKey en URL ${originalIndex+1}: cargá al menos un par KID:KEY.`);
            src.keys=keys;
          }else if(sourceDrm==='widevine'){
            const licenseUrl=String(row.querySelector('.ci-playback-license-url')?.value||'').trim(),licenseHeaders=parseHeaderLines(row.querySelector('.ci-playback-license-headers')?.value||'');
            if(!/^https?:\/\//i.test(licenseUrl))throw new Error(`Widevine en URL ${originalIndex+1}: cargá una URL de licencia HTTP/HTTPS válida.`);
            src.drm_license_url=licenseUrl;if(Object.keys(licenseHeaders).length)src.drm_license_headers=licenseHeaders;
          }
          if(originalIndex===selectedOriginalIndex)selectedCollectedIndex=collected.length;
          collected.push(src);
        }
        if(!collected.length)throw new Error('Cargá al menos una URL de reproducción.');
        activePlaybackSource=Math.max(0,Math.min(selectedCollectedIndex,collected.length-1));
        obj.playbackSources=collected.map((x,i)=>({...x,enabled:i===activePlaybackSource}));
        obj.activePlaybackSource=activePlaybackSource;
        const active=collected[activePlaybackSource];
        obj.uri=active.url;
        if(Object.keys(active.headers).length)obj.headers=active.headers;else delete obj.headers;
        if(active.type&&active.type!=='auto')obj.type=active.type;else delete obj.type;delete obj.tipo;
        delete obj.drm_scheme;delete obj.keys;delete obj.drm_license_url;delete obj.drm_license_headers;delete obj.license_url;delete obj.license_headers;
        if(active.drm_scheme==='clearkey'){obj.drm_scheme='clearkey';obj.keys=active.keys;}
        else if(active.drm_scheme==='widevine'){obj.drm_scheme='widevine';obj.drm_license_url=active.drm_license_url;if(active.drm_license_headers&&Object.keys(active.drm_license_headers).length)obj.drm_license_headers=active.drm_license_headers;}
        delete obj.backupUris;
      }
      const targetGroup=Number($('#ciCategory').value);
      let pos=Math.max(1,Number($('#ciPosition').value)||1)-1;
      if(itemIndex===null){
        const target=d[targetGroup].samples||(d[targetGroup].samples=[]);pos=Math.min(pos,target.length);target.splice(pos,0,obj);
      }else{
        d[groupIndex].samples.splice(itemIndex,1);
        const target=d[targetGroup].samples||(d[targetGroup].samples=[]);pos=Math.min(pos,target.length);target.splice(pos,0,obj);
      }
      state.contentOpen.add(targetGroup);
      if(isQuickEditable){
        await quickPublishContent(contentKey,d,{syncOriginal:true,successText:`${obj.name||'CONTENIDO'} ACTUALIZADO`});
        setContentPlain(d);closeModal();
      }else{
        setContentPlain(d);closeModal();
      }
    }catch(err){msg($('#ciMsg'),'No se pudo actualizar: '+err.message);if(submitBtn){submitBtn.disabled=false;submitBtn.textContent=isQuickEditable?'ACTUALIZAR':(itemIndex===null?'AGREGAR':'GUARDAR');}}
  };
}
async function loadContentSource(){
  try{
    const key=$('#contentKey').value;
    const d=await api('/api/admin/sources');
    state.sources=d.sources||[];
    const src=state.sources.find(x=>x.source_key===key);
    $('#contentSourceLabel').textContent=(src?.label||key).toUpperCase();
    $('#contentSourceUrl').value=src?.url||'';
    $('#contentSourceEnabled').checked=src?.enabled!==false;
  }catch(e){
    msg($('#contentMsg'),'No se pudo cargar la URL de origen: '+e.message);
  }
}
async function saveContentSource(){
  try{
    const key=$('#contentKey').value,url=$('#contentSourceUrl').value.trim(),enabled=$('#contentSourceEnabled').checked;
    if(url&&!/^https?:\/\//i.test(url))throw new Error('La URL debe comenzar con http:// o https://');
    const d=await api('/api/admin/sources');
    const sources=d.sources.map(x=>({key:x.source_key,url:x.source_key===key?url:x.url,enabled:x.source_key===key?enabled:x.enabled}));
    await api('/api/admin/sources',{method:'PUT',body:{sources}});
    await loadContentSource();
    const text=`URL GUARDADA · ${($('#contentSourceLabel').textContent||key).toUpperCase()}`;
    msg($('#contentMsg'),text,true);toast(text,'ok');
  }catch(e){
    msg($('#contentMsg'),e.message);toast(e.message,'bad');
  }
}
async function loadContent(preserveMessage=false){
  const key=$('#contentKey').value;
  await loadContentSource();
  try{
    const d=await api(`/api/admin/content/${key}`);state.content[key]=d;state.contentOpen=new Set();state.contentQuery='';if($('#contentSearch'))$('#contentSearch').value='';
    setContentPlain(d.json||[]);
    const st=d.stats?` · ${d.stats.categories} categorías · ${d.stats.items} contenidos${d.stats.nested?` · ${d.stats.nested} capítulos/entradas`:''}`:'';
    $('#contentState').textContent=d.updatedAt?`Guardado: ${fmt(d.updatedAt)}${st}`:'Todavía no hay contenido guardado en el PANEL.';
    $('#contentPublicUrl').textContent=`URL cifrada PANEL: ${location.origin}/api/content/${key}`;if(!preserveMessage)msg($('#contentMsg'),'');
  }catch(e){msg($('#contentMsg'),e.message);}
}
async function reloadContentSource(){
  const btn=$('#contentSourceReloadBtn');
  try{
    const key=$('#contentKey').value;
    const label=key.toUpperCase();
    const srcNow=$('#contentSourceUrl').value.trim();
    const enabled=$('#contentSourceEnabled').checked;
    if(!srcNow)throw new Error('Primero cargá la URL de origen.');
    if(!/^https?:\/\//i.test(srcNow))throw new Error('La URL debe comenzar con http:// o https://');
    const saved=(state.sources||[]).find(x=>x.source_key===key);
    if(srcNow!==String(saved?.url||'').trim()||enabled!==(saved?.enabled!==false))await saveContentSource();
    if(btn){btn.disabled=true;btn.textContent='RECARGANDO...';}
    msg($('#contentMsg'),`Recargando ${label} desde la URL de origen...`);
    // v0.9.72: enviamos al backend EXACTAMENTE la URL que está escrita en pantalla.
    // Así RECARGAR URL no puede usar por error una URL anterior que hubiera quedado en memoria/DB.
    const r=await api(`/api/admin/content/${key}/import`,{method:'POST',body:{persist:true,preserveManaged:false,sourceUrl:srcNow,enabled}});
    // Pintamos directamente lo que el backend acaba de descargar, sin una segunda lectura intermedia.
    state.content[key]={json:r.json||[],stats:r.stats||null,updatedAt:r.updatedAt||new Date().toISOString()};
    state.contentOpen=new Set();state.contentQuery='';if($('#contentSearch'))$('#contentSearch').value='';
    setContentPlain(r.json||[]);
    const st=r.stats?`${r.stats.categories} categorías · ${r.stats.items} contenidos${r.stats.nested?` · ${r.stats.nested} capítulos/entradas`:''}`:'contenido actualizado';
    $('#contentState').textContent=`Guardado: ${fmt(r.updatedAt||new Date().toISOString())}${r.stats?` · ${r.stats.categories} categorías · ${r.stats.items} contenidos${r.stats.nested?` · ${r.stats.nested} capítulos/entradas`:''}`:''}`;
    $('#contentPublicUrl').textContent=`URL cifrada PANEL: ${location.origin}/api/content/${key}`;
    const diag=r.sourceSha256?` · SHA256 ${r.sourceSha256.slice(0,12)}`:'';
    const effective=r.effectiveSourceUrl||r.sourceUrl||srcNow;
    const sourceDiag=` · FUENTE ${effective}`;
    const text=`URL RECARGADA Y REEMPLAZADA · ${label} · ${st}${diag}${sourceDiag} · Revisá y tocá GUARDAR Y PUBLICAR para enviarlo a CO-CHI.`;
    msg($('#contentMsg'),text,true);toast(text,'ok');
  }catch(e){
    const text='NO SE PUDO RECARGAR LA URL · '+e.message;
    msg($('#contentMsg'),text);toast(text,'bad');
  }finally{
    if(btn){btn.disabled=false;btn.textContent='RECARGAR URL';}
  }
}
$('#contentSourceSaveBtn')?.addEventListener('click',saveContentSource);
$('#contentSourceReloadBtn')?.addEventListener('click',reloadContentSource);
$('#contentKey')?.addEventListener('change',loadContent);
$('#contentLoadBtn')?.addEventListener('click',loadContent);
$('#contentSearch')?.addEventListener('input',renderContentVisual);
$('#contentAddCategoryBtn')?.addEventListener('click',()=>editCategory(null));
$('#contentFormatBtn')?.addEventListener('click',()=>{
  const key=$('#contentKey').value.toUpperCase();
  if(!confirm(`¿Formatear el JSON desencriptado de ${key}?\n\nSe reorganizará visualmente el texto actual. Revisá que hayas seleccionado la lista correcta.`))return;
  if(!confirm(`Confirmación final: ¿querés formatear ${key} ahora?`))return;
  try{const x=contentPlain();setContentPlain(x);msg($('#contentMsg'),`JSON ${key} válido y formateado.`,true);}catch(e){msg($('#contentMsg'),'JSON inválido: '+e.message);}
});
$('#contentImportBtn')?.addEventListener('click',async()=>{
  try{
    const key=$('#contentKey').value;
    if(!confirm(`ACTUALIZAR DESDE FUENTE traerá los cambios del JSON privado de ${key.toUpperCase()} y conservará el contenido que ya guardaste en el PANEL.\n\n¿Querés continuar?`))return;
    const srcNow=$('#contentSourceUrl').value.trim();
    const saved=(state.sources||[]).find(x=>x.source_key===key);
    if(srcNow!==String(saved?.url||'').trim()||$('#contentSourceEnabled').checked!==(saved?.enabled!==false))await saveContentSource();
    msg($('#contentMsg'),'Actualizando desde la fuente privada sin perder el contenido guardado en el PANEL...');
    const r=await api(`/api/admin/content/${key}/import`,{method:'POST',body:{persist:true,preserveManaged:true}});
    await loadContent(true);
    const st=r.stats?`${r.stats.categories} categorías, ${r.stats.items} contenidos${r.stats.nested?`, ${r.stats.nested} capítulos/entradas`:''}`:'';
    const diag=r.sourceSha256?` · ${r.sourceBytes} bytes · SHA256 ${r.sourceSha256.slice(0,16)}`:'';
    const text=`ACTUALIZADO Y CONSERVADO · ${key.toUpperCase()} · ${st}${diag}`;msg($('#contentMsg'),text,true);toast(text,'ok');
  }catch(e){msg($('#contentMsg'),e.message);toast(e.message,'bad');}
});
$('#contentApplyBtn')?.addEventListener('click',async()=>{
  const btn=$('#contentApplyBtn');
  try{
    const key=$('#contentKey').value,json=contentPlain();
    if(btn){btn.disabled=true;btn.textContent='PUBLICANDO...';}
    await quickPublishContent(key,json,{syncOriginal:true,successText:'GUARDADO Y PUBLICADO'});
  }catch(e){
    const text=e instanceof SyntaxError?'JSON inválido: '+e.message:e.message;
    msg($('#contentMsg'),text);toast(text,'bad');
  }finally{if(btn){btn.disabled=false;btn.textContent='GUARDAR Y PUBLICAR';}}
});


$('#modal').addEventListener('click',async e=>{
  if(e.target.closest('[data-close]')){closeModal();return;}
  const rel=e.target.closest('[data-action="release-panel"]');if(rel){const card=rel.closest('[data-pdev]');const current=card?.dataset.current==='1';const warning=current?'\n\nEste es el dispositivo que estás usando: al liberarlo se cerrará esta sesión.':'';if(!confirm(`¿Liberar este dispositivo del PANEL?${warning}`))return;try{await api(`/api/admin/panel-devices/${Number(card.dataset.pdev)}/release`,{method:'POST'});closeModal();if(current){setSecret('');location.reload();return;}await loadAccounts();}catch(err){alert(err.message);}}
});

if('serviceWorker' in navigator && location.protocol==='https:'){
  window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}
bootstrap();


async function loadResolverPublished(){const box=$('#resolverPublished');if(!box)return;try{const r=await api('/api/admin/stream-resolver/published'),items=r.items||[];box.innerHTML=items.length?items.map(x=>`<div class="resolver-item resolver-published-item"><div><span class="resolver-type">${esc(x.destination.toUpperCase())}</span> <strong>${esc(x.name)}</strong><div class="muted tiny">${esc(x.category)} · ${esc(x.type||'STREAM')}</div><div class="resolver-code">${esc(x.uri)}</div></div><div class="resolver-actions"><button class="ghost mini" data-resolver-move="${esc(x.id)}" data-from="${esc(x.destination)}">MOVER A ${x.destination==='tv1'?'TV2':'TV1'}</button><button class="danger mini" data-resolver-remove="${esc(x.id)}">QUITAR</button></div></div>`).join(''):'<div class="muted">Todavía no agregaste canales desde el Resolver.</div>';$$('[data-resolver-remove]').forEach(b=>b.onclick=async()=>{if(!confirm('¿Quitar este canal de TV1/TV2? El resto de la lista no se modifica.'))return;try{await api(`/api/admin/stream-resolver/published/${encodeURIComponent(b.dataset.resolverRemove)}`,{method:'DELETE'});toast('Canal quitado del destino','ok');await loadResolverPublished()}catch(e){alert(e.message)}});$$('[data-resolver-move]').forEach(b=>b.onclick=async()=>{const destination=b.dataset.from==='tv1'?'tv2':'tv1';if(!confirm(`¿Mover este canal a ${destination.toUpperCase()}?`))return;try{const rr=await api(`/api/admin/stream-resolver/published/${encodeURIComponent(b.dataset.resolverMove)}/move`,{method:'POST',body:{destination}});toast(`${rr.name} movido a ${destination.toUpperCase()}`,'ok');await loadResolverPublished()}catch(e){alert(e.message)}})}catch(e){box.innerHTML=`<div class="msg bad">${esc(e.message)}</div>`}}
function resolverLooksTemporary(raw){try{const u=new URL(String(raw||''));const keys=[...u.searchParams.keys()].map(x=>x.toLowerCase());return keys.some(k=>['exp','expires','expiry','token','sig','signature','auth','hdnts','hdnea','policy','key-pair-id','x-amz-expires','x-amz-signature'].includes(k)||/(?:^|_)(?:exp|token|sig|auth)(?:$|_)/.test(k))}catch{return false}}
function resolverHeadersText(headers){return Object.entries(headers||{}).filter(([,v])=>String(v||'').trim()).map(([k,v])=>`${k}: ${v}`).join('\n')}
function resolverParseHeaders(text){const out={};for(const line of String(text||'').split(/\r?\n/)){const i=line.indexOf(':');if(i<=0)continue;const k=line.slice(0,i).trim(),v=line.slice(i+1).trim();if(k&&v)out[k]=v}return out}
async function publishResolvedStream(x,r,destination){const defaultName=(()=>{try{return new URL(r.pageUrl).hostname.replace(/^www\./,'').split('.')[0].toUpperCase()}catch{return 'CANAL WEB'}})();const detected=x.headers||r.recommendedHeaders||{};const edited=prompt(`Headers que se enviarán junto con la URL a ${destination.toUpperCase()} (podés editarlos):`,resolverHeadersText(detected));if(edited===null)return;const headers=resolverParseHeaders(edited);const temp=resolverLooksTemporary(x.url);const summary=`Destino: ${destination.toUpperCase()}\nTipo: ${x.type||'STREAM'}\nURL: ${x.url}\nOrigen: ${r.pageUrl||x.sourcePage||''}\nHeaders: ${Object.keys(headers).length?Object.keys(headers).join(', '):'ninguno'}${temp?'\n\n⚠ POSIBLE URL TEMPORAL/FIRMADA: puede vencer y requerir volver a resolverla.':''}`;if(!confirm(summary+'\n\n¿Continuar y completar los datos del canal?'))return;const name=prompt(`Nombre del canal para ${destination.toUpperCase()}:`,defaultName);if(!name)return;const category=prompt('Categoría de destino:','RESOLVER WEB');if(!category)return;const icon=prompt('Icono / logo (opcional):','')||'';const result=await api('/api/admin/stream-resolver/publish',{method:'POST',body:{destination,name:name.trim(),category:category.trim(),icon:icon.trim(),url:x.url,pageUrl:r.pageUrl||x.sourcePage||'',headers}});toast(`${result.name} agregado a ${destination.toUpperCase()} · ${result.probe.type} · headers ${Object.keys(headers).length}`,'ok');await loadResolverPublished()}
function renderResolverResult(r){
  const out=$('#resolverResults'),play=r.playable||[],all=r.candidates||[];
  const iframes=(r.iframesChecked||all.filter(x=>x.type==='IFRAME')).filter((x,i,arr)=>x?.url&&arr.findIndex(y=>y?.url===x.url)===i).sort((a,b)=>(b.priority||0)-(a.priority||0));
  const scripts=all.filter(x=>x.type==='SCRIPT');
  const other=all.filter(x=>!['HLS','DASH','MP4','IFRAME','SCRIPT'].includes(x.type));
  const hdr=Object.entries(r.recommendedHeaders||{}).map(([k,v])=>`<div><strong>${esc(k)}:</strong> <span class="resolver-code">${esc(v)}</span></div>`).join('');
  const iframeRows=iframes.map((x,i)=>{const score=Number(x.priority||0),stars=score>=30?'★★★★★':score>=15?'★★★★☆':score>=0?'★★★☆☆':'★☆☆☆☆';return `<div class="resolver-item resolver-playable"><div class="resolver-grow"><span class="resolver-type">IFRAME #${i+1}</span><strong>${stars}</strong> <span class="resolver-code">${esc(x.url)}</span><div class="muted tiny">Referer: ${esc(x.sourcePage||r.pageUrl||'')}</div><div class="muted tiny">Prioridad detector: ${score}</div></div><div class="resolver-actions"><button class="ghost mini" data-resolver-iframe-probe="${i}">PROBAR IFRAME</button><button class="primary mini" data-resolver-iframe-search="${i}">BUSCAR STREAM</button></div><div class="resolver-probe-result" id="resolverIframeResult${i}"></div></div>`}).join('');
  out.innerHTML=`<div class="resolver-box"><h4>Resultado</h4><div class="muted small">Página final</div><div class="resolver-code">${esc(r.pageUrl||'')}</div><div class="muted tiny">${(r.pagesChecked||[]).length} ${r.dynamic?'frames/recursos observados dinámicamente':'páginas/recursos inspeccionados, hasta 6 niveles'} · ${iframes.length} iframe(s) detectado(s).</div></div>`+
  `<div class="resolver-box"><h4>Fuentes reproducibles (${play.length})</h4>${play.length?play.map((x,i)=>`<div class="resolver-item resolver-playable"><div class="resolver-grow"><span class="resolver-type">${esc(x.type)}</span><span class="resolver-code">${esc(x.url)}</span><div class="muted tiny">Detectado desde: ${esc(x.sourcePage||r.pageUrl||'')}</div>${resolverLooksTemporary(x.url)?'<div class="badge blocked">⚠ POSIBLE URL TEMPORAL / FIRMADA</div>':''}<div class="muted tiny">Headers: ${esc(Object.keys(x.headers||r.recommendedHeaders||{}).join(', ')||'ninguno')}</div></div><div class="resolver-actions"><button class="ghost mini" data-resolver-probe="${i}">PROBAR</button><button class="primary mini" data-resolver-tv1="${i}">+ TV1</button><button class="primary mini" data-resolver-tv2="${i}">+ TV2</button></div><div class="resolver-probe-result" id="resolverProbe${i}"></div></div>`).join(''):'<div class="muted">No se detectó una fuente directa todavía.</div>'}</div>`+
  `<div class="resolver-box"><h4>IFRAMES candidatos (${iframes.length})</h4><div class="muted tiny">Ordenados por probabilidad de ser el reproductor. Probá primero los de arriba.</div>${iframeRows||'<div class="muted">No se detectaron iframes.</div>'}</div>`+
  `<div class="resolver-box"><h4>Headers sugeridos para prueba</h4><div class="resolver-headers">${hdr}</div></div>`+
  `<div class="resolver-box"><h4>Scripts encontrados (${scripts.length})</h4><div class="muted tiny">Se muestran separados para no mezclarlos con los reproductores.</div>${scripts.slice(0,20).map(x=>`<div class="resolver-item"><span class="resolver-type">SCRIPT</span><span class="resolver-code">${esc(x.url)}</span></div>`).join('')||'<div class="muted">Ninguno.</div>'}${scripts.length>20?`<div class="muted tiny">+ ${scripts.length-20} scripts más ocultos.</div>`:''}</div>`+
  `<div class="resolver-box"><h4>Otros recursos (${other.length})</h4>${other.slice(0,20).map(x=>`<div class="resolver-item"><span class="resolver-type">${esc(x.type)}</span><span class="resolver-code">${esc(x.url)}</span></div>`).join('')||'<div class="muted">Ninguno.</div>'}${other.length>20?`<div class="muted tiny">+ ${other.length-20} recursos más ocultos.</div>`:''}</div>`;
  $$('[data-resolver-probe]').forEach(b=>b.onclick=async()=>{const i=Number(b.dataset.resolverProbe),x=play[i],dst=$(`#resolverProbe${i}`);b.disabled=true;b.textContent='PROBANDO...';try{const pr=await api('/api/admin/stream-resolver/probe',{method:'POST',body:{url:x.url,headers:x.headers||r.recommendedHeaders||{}}});dst.innerHTML=pr.ok?`<span class="badge active">REPRODUCIBLE · ${esc(pr.type)} · HTTP ${pr.status}</span>`:`<span class="badge blocked">NO CONFIRMADO · HTTP ${pr.status} · ${esc(pr.type)}</span>`}catch(e){dst.innerHTML=`<span class="badge blocked">${esc(e.message)}</span>`}finally{b.disabled=false;b.textContent='PROBAR'}});
  $$('[data-resolver-tv1]').forEach(b=>b.onclick=()=>publishResolvedStream(play[Number(b.dataset.resolverTv1)],r,'tv1').catch(e=>alert(e.message)));
  $$('[data-resolver-tv2]').forEach(b=>b.onclick=()=>publishResolvedStream(play[Number(b.dataset.resolverTv2)],r,'tv2').catch(e=>alert(e.message)));
  $$('[data-resolver-iframe-probe]').forEach(b=>b.onclick=async()=>{const i=Number(b.dataset.resolverIframeProbe),x=iframes[i],dst=$(`#resolverIframeResult${i}`);b.disabled=true;b.textContent='PROBANDO...';try{const rr=await api('/api/admin/stream-resolver/iframe',{method:'POST',body:{url:x.url,referer:x.sourcePage||r.pageUrl||''}});const n=(rr.playable||[]).length;dst.innerHTML=n?`<span class="badge active">IFRAME OK · ${n} FUENTE(S) ENCONTRADA(S)</span>`:`<span class="badge">IFRAME LEÍDO · SIN STREAM DIRECTO</span>`;state.lastResolver=rr;renderResolverResult(rr)}catch(e){dst.innerHTML=`<span class="badge blocked">${esc(e.message)}</span>`}finally{b.disabled=false;b.textContent='PROBAR IFRAME'}});
  $$('[data-resolver-iframe-search]').forEach(b=>b.onclick=async()=>{const i=Number(b.dataset.resolverIframeSearch),x=iframes[i];if(!confirm('Se abrirá este iframe con su Referer para observar el reproductor y buscar HLS/DASH/MP4. ¿Continuar?'))return;b.disabled=true;b.textContent='BUSCANDO...';msg($('#resolverMsg'),'Buscando stream dentro del iframe seleccionado...');try{const rr=await api('/api/admin/stream-resolver/iframe/dynamic',{method:'POST',body:{url:x.url,referer:x.sourcePage||r.pageUrl||''}});state.lastResolver=rr;const n=(rr.playable||[]).length;msg($('#resolverMsg'),n?`Encontré ${n} fuente(s) dentro del iframe.`:'El iframe abrió, pero todavía no apareció una fuente HLS/DASH/MP4.',n>0);renderResolverResult(rr)}catch(e){msg($('#resolverMsg'),e.message)}finally{b.disabled=false;b.textContent='BUSCAR STREAM'}});
}
$('#resolverBtn')?.addEventListener('click',async()=>{const url=$('#resolverUrl').value.trim(),btn=$('#resolverBtn'),out=$('#resolverResults');if(!url){msg($('#resolverMsg'),'Ingresá una URL para analizar.');return}btn.disabled=true;btn.textContent='BUSCANDO IFRAME Y STREAM...';out.innerHTML='';msg($('#resolverMsg'),'');try{const r=await api('/api/admin/stream-resolver',{method:'POST',body:{url}});state.lastResolver=r;const play=r.playable||[];msg($('#resolverMsg'),play.length?`Encontré ${play.length} fuente(s) HLS/DASH/MP4. Podés probarlas y enviarlas a TV1 o TV2.`:`No apareció una fuente directa. Se buscaron y siguieron iframes dinámicamente hasta 6 niveles.`,play.length>0);renderResolverResult(r)}catch(e){msg($('#resolverMsg'),e.message)}finally{btn.disabled=false;btn.textContent='ANALIZAR PÁGINA'}});
$('#resolverDynamicBtn')?.addEventListener('click',async()=>{const url=$('#resolverUrl').value.trim(),btn=$('#resolverDynamicBtn'),out=$('#resolverResults');if(!url){msg($('#resolverMsg'),'Ingresá una URL para analizar.');return}if(!confirm('El análisis dinámico abrirá temporalmente la página en un navegador del servidor durante unos segundos. ¿Continuar?'))return;btn.disabled=true;$('#resolverBtn').disabled=true;btn.textContent='ABRIENDO REPRODUCTOR...';out.innerHTML='';msg($('#resolverMsg'),'Ejecutando página y observando solicitudes públicas del reproductor. Puede tardar 10–25 segundos...');try{const r=await api('/api/admin/stream-resolver/dynamic',{method:'POST',body:{url}});state.lastResolver=r;const play=r.playable||[];msg($('#resolverMsg'),play.length?`Análisis dinámico: encontré ${play.length} fuente(s) reproducible(s). Ya podés probarlas o enviarlas a TV1/TV2.`:`El navegador cargó la página, pero no confirmó una fuente HLS/DASH/MP4 pública.`,play.length>0);renderResolverResult(r)}catch(e){msg($('#resolverMsg'),e.message)}finally{btn.disabled=false;$('#resolverBtn').disabled=false;btn.textContent='ANÁLISIS DINÁMICO'}});

function rescueResetForm(){for(const [id,v] of [['rescueEditId',''],['rescueName',''],['rescueCode',''],['rescueType','MPD con ClearKey'],['rescueResolverUrl',''],['rescueTemplate','{token}/live/{codigo}/{nombre}/{ruta}/{archivo}'],['rescueRoute','SA_Live_dash_enc'],['rescueFile','{nombre}.mpd'],['rescueInterval','5'],['rescueHeaders','']]){const e=$('#'+id);if(e)e.value=v}if($('#rescueEnabled'))$('#rescueEnabled').checked=true}
function rescueFormData(){return {name:$('#rescueName').value.trim(),code:$('#rescueCode').value.trim(),streamType:$('#rescueType').value.trim(),resolverUrl:$('#rescueResolverUrl').value.trim(),template:$('#rescueTemplate').value.trim(),routePath:$('#rescueRoute').value.trim(),fileName:$('#rescueFile').value.trim(),intervalMinutes:Number($('#rescueInterval').value||5),headers:resolverParseHeaders($('#rescueHeaders').value),enabled:$('#rescueEnabled').checked}}
async function loadRescueChannels(){const box=$('#rescueList');if(!box)return;try{const r=await api('/api/admin/rescue-resolver/channels'),items=r.items||[];box.innerHTML=items.length?items.map(x=>`<div class="rescue-row"><div class="rescue-row-head"><div><strong>${esc(x.name)}</strong> · <span class="resolver-code">${esc(x.code)}</span> <span class="badge ${x.last_status==='OK'?'active':x.last_status==='ERROR'?'blocked':''}">${esc(x.last_status||'PENDIENTE')}</span><div class="muted tiny">${esc(x.stream_type)} · cada ${Number(x.interval_minutes||5)} min · automático ${x.enabled?'ACTIVO':'DETENIDO'}</div></div><div class="resolver-actions"><button class="ghost mini" data-rescue-run="${x.id}">RESOLVER AHORA</button><button class="ghost mini" data-rescue-edit="${x.id}">EDITAR</button><button class="danger mini" data-rescue-del="${x.id}">ELIMINAR</button></div></div><div class="muted tiny">URL resolver</div><div class="resolver-code">${esc(x.resolver_url)}</div><div class="muted tiny">Base actual / último válido</div><div class="resolver-code">${esc(x.current_base||x.last_good_base||'—')}</div><div class="muted tiny">URL generada</div><div class="resolver-code">${esc(x.generated_url||'—')}</div>${x.last_error?`<div class="msg bad">${esc(x.last_error)}${x.last_good_base?' · Se conservó el último valor válido.':''}</div>`:''}<div class="muted tiny">Última ejecución: ${esc(x.last_run_at||'todavía no ejecutado')}</div></div>`).join(''):'<div class="muted">Todavía no configuraste canales de prueba para COCHI RESCUE.</div>';state.rescueItems=items;$$('[data-rescue-run]').forEach(b=>b.onclick=async()=>{b.disabled=true;b.textContent='RESOLVIENDO...';try{const rr=await api(`/api/admin/rescue-resolver/channels/${b.dataset.rescueRun}/run`,{method:'POST',body:{}});toast(rr.item?.last_status==='OK'?'Base actualizada':'Falló; se conservó el último valor válido',rr.item?.last_status==='OK'?'ok':'bad');await loadRescueChannels()}catch(e){alert(e.message)}finally{b.disabled=false;b.textContent='RESOLVER AHORA'}});$$('[data-rescue-edit]').forEach(b=>b.onclick=()=>{const x=(state.rescueItems||[]).find(v=>String(v.id)===String(b.dataset.rescueEdit));if(!x)return;$('#rescueEditId').value=x.id;$('#rescueName').value=x.name||'';$('#rescueCode').value=x.code||'';$('#rescueType').value=x.stream_type||'';$('#rescueResolverUrl').value=x.resolver_url||'';$('#rescueTemplate').value=x.template||'';$('#rescueRoute').value=x.route_path||'';$('#rescueFile').value=x.file_name||'';$('#rescueInterval').value=x.interval_minutes||5;$('#rescueHeaders').value=resolverHeadersText(x.headers||{});$('#rescueEnabled').checked=!!x.enabled;$('#rescueName').scrollIntoView({behavior:'smooth',block:'center'})});$$('[data-rescue-del]').forEach(b=>b.onclick=async()=>{if(!confirm('¿Eliminar esta configuración de COCHI RESCUE?'))return;try{await api(`/api/admin/rescue-resolver/channels/${b.dataset.rescueDel}`,{method:'DELETE'});await loadRescueChannels()}catch(e){alert(e.message)}})}catch(e){box.innerHTML=`<div class="msg bad">${esc(e.message)}</div>`}}
$('#rescueSaveBtn')?.addEventListener('click',async()=>{const id=$('#rescueEditId').value,body=rescueFormData(),btn=$('#rescueSaveBtn');if(!body.name||!body.code||!body.resolverUrl){msg($('#rescueMsg'),'Completá nombre, código y URL resolver.');return}btn.disabled=true;try{await api(id?`/api/admin/rescue-resolver/channels/${id}`:'/api/admin/rescue-resolver/channels',{method:id?'PUT':'POST',body});msg($('#rescueMsg'),id?'Configuración actualizada.':'Canal guardado para prueba.',true);rescueResetForm();await loadRescueChannels()}catch(e){msg($('#rescueMsg'),e.message)}finally{btn.disabled=false}});
$('#rescueCancelBtn')?.addEventListener('click',()=>{rescueResetForm();msg($('#rescueMsg'),'')});

loadResolverPublished();
loadRescueChannels();
