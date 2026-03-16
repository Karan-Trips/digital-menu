// ===== CART SYSTEM (Phase 5 - Boutique Receipt) =====

let cart = [];

function loadCart() {
  try {
    const s = sessionStorage.getItem('menucart');
    if (s) cart = JSON.parse(s);
  } catch(e) {}
  updateCartUI();
}

function saveCart() {
  sessionStorage.setItem('menucart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(itemId) {
  const item = data.items.find(i => i.id === itemId);
  if (!item || !item.available) {
    toast('Sorry, this item is out of stock!');
    return;
  }

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: itemId, qty: 1 });
  }
  saveCart();
  toast(`🛒 Added ${item.name}`);
}

function removeFromCart(itemId) {
  const idx = cart.findIndex(c => c.id === itemId);
  if (idx > -1) {
    if (cart[idx].qty > 1) {
      cart[idx].qty--;
    } else {
      cart.splice(idx, 1);
    }
  }
  saveCart();
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((sum, c) => {
    const item = data.items.find(i => i.id === c.id);
    return sum + (item ? item.price * c.qty : 0);
  }, 0);
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const btn = document.getElementById('floating-cart-btn');
  const count = getCartCount();

  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  if (btn) {
    btn.style.display = count > 0 ? 'flex' : 'none';
  }

  // Reactive quantity update on cards
  document.querySelectorAll('.qty-val').forEach(el => {
    const id = parseInt(el.dataset.id);
    const cItem = cart.find(c => c.id === id);
    el.textContent = cItem ? cItem.qty : '0';
  });

  renderCartModal();
}

function renderCartModal() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#bbb">
        <div style="font-size:45px;margin-bottom:15px;opacity:.3">🛒</div>
        <p style="font-weight:700">Your basket is empty</p>
        <p style="font-size:12px">Choose some delicious items to start!</p>
      </div>`;
    document.getElementById('cart-checkout-btn').style.display = 'none';
    return;
  }

  document.getElementById('cart-checkout-btn').style.display = 'block';
  let html = '';
  cart.forEach(c => {
    const item = data.items.find(i => i.id === c.id);
    if (!item) return;
    html += `
      <div class="cart-item-row" style="display:flex;justify-content:space-between;align-items:center;padding:15px 0;border-bottom:1.5px solid #f8f8f8">
        <div style="flex:1">
          <div style="font-weight:800;font-size:.95rem;color:#1a1a1a">${item.name}</div>
          <div style="font-size:.8rem;color:var(--primary);font-weight:800">₹${item.price} × ${c.qty} = ₹${item.price * c.qty}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;background:#f0f0f0;padding:6px 10px;border-radius:12px">
          <button onclick="removeFromCart(${item.id})" style="background:none;border:none;font-weight:900;font-size:1rem;color:#555;cursor:pointer;width:20px">−</button>
          <span style="font-weight:900;font-size:.9rem;min-width:18px;text-align:center">${c.qty}</span>
          <button onclick="addToCart(${item.id})" style="background:none;border:none;font-weight:900;font-size:1rem;color:var(--primary);cursor:pointer;width:20px">+</button>
        </div>
      </div>
    `;
  });

  const total = getCartTotal();
  html += `
    <div style="margin-top:25px;padding:20px;background:#fdf5f3;border-radius:18px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:800;font-size:1rem;color:#C84B2F">Bill Amount</span>
      <span style="font-weight:900;font-size:1.3rem;color:#C84B2F">₹${total}</span>
    </div>
  `;

  container.innerHTML = html;
}

function sendWhatsAppOrder() {
  if (cart.length === 0) return;

  const table = document.getElementById('table-no')?.value || 'Takeaway';
  const name = document.getElementById('cust-name')?.value || 'Guest';
  const orderId = 'ORD-' + Math.floor(Math.random() * 9000 + 1000);
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let text = `✨ *ORDER RECEIPT - ${data.name.toUpperCase()}* ✨\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🆔 *Order ID:* #${orderId}\n`;
  text += `📅 *Time:* ${timeStr}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `👤 *Customer:* ${name}\n`;
  text += `📍 *Table:* ${table}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  cart.forEach((c, index) => {
    const item = data.items.find(i => i.id === c.id);
    if (item) {
      text += `${index + 1}. *${item.name}* (x${c.qty})\n`;
      text += `   ↳ ₹${item.price} × ${c.qty} = *₹${item.price * c.qty}*\n`;
    }
  });

  text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *TOTAL AMOUNT:* *₹${getCartTotal()}*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  text += `🍽️ _Thank you for ordering with us!_\n`;
  text += `🔋 _Digital Menu by KarQR_`;

  const encoded = encodeURIComponent(text);
  const num = data.whatsappNumber || '916238093007';
  window.open(`https://wa.me/${num}?text=${encoded}`, '_blank');
  
  // Optional: Auto-clear cart after order
  // clearCart();
}

// Global exposure
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.closeCart = () => document.getElementById('cart-overlay').classList.remove('open');
window.openCart = () => {
  renderCartModal();
  document.getElementById('cart-overlay').classList.add('open');
};

document.addEventListener('DOMContentLoaded', loadCart);
