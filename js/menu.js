// ===== MENU PAGE LOGIC (Phase 2) =====

let activeCatId = null;
let priceSort = 'none';
let searchQuery = '';
let vegOnly = false;

function renderMenu() {
  document.body.className = data.theme;
  document.getElementById('rest-name').textContent = data.name;
  document.getElementById('page-title').textContent = data.name;
  document.getElementById('rest-tagline').textContent = data.tagline;

  // Render search & filter if not present
  renderSearchFilter();

  const tabBar = document.getElementById('tab-bar');
  tabBar.innerHTML = '';
  data.categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
    btn.textContent = cat.name;
    btn.onclick = function() {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeCatId = cat.id;
      renderSection();
    };
    tabBar.appendChild(btn);
  });

  if (data.categories.length > 0) {
    activeCatId = data.categories[0].id;
    renderSection();
  }
}

function renderSearchFilter() {
  const container = document.getElementById('search-filter-container');
  if (!container) return;
  container.className = 'search-filter-wrap';
  container.innerHTML = `
    <div class="search-box">
      <input type="text" id="menu-search" placeholder="Search dishes..." oninput="updateSearch(this.value)">
    </div>
    <div class="filter-row">
      <div class="veg-toggle" id="veg-toggle-btn" onclick="toggleVegFilter()">
        <div class="veg-btn"></div>
        <span class="veg-label">Veg Only</span>
      </div>
      <div class="sort-bar">
        <select id="cust-sort-price" onchange="updateSort(this.value)">
          <option value="none">Default Sort</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  `;
}

function updateSearch(val) {
  searchQuery = val.toLowerCase().trim();
  renderSection();
}

function toggleVegFilter() {
  vegOnly = !vegOnly;
  document.getElementById('veg-toggle-btn').classList.toggle('active', vegOnly);
  renderSection();
}

function updateSort(val) {
  priceSort = val;
  renderSection();
}

function renderSection() {
  const body = document.getElementById('menu-body');
  body.innerHTML = '';

  const cat = data.categories.find(c => c.id === activeCatId);
  if (!cat) return;

  // Title (only show if not searching across categories - keeping it simple for now)
  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = cat.name;
  body.appendChild(title);

  // Filter items
  let items = data.items.filter(i => {
    const matchesCat = i.cat === activeCatId;
    const matchesSearch = i.name.toLowerCase().includes(searchQuery) || (i.guj && i.guj.includes(searchQuery));
    const matchesVeg = vegOnly ? i.isVeg : true;
    return matchesCat && matchesSearch && matchesVeg;
  });

  // Sort items
  if (priceSort === 'asc') items.sort((a,b) => a.price - b.price);
  if (priceSort === 'desc') items.sort((a,b) => b.price - a.price);

  if (items.length === 0) {
    body.innerHTML += `<div class="empty-state"><div class="empty-icon">🔍</div><p>No items found.</p></div>`;
    return;
  }

  const thalis = items.filter(i => i.type === 'thali');
  const cards = items.filter(i => i.type === 'card');

  thalis.forEach(item => body.appendChild(createItemEl(item, 'thali')));
  if (cards.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    cards.forEach(item => grid.appendChild(createItemEl(item, 'card')));
    body.appendChild(grid);
  }

  // Footer / Packing
  if (data.packing) {
    const note = document.createElement('div');
    note.className = 'packing-note';
    note.textContent = '📦 ' + data.packing;
    body.appendChild(note);
  }
}

function createItemEl(item, type) {
  const el = document.createElement('div');
  el.className = type === 'thali' ? 'thali-card' : 'menu-card';
  if (!item.available) el.classList.add('out-of-stock');

  const cartItem = cart.find(c => c.id === item.id);
  const qty = cartItem ? cartItem.qty : 0;

  const innerHTML = `
    ${!item.available ? '<div class="out-of-stock-label">Out of Stock</div>' : ''}
    
    ${item.offer ? `<div class="offer-ribbon"><span>${item.offer}</span></div>` : ''}
    
    <div class="item-badges">
      ${item.popular ? `<div class="badge-tag tag-popular">Popular</div>` : ''}
      ${item.mostOrdered ? `<div class="badge-tag tag-most-ordered">Most Ordered</div>` : ''}
    </div>

    <div class="item-tags">
      <div class="${item.isVeg ? 'tag-veg' : 'tag-nonveg'}"></div>
    </div>
    ${type === 'thali' ? `
      <div class="thali-top">
        <div>
          <div class="thali-name" style="${item.offer ? 'margin-left:15px' : ''}">${item.name}</div>
          ${item.guj ? `<div class="thali-sub" style="${item.offer ? 'margin-left:15px' : ''}">${item.guj}</div>` : ''}
        </div>
        <span class="price-badge">₹${item.price}</span>
      </div>
      <div class="thali-desc">${item.desc || ''}</div>
    ` : `
      <div class="card-name" style="${item.offer ? 'margin-top:10px' : ''}">${item.name}</div>
      ${item.guj ? `<div class="card-sub">${item.guj}</div>` : ''}
      <div class="card-desc">${item.desc || ''}</div>
      <div class="card-footer"><span class="price-badge">₹${item.price}</span></div>
    `}
    <div class="cart-controls">
      ${qty > 0 ? `
        <div class="qty-control">
          <button class="qty-btn" onclick="removeFromCart(${item.id})">-</button>
          <span class="qty-val" data-id="${item.id}">${qty}</span>
          <button class="qty-btn" onclick="addToCart(${item.id})">+</button>
        </div>
      ` : `
        <button class="add-btn" onclick="addToCart(${item.id})" ${!item.available ? 'disabled' : ''}>ADD</button>
      `}
    </div>
  `;
  el.innerHTML = innerHTML;
  return el;
}

// Override updateCartUI from cart.js to trigger re-render of item cards
// This is a bit brute-force but ensures the ADD/QTY state stays synced
const originalUpdateCartUI = updateCartUI;
window.updateCartUI = function() {
  originalUpdateCartUI();
  // Only re-render if the menu is already loaded
  if (activeCatId) renderSection();
};

window.toggleVegFilter = toggleVegFilter;
window.updateSearch = updateSearch;
window.updateSort = updateSort;

loadData();
window.addEventListener('DOMContentLoaded', renderMenu);
