// ===== MENU PAGE LOGIC (Phase 4 - Boutique) =====

let activeCatId = 'all';
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

  // Render Featured Section
  renderFeatured();

  const tabBar = document.getElementById('tab-bar');
  tabBar.innerHTML = '';
  // Only show visible categories
  const visibleCats = data.categories.filter(c => c.visible !== false);

  // Add "All" tab first
  const allBtn = document.createElement('button');
  allBtn.className = 'tab-btn' + (activeCatId === 'all' ? ' active' : '');
  allBtn.innerHTML = '🍽️ All';
  allBtn.onclick = function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activeCatId = 'all';
    renderSection();
  };
  tabBar.appendChild(allBtn);

  visibleCats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (activeCatId === cat.id ? ' active' : '');
    btn.innerHTML = `${cat.icon || ''} ${cat.name}`;
    btn.onclick = function() {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeCatId = cat.id;
      renderSection();
    };
    tabBar.appendChild(btn);
  });

  renderSection();
}

function renderFeatured() {
  const featuredItems = data.items.filter(i => i.featured && i.available);
  const container = document.getElementById('featured-container');
  if (!container) return;

  if (featuredItems.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  container.className = 'featured-section';
  container.innerHTML = `
    <div class="featured-header">
      <h2>CHEF'S SPECIALS</h2>
      <span style="font-size:12px;opacity:.5">Scroll →</span>
    </div>
    <div class="featured-scroll">
      ${featuredItems.map(item => `
        <div class="featured-item" onclick="addToCart(${item.id})">
          <div class="featured-badge">MUST TRY</div>
          <div style="font-weight:900;font-size:.95rem;margin-bottom:4px">${item.name}</div>
          <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:8px;line-height:1.3">${item.desc ? item.desc.substring(0, 45) + '...' : ''}</div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-weight:900;color:var(--primary)">₹${item.price}</span>
            <span style="background:rgba(0,0,0,.05);padding:4px 8px;border-radius:6px;font-size:10px;font-weight:800">+ ADD</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSearchFilter() {
  const container = document.getElementById('search-filter-container');
  if (!container) return;
  if (container.innerHTML) return; // Already rendered

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

  const visibleCats = data.categories.filter(c => c.visible !== false);

  // If showing all categories
  const catsToRender = activeCatId === 'all' ? visibleCats : visibleCats.filter(c => c.id === activeCatId);

  if (catsToRender.length === 0) return;

  catsToRender.forEach(cat => {
    let items = data.items.filter(i => {
      const matchesCat = i.cat === cat.id;
      const matchesSearch = i.name.toLowerCase().includes(searchQuery) || (i.guj && i.guj.includes(searchQuery));
      const matchesVeg = vegOnly ? i.isVeg : true;
      return matchesCat && matchesSearch && matchesVeg;
    });

    if (priceSort === 'asc') items.sort((a,b) => a.price - b.price);
    if (priceSort === 'desc') items.sort((a,b) => b.price - a.price);

    if (items.length === 0) return; // Skip empty categories

    const title = document.createElement('div');
    title.className = 'section-title';
    title.innerHTML = `<i>${cat.icon || '🍽️'}</i> ${cat.name}`;
    body.appendChild(title);

    const thalis = items.filter(i => i.type === 'thali');
    const cards = items.filter(i => i.type === 'card');

    thalis.forEach(item => body.appendChild(createItemEl(item, 'thali')));
    if (cards.length > 0) {
      const grid = document.createElement('div');
      grid.className = 'menu-grid';
      cards.forEach(item => grid.appendChild(createItemEl(item, 'card')));
      body.appendChild(grid);
    }
  });

  if (body.innerHTML === '') {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.style.textAlign = 'center';
    empty.style.padding = '40px 0';
    empty.innerHTML = `<div style="font-size:30px;margin-bottom:10px">🔍</div><p style="color:#888">No items found.</p>`;
    body.appendChild(empty);
    return;
  }

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

  // Spice level rendering
  let spices = '';
  if (item.spiceLevel > 0) {
    spices = '<div class="spice-wrap">';
    for(let s=1; s<=3; s++) {
      spices += `<span class="spice-icon ${s <= item.spiceLevel ? 'active' : ''}">🌶️</span>`;
    }
    spices += '</div>';
  }

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
        <div style="flex:1">
          <div class="thali-name" style="${item.offer ? 'margin-left:15px' : ''}">${item.name}</div>
          ${item.guj ? `<div class="thali-sub" style="${item.offer ? 'margin-left:15px' : ''}">${item.guj}</div>` : ''}
          ${spices}
        </div>
        <span class="price-badge">₹${item.price}</span>
      </div>
      <div class="thali-desc">${item.desc || ''}</div>
    ` : `
      <div class="card-name" style="${item.offer ? 'margin-top:10px' : ''}">${item.name}</div>
      ${item.guj ? `<div class="card-sub">${item.guj}</div>` : ''}
      <div class="card-desc">${item.desc || ''}</div>
      ${spices}
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

const originalUpdateCartUI = updateCartUI;
window.updateCartUI = function() {
  originalUpdateCartUI();
  if (activeCatId) renderSection();
};

window.toggleVegFilter = toggleVegFilter;
window.updateSearch = updateSearch;
window.updateSort = updateSort;

loadData();
window.addEventListener('DOMContentLoaded', renderMenu);
