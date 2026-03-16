// ===== ADMIN PANEL LOGIC (Phase 2) =====

function doLogin() {
  const v = document.getElementById('pwd-input').value;
  if (v === data.pwd) {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadAdminPanel();
  } else {
    const err = document.getElementById('login-err');
    err.style.display = 'block';
    setTimeout(() => err.style.display = 'none', 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pwdInput = document.getElementById('pwd-input');
  if (pwdInput) pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  loadData();
});

function loadAdminPanel() {
  document.getElementById('inp-name').value    = data.name;
  document.getElementById('inp-tagline').value = data.tagline;
  document.getElementById('inp-packing').value = data.packing;
  document.getElementById('inp-whatsapp').value = data.whatsappNumber || '';

  document.querySelectorAll('.theme-opt').forEach(o => o.classList.toggle('active', o.dataset.theme === data.theme));
  document.body.className = data.theme;

  renderCatList();
  renderItemsTable();
  populateCatSelects();
  showAdminTab('info');
}

function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
  const content = document.getElementById('tab-' + tab);
  const btn = document.querySelector(`.admin-nav-btn[data-tab="${tab}"]`);
  if (content) content.classList.add('active');
  if (btn) btn.classList.add('active');
}

function pickTheme(el) {
  document.querySelectorAll('.theme-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  data.theme = el.dataset.theme;
  document.body.className = data.theme;
}

// ===== CATEGORIES =====
function renderCatList() {
  const list = document.getElementById('cat-list');
  list.innerHTML = '';
  data.categories.forEach(cat => {
    const el = document.createElement('div');
    el.className = 'cat-item';
    el.innerHTML = `
      <span class="cat-drag">⠿</span>
      <span class="cat-item-name">${cat.name}</span>
      <button class="ibtn ibtn-edit" onclick="renameCat('${cat.id}')">Rename</button>
      <button class="ibtn ibtn-del"  onclick="deleteCat('${cat.id}')">Delete</button>
    `;
    list.appendChild(el);
  });
}

function addCategory() {
  const n = document.getElementById('new-cat-name').value.trim();
  if (!n) return toast('Enter a category name');
  const id = 'cat_' + Date.now();
  data.categories.push({ id, name: n });
  document.getElementById('new-cat-name').value = '';
  renderCatList();
  populateCatSelects();
  toast('Category added ✔');
}

function deleteCat(id) {
  if (!confirm('Delete this category? Items in it will be removed too.')) return;
  data.categories = data.categories.filter(c => c.id !== id);
  data.items      = data.items.filter(i => i.cat !== id);
  renderCatList();
  renderItemsTable();
  populateCatSelects();
}

function renameCat(id) {
  const cat = data.categories.find(c => c.id === id);
  if (!cat) return;
  const n = prompt('Rename category:', cat.name);
  if (n && n.trim()) { cat.name = n.trim(); renderCatList(); populateCatSelects(); toast('Renamed ✔'); }
}

function populateCatSelects() {
  const opts = data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.getElementById('new-item-cat').innerHTML = opts;
  document.getElementById('filter-cat').innerHTML = '<option value="all">All Categories</option>' + opts;
}

// ===== ITEMS TABLE =====
let priceSort = 'none';

function renderItemsTable() {
  const filter = document.getElementById('filter-cat').value;
  let items = filter === 'all' ? data.items.slice() : data.items.filter(i => i.cat === filter);

  if (priceSort === 'asc')  items.sort((a, b) => a.price - b.price);
  if (priceSort === 'desc') items.sort((a, b) => b.price - a.price);

  document.getElementById('item-count-badge').textContent = data.items.length + ' items';

  const tbody = document.getElementById('items-tbody');
  tbody.innerHTML = items.map(item => {
    const cat = data.categories.find(c => c.id === item.cat);
    return `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="${item.isVeg ? 'tag-veg' : 'tag-nonveg'}" style="width:10px;height:10px;border:1px solid #666;display:flex;align-items:center;justify-content:center"><div style="width:6px;height:6px;border-radius:50%;background:${item.isVeg?'#4caf50':'#f44336'}"></div></div>
          <div class="item-row-name" style="${!item.available ? 'opacity:.5;text-decoration:line-through' : ''}">${item.name}</div>
        </div>
        <div class="item-row-desc">${item.desc || ''}</div>
      </td>
      <td style="font-size:.8rem;color:#888">${cat ? cat.name : '-'}</td>
      <td>
        <span class="item-price">₹${item.price}</span>
        ${item.offer ? `<div style="font-size:10px;color:#e91e63;font-weight:800;margin-top:2px">🔥 ${item.offer}</div>` : ''}
      </td>
      <td>
        <div class="item-actions">
          <div style="display:flex;gap:4px;margin-bottom:4px">
            ${item.popular ? '<span style="background:#FFD700;color:#000;font-size:9px;padding:1px 4px;border-radius:3px;font-weight:800">POP</span>' : ''}
            ${item.mostOrdered ? '<span style="background:#2196F3;color:#fff;font-size:9px;padding:1px 4px;border-radius:3px;font-weight:800">MOST</span>' : ''}
          </div>
          <button class="ibtn ${item.available?'ibtn-edit':'ibtn-ghost'}" onclick="toggleAvailability(${item.id})">${item.available?'In Stock':'Sold Out'}</button>
          <button class="ibtn ibtn-edit" onclick="openEditModal(${item.id})">Edit</button>
          <button class="ibtn ibtn-del"  onclick="deleteItem(${item.id})">Del</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function toggleAvailability(id) {
  const item = data.items.find(i => i.id === id);
  if (item) {
    item.available = !item.available;
    renderItemsTable();
    toast(item.name + ' is now ' + (item.available ? 'Available' : 'Sold Out'));
  }
}

function togglePriceSort() {
  priceSort = priceSort === 'asc' ? 'desc' : 'asc';
  document.getElementById('price-sort-arrow').textContent = priceSort === 'asc' ? '⬆' : '⬇';
  renderItemsTable();
}

function addItem() {
  const name  = document.getElementById('new-item-name').value.trim();
  const guj   = document.getElementById('new-item-guj').value.trim();
  const desc  = document.getElementById('new-item-desc').value.trim();
  const price = parseInt(document.getElementById('new-item-price').value);
  const cat   = document.getElementById('new-item-cat').value;
  const type  = document.getElementById('new-item-type').value;
  const isVeg = document.getElementById('new-item-veg').checked;
  const offer = document.getElementById('new-item-offer').value.trim();
  const pop   = document.getElementById('new-item-pop').checked;
  const most  = document.getElementById('new-item-most').checked;

  if (!name || isNaN(price) || !cat) return toast('Fill in name, price & category');

  data.items.push({ id: Date.now(), name, guj, desc, price, cat, type, isVeg, available: true, offer, popular: pop, mostOrdered: most });

  ['new-item-name','new-item-guj','new-item-desc','new-item-price','new-item-offer'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('new-item-veg').checked = true;
  document.getElementById('new-item-pop').checked = false;
  document.getElementById('new-item-most').checked = false;

  renderItemsTable();
  toast('Item added ✔');
}

function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  data.items = data.items.filter(i => i.id !== id);
  renderItemsTable();
}

// ===== EDIT MODAL =====
let editingId = null;

function openEditModal(id) {
  const item = data.items.find(i => i.id === id);
  if (!item) return;
  editingId = id;

  document.getElementById('edit-item-name').value  = item.name;
  document.getElementById('edit-item-guj').value   = item.guj || '';
  document.getElementById('edit-item-desc').value  = item.desc || '';
  document.getElementById('edit-item-price').value = item.price;
  document.getElementById('edit-item-veg').checked = item.isVeg;
  document.getElementById('edit-item-avail').checked = item.available;
  document.getElementById('edit-item-offer').value = item.offer || '';
  document.getElementById('edit-item-pop').checked = item.popular || false;
  document.getElementById('edit-item-most').checked = item.mostOrdered || false;

  const catOpts = data.categories.map(c => `<option value="${c.id}" ${c.id === item.cat ? 'selected' : ''}>${c.name}</option>`).join('');
  document.getElementById('edit-item-cat').innerHTML = catOpts;
  document.getElementById('edit-item-type').value = item.type;

  document.getElementById('edit-modal').classList.add('open');
}

function closeEditModal() { document.getElementById('edit-modal').classList.remove('open'); editingId = null; }

function saveEditModal() {
  if (!editingId) return;
  const item = data.items.find(i => i.id === editingId);
  if (!item) return;

  const name  = document.getElementById('edit-item-name').value.trim();
  const price = parseInt(document.getElementById('edit-item-price').value);
  if (!name || isNaN(price)) return toast('Name and price are required');

  item.name  = name;
  item.guj   = document.getElementById('edit-item-guj').value.trim();
  item.desc  = document.getElementById('edit-item-desc').value.trim();
  item.price = price;
  item.cat   = document.getElementById('edit-item-cat').value;
  item.type  = document.getElementById('edit-item-type').value;
  item.isVeg = document.getElementById('edit-item-veg').checked;
  item.available = document.getElementById('edit-item-avail').checked;
  item.offer = document.getElementById('edit-item-offer').value.trim();
  item.popular = document.getElementById('edit-item-pop').checked;
  item.mostOrdered = document.getElementById('edit-item-most').checked;

  closeEditModal();
  renderItemsTable();
  toast('Updated ✔');
}

// ===== SAVE & PUBLISH =====
function saveAll() {
  data.name    = document.getElementById('inp-name').value.trim()    || data.name;
  data.tagline = document.getElementById('inp-tagline').value.trim() || data.tagline;
  data.packing = document.getElementById('inp-packing').value.trim();
  data.whatsappNumber = document.getElementById('inp-whatsapp').value.trim() || data.whatsappNumber;
  saveData();
  toast('Saved & Published ✔');
}

function changePwd() {
  const np = document.getElementById('new-pwd').value;
  const cp = document.getElementById('confirm-pwd').value;
  if (!np || np !== cp || np.length < 4) return toast('Invalid password or no match');
  data.pwd = np;
  saveData();
  toast('Password updated ✔');
}
