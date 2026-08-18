const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = { me:null, accounts:[], clients:[], devices:[], promos:[], sources:[], demoSettings:null, adultSettings:null, playbackSecurity:null, content:{} };
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
$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal();});

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

function enterApp(){
  show('appView');
  $('#meName').textContent=state.me.name;
  $('#roleEyebrow').textContent=state.me.role_name;
  $('#meCredits').textContent=state.me.role_level===1?'':`${state.me.credits} créditos`;
  $$('.admin-only').forEach(x=>x.classList.toggle('hidden',state.me.role_level!==1));
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
  const t={dashboard:'Inicio',accounts:'Fichas PANEL',clients:'Clientes finales',devices:'Dispositivos',credits:'Créditos',promotions:'Promociones',demos:'Demos',adults:'PIN Adultos',sources:'Fuentes de contenido',content:'Manager de Contenido',resolver:'Resolver stream web',security:'Seguridad de reproducción'};
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
    if(v==='security'&&state.me.role_level===1)await loadPlaybackSecurity();
    if(v==='sources'&&state.me.role_level===1)await loadSources();
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

function renderAccounts(){
  const q=($('#accountSearch')?.value||'').trim().toLowerCase();
  const rows=state.accounts.filter(x=>!q||[x.name,x.contact,x.role_name,x.parent_name,x.active?'activa':'deshabilitada',x.manual_blocked?'bloqueada':''].some(v=>String(v||'').toLowerCase().includes(q)));
  $('#accountsBody').innerHTML=rows.length?rows.map(x=>{
    const blocked=x.inactivity_blocked;
    const stat=x.is_root_admin?'<span class="badge active">PROTEGIDA</span>':x.manual_blocked?`<span class="badge blocked">BLOQUEADA</span><div class="muted small">${esc(x.block_reason||'')}</div>`:!x.active?'<span class="badge blocked">DESHABILITADA</span>':blocked?'<span class="badge pending">BLOQUEO 2 MESES</span>':'<span class="badge active">ACTIVA</span>';
    const creditValue=x.role_level===1?'—':x.credits;
    return `<tr data-account="${x.id}"><td><b>${esc(x.name)}</b>${x.is_root_admin?'<div class="muted small">Panel principal</div>':`<div class="muted small">${esc(x.contact||'')}</div>`}</td><td><span class="role-chip role-${x.role_level}">${esc(x.role_name)}</span></td><td>${esc(x.parent_name||'—')}</td><td class="credit-number"><div>${creditValue}</div></td><td>${x.panel_device_count}/2</td><td>${stat}<div class="muted small">${x.next_inactivity_block_at?`Límite: ${esc(fmt(x.next_inactivity_block_at))}`:''}</div></td><td><button class="ghost" data-action="account-edit">Editar</button></td></tr>`;
  }).join(''):`<tr><td colspan="7" class="empty">${q?'No hay paneles que coincidan con la búsqueda.':'No hay fichas PANEL visibles.'}</td></tr>`;
}
async function loadAccounts(render=true){const d=await api('/api/admin/accounts');state.accounts=d.accounts;if(render)renderAccounts();}
$('#accountSearch')?.addEventListener('input',renderAccounts);

$('#newAccountBtn').addEventListener('click',()=>openAccountModal());
function allowedRoleOptions(current=null){
  const min=state.me.role_level===1?1:state.me.role_level;return [1,2,3,4].filter(x=>x>=min).map(x=>`<option value="${x}" ${current===x?'selected':''}>${roleNames[x]}</option>`).join('');
}
function openAccountModal(a=null){
  const admin=state.me.role_level===1,root=Boolean(a?.is_root_admin);
  
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

const controlSection=a&&!root?`
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

  openModal(`<h3>${a?'Editar ficha PANEL':'Nueva ficha PANEL'}</h3>${root?'<div class="protected-note">🔒 ADMINISTRACIÓN principal protegida: podés editar nombre, contacto y notas, pero no deshabilitarla, bajarla de categoría ni cambiar su propietario.</div>':''}${accountSummary}<form id="accountForm"><label>Nombre<input id="aName" required value="${esc(a?.name||'')}"></label><div class="form-row"><label>Categoría<select id="aRole" ${(a&&!admin)||root?'disabled':''}>${allowedRoleOptions(a?.role_level||null)}</select></label><label>Contacto<input id="aContact" value="${esc(a?.contact||'')}"></label></div>${a&&admin&&!root?`<label>Propietario<select id="aParent"><option value="">Sin propietario</option>${state.accounts.filter(x=>x.id!==a.id).map(x=>`<option value="${x.id}" ${a.parent_id===x.id?'selected':''}>${esc(x.name)} — ${esc(x.role_name)}</option>`).join('')}</select></label>`:''}<label>Notas<textarea id="aNotes" rows="3">${esc(a?.notes||'')}</textarea></label>${a&&!root?`<label class="switch-row"><input id="aActive" type="checkbox" ${a.active?'checked':''}> Ficha habilitada</label>`:''}${controlSection}<div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">Guardar</button></div><div id="accountMsg" class="msg"></div></form>`);

  $('#accountForm').addEventListener('submit',async e=>{
    e.preventDefault();
    try{
      const payload={name:$('#aName').value,contact:$('#aContact').value,notes:$('#aNotes').value};
      if(!a)payload.roleLevel=Number($('#aRole').value);
      else if(admin&&!root)payload.roleLevel=Number($('#aRole').value);
      if(a&&!root){
        payload.active=$('#aActive').checked;
        if(admin)payload.parentId=$('#aParent').value?Number($('#aParent').value):null;
      }
      const r=await api(a?`/api/admin/accounts/${a.id}`:'/api/admin/accounts',{method:a?'PUT':'POST',body:payload});
      if(!a){
        openModal(`<h3>Ficha PANEL creada</h3><p>${esc(r.role)}</p><div class="code-big">${esc(r.activationCode)}</div><p class="muted">Código para activar hasta 2 dispositivos del PANEL.</p><div class="modal-actions"><button class="primary" data-close>Listo</button></div>`);
      }else closeModal();
      await loadAccounts();
    }catch(err){msg($('#accountMsg'),err.message);}
  });

  if(a&&!root){
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
      ${admin?`<label>Propietario<select id="cOwner"><option value="${state.me.id}">${esc(state.me.name)} — PANEL PRINCIPAL</option>${owners.filter(x=>x.id!==state.me.id).map(x=>`<option value="${x.id}" ${c?.owner_account_id===x.id?'selected':''}>${esc(x.name)} — ${esc(x.role_name)}</option>`).join('')}</select></label>`:''}
      <label>Notas<textarea id="cNotes" rows="3">${esc(c?.notes||'')}</textarea></label>
      ${c?`<label class="switch-row"><input id="cActive" type="checkbox" ${c.active?'checked':''}> Cliente habilitado</label>`:
      `<div class="client-code-box muted"><b>Códigos CO-CHI</b><span>Primero guardá el cliente. Luego podrás vincular sus dispositivos.</span></div>`}
      <div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">Guardar</button></div>
      <div id="clientMsg" class="msg"></div>
    </form>`);

  $('#clientCodesBtn')?.addEventListener('click',()=>openClientCodes(c));
  $('#clientRenewBtn')?.addEventListener('click',async()=>{
    if(renewDisabled)return;
    const q=state.me?.role_level===1?`¿Activar/renovar a ${c.name} por 30 días?`:`¿Usar 1 crédito para activar/renovar a ${c.name}?`;
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
      if(admin)body.ownerAccountId=Number($('#cOwner').value);
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
    const changes=Number(d.changesThisMonth||0),changesRemaining=Number(d.changesRemaining??Math.max(0,2-changes));
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
      <div class="rule-card profile-expand-card"><div><b>Ampliar este perfil</b><span>Sumá 2 dispositivos por 1 crédito. El crédito se descuenta al vendedor propietario.</span></div><button type="button" class="primary" id="buyExtraDevicesBtn">+2 DISPOSITIVOS · 1 CRÉDITO</button></div>
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
    $('#buyExtraDevicesBtn')?.addEventListener('click',async()=>{
      if(!confirm(`¿Agregar 2 dispositivos a ${c.name}? Se descontará 1 crédito al vendedor y ambos respetarán el vencimiento actual del perfil.`))return;
      try{const r=await api(`/api/admin/clients/${c.id}/extra-devices`,{method:'POST'});alert(`Capacidad ampliada a ${r.newLimit} dispositivos. Vencimiento compartido: ${r.expiresAt?fmt(r.expiresAt):'sin activar'}.`);await refreshMe();await loadClients(false);openClientCodes(state.clients.find(x=>x.id===c.id)||c);}catch(err){alert(err.message);}
    });
    $$('.device-delete-btn').forEach(btn=>btn.addEventListener('click',async()=>{
      if(!confirm(`¿Desvincular este dispositivo para reemplazarlo? Este cambio cuenta dentro del límite mensual (máximo 2). No devuelve créditos ni reinicia demos. Después podrás vincular el nuevo equipo.`))return;
      try{const r=await api(`/api/admin/client-devices/${Number(btn.dataset.device)}`,{method:'DELETE'});alert(`Dispositivo desvinculado. Cambios este mes: ${r.changesThisMonth}/2.`);await loadClients(false);openClientCodes(state.clients.find(x=>x.id===c.id)||c);}catch(err){alert(err.message);}
    }));
  }catch(err){alert(err.message);}
}

async function loadDevices(){const d=await api('/api/admin/client-devices');state.devices=d.devices;$('#devicesBody').innerHTML=state.devices.length?state.devices.map(x=>{const eff=x.effective_status||x.status.toUpperCase();const cls=eff==='ACTIVO'||eff==='DEMO ACTIVO'?'active':eff==='BLOQUEADO'||eff==='DEMO VENCIDO'?'blocked':'pending';const demo=x.demo?.active?`<div class="muted small success-text" ${liveDemoAttrs(x.demo.remainingSeconds,x.id)}>DEMO ACTIVO · ${fmtDuration(x.demo.remainingSeconds)}</div>`:x.demo?.used?'<div class="muted small">Demo usado</div>':'';return `<tr data-device="${x.id}"><td><code>${esc(x.activation_code)}</code></td><td><b>${esc(x.device_name||x.device_uid)}</b><div class="muted small">${esc(x.device_uid)}</div></td><td>${esc(x.client_name||'Pendiente')}</td><td>${esc(x.owner_name||'—')}</td><td><span class="badge ${cls}">${esc(eff)}</span>${demo}</td><td>${esc(fmt(x.last_seen_at))}</td><td><div class="actions">${x.status==='active'?'<button class="danger-btn" data-action="device-block">Bloquear</button>':''}${x.status==='blocked'?'<button class="ghost" data-action="device-reactivate">Reactivar</button>':''}</div></td></tr>`;}).join(''):`<tr><td colspan="7" class="empty">Sin dispositivos asociados.</td></tr>`;}
$('#manualClientDeviceBtn').addEventListener('click',async()=>{try{const r=await api('/api/admin/client-devices/manual',{method:'POST',body:{deviceName:'Dispositivo de prueba'}});openModal(`<h3>Dispositivo de prueba creado</h3><div class="code-big">${esc(r.activationCode)}</div><p class="muted">Usá “Activar por código” para asociarlo a un cliente.</p><div class="modal-actions"><button class="primary" data-close>Listo</button></div>`);}catch(e){alert(e.message);}});
$('#assignByCodeBtn').addEventListener('click',()=>{if(!state.clients.length){alert('Primero creá un cliente.');return;}openModal(`<h3>Activar dispositivo por código</h3><form id="assignForm"><label>Código CO-CHI<input id="assignCode" placeholder="ABCD-1234" required></label><label>Cliente<select id="assignClient">${state.clients.map(c=>`<option value="${c.id}">${esc(c.name)} (${c.device_count}/${c.device_limit||2})</option>`).join('')}</select></label><div class="modal-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">ACTIVAR</button></div><div id="assignMsg" class="msg"></div></form>`);$('#assignForm').addEventListener('submit',async e=>{e.preventDefault();try{await api('/api/admin/client-devices/assign-by-code',{method:'POST',body:{activationCode:$('#assignCode').value,clientId:Number($('#assignClient').value)}});closeModal();await loadDevices();await loadClients(false);}catch(err){msg($('#assignMsg'),err.message);}});});
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

async function loadSources(){
  const d=await api('/api/admin/sources');state.sources=d.sources;
  $('#sourcesList').innerHTML=state.sources.map(s=>{const priv=s.private_upload;const isMovies=s.source_key==='movies';const privInfo=priv?`<div class="source-private-info"><span class="badge active">FUENTE PRIVADA EN PANEL</span><b>${esc(priv.fileName||'peliculas.json')}</b><span>${Number(priv.stats?.categories||0)} categorías · ${Number(priv.stats?.items||0)} contenidos · ${(Number(priv.bytes||0)/1024).toFixed(1)} KB</span><span>Actualizada: ${esc(fmt(priv.updatedAt||priv.uploadedAt))}</span></div>`:'';return `<div class="source-row" data-source="${esc(s.source_key)}"><div class="source-head"><div class="source-title">${esc(s.label)}</div><label class="switch-row"><input class="source-enabled" type="checkbox" ${s.enabled?'checked':''}> Habilitada</label></div>${privInfo}<div class="source-fields"><label>URL DE ORIGEN PRIVADA<input class="source-url" value="${esc(s.url||'')}" placeholder="https://github.com/.../lista.json" title="${esc(s.url||'')}"></label><label>ENDPOINT PROTEGIDO PARA CO-CHI<input class="source-delivery" value="${esc(s.delivery_url||'')}" readonly title="${esc(s.delivery_url||'')}"></label></div><div class="source-actions">${isMovies?`<input class="private-json-file" type="file" accept=".json,application/json" hidden><button class="primary source-upload-json" type="button">SUBIR JSON ORIGINAL AL PANEL</button>${priv?'<button class="ghost source-remove-private" type="button">VOLVER A URL EXTERNA</button>':''}`:''}<button class="primary source-save-import" type="button">GUARDAR E IMPORTAR URL</button><span class="source-status muted small"></span></div><div class="muted small source-help">${priv?'Esta fuente maestra está guardada de forma privada en Railway/PANEL. No se publica en GitHub. Guardar en JSON original actualizará esta copia privada.':'La APK usa únicamente el endpoint protegido. La URL de origen privada solo la utiliza el backend para importar el JSON.'}</div></div>`}).join('');msg($('#sourcesMsg'),'');}
$('#saveSourcesBtn').addEventListener('click',async()=>{try{const sources=$$('.source-row').map(r=>({key:r.dataset.source,url:r.querySelector('.source-url').value.trim(),enabled:r.querySelector('.source-enabled').checked}));await api('/api/admin/sources',{method:'PUT',body:{sources}});const text='CAMBIOS GUARDADOS CORRECTAMENTE';msg($('#sourcesMsg'),text,true);toast(text,'ok');await loadSources();msg($('#sourcesMsg'),text,true);}catch(e){const text='NO SE PUDIERON GUARDAR LOS CAMBIOS · '+e.message;msg($('#sourcesMsg'),text);toast(text,'bad');}});
$('#sourcesList')?.addEventListener('click',async e=>{
  const row=e.target.closest('.source-row');if(!row)return;const key=row.dataset.source,status=row.querySelector('.source-status'),label=(row.querySelector('.source-title')?.textContent||key).trim();
  const upload=e.target.closest('.source-upload-json');if(upload){const input=row.querySelector('.private-json-file');input.value='';input.click();return;}
  const remove=e.target.closest('.source-remove-private');if(remove){if(!confirm('¿Quitar la fuente privada de Películas y volver a usar la URL externa configurada? La copia gestionada y la publicada en la app no se borrarán.'))return;try{await api('/api/admin/sources/movies/private-upload',{method:'DELETE'});toast('Fuente privada quitada. Ahora Películas volverá a usar la URL externa.','ok');await loadSources();}catch(err){toast(err.message,'bad')}return;}
  const b=e.target.closest('.source-save-import');if(!b)return;const url=row.querySelector('.source-url').value.trim(),enabled=row.querySelector('.source-enabled').checked;if(!url){const text='Ingresá la URL de origen privada.';status.textContent=text;status.className='source-status msg error';toast(text,'bad');return;}b.disabled=true;const old=b.textContent;b.textContent='IMPORTANDO...';status.textContent='Guardando URL e importando JSON...';status.className='source-status muted small';try{const r=await api(`/api/admin/sources/${key}/save-import`,{method:'POST',body:{url,enabled}});const st=r.stats?`${r.stats.categories} categorías · ${r.stats.items} contenidos${r.stats.nested?` · ${r.stats.nested} capítulos/entradas`:''}`:'contenido actualizado';const text=`${label}: GUARDADO E IMPORTADO CORRECTAMENTE · ${st}`;status.textContent=text;status.className='source-status msg ok';msg($('#sourcesMsg'),text,true);toast(text,'ok');await loadSources();}catch(err){const text=`${label}: NO SE PUDO IMPORTAR · ${err.message}`;status.textContent=text;status.className='source-status msg error';msg($('#sourcesMsg'),text);toast(text,'bad');}finally{b.disabled=false;b.textContent=old;}
});
$('#sourcesList')?.addEventListener('change',async e=>{const input=e.target.closest('.private-json-file');if(!input||!input.files?.[0])return;const row=input.closest('.source-row'),status=row.querySelector('.source-status'),file=input.files[0];if(file.size>25*1024*1024){toast('El JSON supera 25 MB.','bad');return;}if(!confirm(`¿Subir ${file.name} como FUENTE MAESTRA PRIVADA de Películas?\n\nEl archivo quedará en el almacenamiento privado del PANEL y no en GitHub. Se conservarán hasta 5 respaldos anteriores.`))return;status.textContent='Leyendo y validando JSON...';status.className='source-status muted small';try{const raw=await file.text();const json=JSON.parse(raw);if(!Array.isArray(json))throw new Error('El JSON debe ser un arreglo de categorías');const r=await api('/api/admin/sources/movies/upload-json',{method:'POST',body:{fileName:file.name,json}});const text=`Películas: FUENTE PRIVADA GUARDADA · ${r.stats.categories} categorías · ${r.stats.items} contenidos`;toast(text,'ok');msg($('#sourcesMsg'),text,true);await loadSources();}catch(err){const text='NO SE PUDO SUBIR EL JSON · '+err.message;status.textContent=text;status.className='source-status msg error';toast(text,'bad');}});


function contentPlain(){
  const raw=$('#contentJson').value.trim();if(!raw)return [];
  const x=JSON.parse(raw);if(!Array.isArray(x))throw new Error('La lista debe ser un arreglo de categorías.');return x;
}
function setContentPlain(x){$('#contentJson').value=x?JSON.stringify(x,null,2):'';renderContentVisual();}
function contentItemName(x){return x?.name||x?.title||x?.nombre||'(sin nombre)';}
function contentItemMeta(x){const bits=[];if(x?.uri)bits.push(x.uri);if(Array.isArray(x?.temp))bits.push(`${x.temp.length} capítulos/entradas`);return bits.join(' · ');}
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
  const visible=data.map((g,gi)=>{
    const items=Array.isArray(g.samples)?g.samples:[];
    const catMatch=String(g.name||'').toLowerCase().includes(q);
    const matchedItems=q&&!catMatch?items.map((x,si)=>({x,si})).filter(({x})=>[contentItemName(x),contentItemMeta(x)].some(v=>String(v||'').toLowerCase().includes(q))):items.map((x,si)=>({x,si}));
    if(q&&!catMatch&&!matchedItems.length)return '';
    const isOpen=q?true:state.contentOpen.has(gi);
    const shown=catMatch?items.map((x,si)=>({x,si})):matchedItems;
    return `<div class="content-category ${isOpen?'open':''}">
      <div class="content-category-head">
        <button class="category-toggle" data-category-toggle="${gi}" aria-expanded="${isOpen?'true':'false'}">
          <span class="category-chevron">${isOpen?'▾':'▸'}</span>
          <span><strong>${esc(g.name||`Categoría ${gi+1}`)}</strong><span class="muted small">${items.length} contenidos · posición ${gi+1}/${data.length}</span></span>
        </button>
        <div class="content-category-actions"><button class="order-btn" title="Subir categoría" data-cat-quick="${gi}:up">↑</button><button class="order-btn" title="Bajar categoría" data-cat-quick="${gi}:down">↓</button><button class="ghost mini" data-content-add="${gi}">+ CONTENIDO</button><button class="ghost mini" data-category-edit="${gi}">EDITAR</button><button class="danger mini" data-category-delete="${gi}">ELIMINAR</button></div>
      </div>
      <div class="content-items ${isOpen?'':'collapsed'}">${shown.map(({x,si})=>`<div class="content-item">
        ${x?.icon?`<img src="${esc(x.icon)}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}
        <div class="content-item-main"><strong>${esc(contentItemName(x))}</strong><span class="muted small">${esc(contentItemMeta(x))}</span><span class="muted tiny">Posición ${si+1}/${items.length}</span></div>
        <div class="content-item-actions"><button class="order-btn" title="Subir contenido" data-item-quick="${gi}:${si}:up">↑</button><button class="order-btn" title="Bajar contenido" data-item-quick="${gi}:${si}:down">↓</button><button class="ghost mini" data-content-edit="${gi}:${si}">EDITAR</button><button class="danger mini" data-content-delete="${gi}:${si}">ELIMINAR</button></div>
      </div>`).join('')||'<div class="empty muted small">Sin contenidos.</div>'}</div>
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
  const existingFirst=Array.isArray(cur.temp)&&cur.temp.length?cur.temp[0]:{name:'1',icon:cur.icon||'',uri:cur.uri||''};
  const streamType=String(cur.type||cur.tipo||'auto').toLowerCase();
  const drmScheme=String(cur.drm_scheme||'').toLowerCase();
  const existingKeys=Array.isArray(cur.keys)?cur.keys.map(x=>x&&x.kid&&x.key?`${x.kid}:${x.key}`:'').filter(Boolean).join('\n'):(drmScheme==='clearkey'?String(cur.drm_license_url||''):'');
  const existingHeaders=cur.headers&&typeof cur.headers==='object'?Object.entries(cur.headers).map(([k,v])=>`${k}: ${v}`).join('\n'):'';
  const existingBackups=Array.isArray(cur.backupUris)?cur.backupUris.join('\n'):'';
  openModal(`<div class="content-editor-head"><div><h3>${itemIndex===null?'Agregar':'Editar'} contenido</h3><p class="muted small">Edición ampliada: aprovechá el ancho de la pantalla para revisar los datos sin bajar tanto.</p></div><button type="button" class="ghost compact-close" data-close>✕</button></div><form id="contentItemForm" class="content-editor-form">
    <div class="content-editor-grid">
      <section class="content-editor-column">
        <label>Nombre<input id="ciName" value="${esc(cur.name||'')}" required></label>
        <label>Icono / carátula<input id="ciIcon" value="${esc(cur.icon||'')}" placeholder="https://..."></label>
        ${isSeries?`<label>URL principal de la serie (opcional)<input id="ciUri" value="${esc(cur.uri||'')}" placeholder="https://..."><span class="muted tiny">No es un tráiler. Si cada capítulo tiene su propia URL, podés dejar este campo vacío.</span></label>`:`<label>URL principal de reproducción<input id="ciUri" value="${esc(cur.uri||'')}" placeholder="https://..."></label>`}
        ${isTv?`<div class="stream-format-box"><h4>FORMATO DE REPRODUCCIÓN</h4><div class="form-row"><label>Tipo de entrada<select id="ciStreamType"><option value="auto" ${streamType==='auto'?'selected':''}>Automático (recomendado)</option><option value="hls" ${streamType==='hls'?'selected':''}>HLS / M3U8</option><option value="dash" ${streamType==='dash'?'selected':''}>DASH / MPD</option><option value="youtube" ${streamType==='youtube'?'selected':''}>YouTube</option><option value="remote_playlist" ${streamType==='remote_playlist'?'selected':''}>Lista remota M3U/M3U8</option></select></label><label>DRM<select id="ciDrmScheme"><option value="" ${!drmScheme?'selected':''}>Sin DRM</option><option value="clearkey" ${drmScheme==='clearkey'?'selected':''}>ClearKey / MultiKey</option></select></label></div><label id="ciKeysWrap">Claves ClearKey / MultiKey<textarea id="ciKeys" rows="4" spellcheck="false" placeholder="KID:KEY&#10;KID2:KEY2">${esc(existingKeys)}</textarea><span class="muted tiny">Una clave por línea. El PANEL la guarda como arreglo <b>keys</b> compatible con CO-CHI.</span></label><label>Headers opcionales<textarea id="ciHeaders" rows="4" spellcheck="false" placeholder="Referer: https://...&#10;Origin: https://...&#10;User-Agent: ...">${esc(existingHeaders)}</textarea></label><label>Fuentes de respaldo / FAILOVER<textarea id="ciBackupUris" rows="4" spellcheck="false" placeholder="https://respaldo-1/...&#10;https://respaldo-2/...">${esc(existingBackups)}</textarea><span class="muted tiny">Una URL por línea. El backend prueba la principal y usa el primer respaldo saludable al entregar TV1/TV2. Conserva siempre la URL principal original.</span></label><p class="muted tiny">Para Pluto u otra lista remota elegí <b>Lista remota M3U/M3U8</b>. Widevine con servidor de licencias no se muestra todavía porque la APK actual no implementa ese flujo; así evitamos guardar una configuración que no podría reproducir.</p></div>`:''}
        <div class="form-row"><label>Mover a categoría<select id="ciCategory">${targetOptions}</select></label><label>Posición<input id="ciPosition" type="number" min="1" value="${currentPos}"></label></div>
        ${itemIndex!==null?`<div class="reorder-actions"><button type="button" class="ghost" data-item-move="first">Primero</button><button type="button" class="ghost" data-item-move="up">↑ Subir</button><button type="button" class="ghost" data-item-move="down">↓ Bajar</button><button type="button" class="ghost" data-item-move="last">Último</button></div>`:''}
      </section>
      <section class="content-editor-column content-editor-extra">
        <label>Datos adicionales desencriptados<textarea id="ciExtras" class="content-item-json content-item-json-wide" spellcheck="false">${esc(JSON.stringify(extras,null,2))}</textarea></label>
        <p class="muted small">Podés cambiar de categoría y orden. En Series, el PANEL mantiene el formato histórico compatible con CO-CHI y cifra al guardar.</p>
      </section>
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
    <div class="modal-actions content-editor-actions"><button type="button" class="ghost" data-close>Cancelar</button><button class="primary" type="submit">GUARDAR</button></div><div id="ciMsg" class="msg"></div>
  </form>`);
  $('#modal').classList.add('content-editor-modal');
  $$('[data-close]').forEach(x=>x.onclick=closeModal);
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
  const parseHeaderLines=text=>{const out={};for(const line of String(text||'').split(/\r?\n/)){const i=line.indexOf(':');if(i<=0)continue;const k=line.slice(0,i).trim(),v=line.slice(i+1).trim();if(k&&v)out[k]=v;}return out;};
  const parseKeyLines=text=>{const out=[];for(const line of String(text||'').split(/[\r\n,;]+/)){const p=line.trim();if(!p)continue;const i=p.indexOf(':');if(i<=0||i>=p.length-1)throw new Error('Clave inválida. Usá KID:KEY, una por línea.');const kid=p.slice(0,i).trim(),key=p.slice(i+1).trim();if(!kid||!key)throw new Error('Clave inválida. Usá KID:KEY.');out.push({kid,key});}return out;};
  const refreshStreamFields=()=>{if(!isTv)return;const drm=$('#ciDrmScheme')?.value||'';if($('#ciKeysWrap'))$('#ciKeysWrap').style.display=drm==='clearkey'?'grid':'none';};
  if(isTv){$('#ciDrmScheme')?.addEventListener('change',refreshStreamFields);$('#ciStreamType')?.addEventListener('change',()=>{if($('#ciStreamType').value==='remote_playlist'){if($('#ciDrmScheme'))$('#ciDrmScheme').value='';refreshStreamFields();}});refreshStreamFields();}
  $('#contentItemForm').onsubmit=e=>{
    e.preventDefault();
    try{
      const extraText=$('#ciExtras').value.trim(),extra=extraText?JSON.parse(extraText):{};
      const obj={...extra,name:$('#ciName').value.trim()};
      const icon=$('#ciIcon').value.trim(),uri=$('#ciUri').value.trim();
      if(icon)obj.icon=icon;else delete obj.icon;if(uri)obj.uri=uri;else delete obj.uri;
      if(isTv){
        const t=$('#ciStreamType').value||'auto',drm=$('#ciDrmScheme').value||'',headers=parseHeaderLines($('#ciHeaders').value);
        if(t&&t!=='auto')obj.type=t;else delete obj.type;delete obj.tipo;
        if(drm==='clearkey'){const keys=parseKeyLines($('#ciKeys').value);if(!keys.length)throw new Error('ClearKey seleccionado: cargá al menos un par KID:KEY.');obj.drm_scheme='clearkey';obj.keys=keys;delete obj.drm_license_url;}else{delete obj.drm_scheme;delete obj.keys;if(String(obj.drm_license_url||'').includes(':'))delete obj.drm_license_url;}
        if(Object.keys(headers).length)obj.headers=headers;else delete obj.headers;
        const backups=String($('#ciBackupUris')?.value||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(backups.length)obj.backupUris=[...new Set(backups.filter(x=>x!==uri))];else delete obj.backupUris;
        if(t==='remote_playlist'){delete obj.drm_scheme;delete obj.keys;delete obj.drm_license_url;}
      }
      const targetGroup=Number($('#ciCategory').value);
      let pos=Math.max(1,Number($('#ciPosition').value)||1)-1;
      if(itemIndex===null){
        const target=d[targetGroup].samples||(d[targetGroup].samples=[]);pos=Math.min(pos,target.length);target.splice(pos,0,obj);
      }else{
        d[groupIndex].samples.splice(itemIndex,1);
        const target=d[targetGroup].samples||(d[targetGroup].samples=[]);pos=Math.min(pos,target.length);target.splice(pos,0,obj);
      }
      state.contentOpen.add(targetGroup);setContentPlain(d);closeModal();
    }catch(err){msg($('#ciMsg'),'Datos adicionales inválidos: '+err.message);}
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
$('#contentSourceSaveBtn')?.addEventListener('click',saveContentSource);
$('#contentSourceReloadBtn')?.addEventListener('click',loadContentSource);
$('#contentKey')?.addEventListener('change',loadContent);
$('#contentLoadBtn')?.addEventListener('click',loadContent);
$('#contentVisualRefreshBtn')?.addEventListener('click',renderContentVisual);
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
$('#contentSaveBtn')?.addEventListener('click',async()=>{
  try{
    const key=$('#contentKey').value,json=contentPlain();
    const r=await api(`/api/admin/content/${key}`,{method:'PUT',body:{json}});
    await loadContent(true);
    const remote=r.remote||{};
    let text='';
    if(remote.kind==='private_upload'||r.originalStorage==='private_panel'){
      const file=remote.fileName?` · ${remote.fileName}`:'';
      text=`JSON ORIGINAL PRIVADO ACTUALIZADO · ${key.toUpperCase()}${r.stats?` · ${r.stats.items} contenidos`:''} · GUARDADO EN PANEL${file} · respaldo automático · la app todavía no fue modificada`;
    }else{
      const where=remote.kind==='release_asset'?`${remote.owner}/${remote.repo} · release ${remote.tag} · ${remote.assetName}`:(remote.filePath?`${remote.owner}/${remote.repo} · ${remote.filePath}`:'GitHub');
      const verified=remote.verified?' · VERIFICADO EN GITHUB':'';
      text=`JSON ORIGINAL ACTUALIZADO · ${key.toUpperCase()}${r.stats?` · ${r.stats.items} contenidos`:''} · ${where}${verified} · la app todavía no fue modificada`;
    }
    msg($('#contentMsg'),text,true);toast(text,'ok');
  }catch(e){
    const text=e instanceof SyntaxError?'JSON inválido: '+e.message:e.message;
    msg($('#contentMsg'),text);toast(text,'bad');
  }
});
$('#contentUseBtn')?.addEventListener('click',async()=>{
  try{
    const key=$('#contentKey').value,json=contentPlain();
    // v0.9.10: esta acción publica la edición actual para la app, sin modificar el JSON original de GitHub.
    const r=await api(`/api/admin/content/${key}/publish`,{method:'POST',body:{json}});
    await loadContent(true);
    const text=`ENCRIPTADO Y CARGADO A LA APP · ${key.toUpperCase()}${r.stats?` · ${r.stats.items} contenidos`:''} · JSON original sin cambios`;
    msg($('#contentMsg'),text,true);toast(text,'ok');
  }catch(e){
    const text=e instanceof SyntaxError?'JSON inválido: '+e.message:e.message;
    msg($('#contentMsg'),text);toast(text,'bad');
  }
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
function renderResolverResult(r){const out=$('#resolverResults'),play=r.playable||[],others=(r.candidates||[]).filter(x=>!['HLS','DASH','MP4'].includes(x.type));const hdr=Object.entries(r.recommendedHeaders||{}).map(([k,v])=>`<div><strong>${esc(k)}:</strong> <span class="resolver-code">${esc(v)}</span></div>`).join('');out.innerHTML=`<div class="resolver-box"><h4>Resultado</h4><div class="muted small">Página final</div><div class="resolver-code">${esc(r.pageUrl||'')}</div><div class="muted tiny">${(r.pagesChecked||[]).length} ${r.dynamic?'frames/recursos observados dinámicamente':'páginas/recursos inspeccionados, hasta 4 niveles' }.</div></div>`+`<div class="resolver-box"><h4>Fuentes reproducibles (${play.length})</h4>${play.length?play.map((x,i)=>`<div class="resolver-item resolver-playable"><div class="resolver-grow"><span class="resolver-type">${esc(x.type)}</span><span class="resolver-code">${esc(x.url)}</span><div class="muted tiny">Detectado desde: ${esc(x.sourcePage||r.pageUrl||'')}</div>${resolverLooksTemporary(x.url)?'<div class="badge blocked">⚠ POSIBLE URL TEMPORAL / FIRMADA</div>':''}<div class="muted tiny">Headers: ${esc(Object.keys(x.headers||r.recommendedHeaders||{}).join(', ')||'ninguno')}</div></div><div class="resolver-actions"><button class="ghost mini" data-resolver-probe="${i}">PROBAR</button><button class="primary mini" data-resolver-tv1="${i}">+ TV1</button><button class="primary mini" data-resolver-tv2="${i}">+ TV2</button></div><div class="resolver-probe-result" id="resolverProbe${i}"></div></div>`).join(''):'<div class="muted">No se detectó una fuente directa todavía.</div>'}</div>`+`<div class="resolver-box"><h4>Headers sugeridos para prueba</h4><div class="resolver-headers">${hdr}</div></div>`+`<div class="resolver-box"><h4>Recursos/iframes/scripts encontrados (${others.length})</h4>${others.slice(0,35).map(x=>`<div class="resolver-item"><span class="resolver-type">${esc(x.type)}</span><span class="resolver-code">${esc(x.url)}</span></div>`).join('')||'<div class="muted">Ninguno.</div>'}</div>`;$$('[data-resolver-probe]').forEach(b=>b.onclick=async()=>{const i=Number(b.dataset.resolverProbe),x=play[i],dst=$(`#resolverProbe${i}`);b.disabled=true;b.textContent='PROBANDO...';try{const pr=await api('/api/admin/stream-resolver/probe',{method:'POST',body:{url:x.url,headers:x.headers||r.recommendedHeaders||{}}});dst.innerHTML=pr.ok?`<span class="badge active">REPRODUCIBLE · ${esc(pr.type)} · HTTP ${pr.status}</span>`:`<span class="badge blocked">NO CONFIRMADO · HTTP ${pr.status} · ${esc(pr.type)}</span>`}catch(e){dst.innerHTML=`<span class="badge blocked">${esc(e.message)}</span>`}finally{b.disabled=false;b.textContent='PROBAR'}});$$('[data-resolver-tv1]').forEach(b=>b.onclick=()=>publishResolvedStream(play[Number(b.dataset.resolverTv1)],r,'tv1').catch(e=>alert(e.message)));$$('[data-resolver-tv2]').forEach(b=>b.onclick=()=>publishResolvedStream(play[Number(b.dataset.resolverTv2)],r,'tv2').catch(e=>alert(e.message)))}
$('#resolverBtn')?.addEventListener('click',async()=>{const url=$('#resolverUrl').value.trim(),btn=$('#resolverBtn'),out=$('#resolverResults');if(!url){msg($('#resolverMsg'),'Ingresá una URL para analizar.');return}btn.disabled=true;btn.textContent='ANALIZANDO HASTA 4 NIVELES...';out.innerHTML='';msg($('#resolverMsg'),'');try{const r=await api('/api/admin/stream-resolver',{method:'POST',body:{url}});state.lastResolver=r;const play=r.playable||[];msg($('#resolverMsg'),play.length?`Encontré ${play.length} fuente(s) HLS/DASH/MP4. Podés probarlas y enviarlas a TV1 o TV2.`:`No apareció una fuente directa. Se siguieron iframes y scripts públicos hasta 4 niveles.`,play.length>0);renderResolverResult(r)}catch(e){msg($('#resolverMsg'),e.message)}finally{btn.disabled=false;btn.textContent='ANALIZAR PÁGINA'}});
$('#resolverDynamicBtn')?.addEventListener('click',async()=>{const url=$('#resolverUrl').value.trim(),btn=$('#resolverDynamicBtn'),out=$('#resolverResults');if(!url){msg($('#resolverMsg'),'Ingresá una URL para analizar.');return}if(!confirm('El análisis dinámico abrirá temporalmente la página en un navegador del servidor durante unos segundos. ¿Continuar?'))return;btn.disabled=true;$('#resolverBtn').disabled=true;btn.textContent='ABRIENDO REPRODUCTOR...';out.innerHTML='';msg($('#resolverMsg'),'Ejecutando página y observando solicitudes públicas del reproductor. Puede tardar 10–25 segundos...');try{const r=await api('/api/admin/stream-resolver/dynamic',{method:'POST',body:{url}});state.lastResolver=r;const play=r.playable||[];msg($('#resolverMsg'),play.length?`Análisis dinámico: encontré ${play.length} fuente(s) reproducible(s). Ya podés probarlas o enviarlas a TV1/TV2.`:`El navegador cargó la página, pero no confirmó una fuente HLS/DASH/MP4 pública.`,play.length>0);renderResolverResult(r)}catch(e){msg($('#resolverMsg'),e.message)}finally{btn.disabled=false;$('#resolverBtn').disabled=false;btn.textContent='ANÁLISIS DINÁMICO'}});
loadResolverPublished();
