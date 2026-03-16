// ===== CART SYSTEM (Phase 2) =====

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
  if (!item || !item.available) return;

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: itemId, qty: 1 });
  }
  saveCart();
  toast(`Added ${item.name} to cart`);
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

function deleteFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  saveCart();
}

function clearCart() {
  cart = [];
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

  // Update quantity controls on item cards if they exist
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
    container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#888"><div style="font-size:30px;margin-bottom:10px">🛒</div>Your cart is empty</div>';
    document.getElementById('cart-checkout-btn').style.display = 'none';
    return;
  }

  document.getElementById('cart-checkout-btn').style.display = 'block';
  let html = '';
  cart.forEach(c => {
    const item = data.items.find(i => i.id === c.id);
    if (!item) return;
    html += `
      <div class="cart-item-row" style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #eee">
        <div style="flex:1">
          <div style="font-weight:700;font-size:.9rem">${item.name}</div>
          <div style="font-size:.8rem;color:#C84B2F;font-weight:700">₹${item.price} × ${c.qty} = ₹${item.price * c.qty}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <button onclick="removeFromCart(${item.id})" style="width:28px;height:28px;border-radius:50%;border:1px solid #ddd;background:#fff;cursor:pointer">-</button>
          <span style="font-weight:700;font-size:.9rem">${c.qty}</span>
          <button onclick="addToCart(${item.id})" style="width:28px;height:28px;border-radius:50%;border:1px solid #ddd;background:#fff;cursor:pointer">+</button>
        </div>
      </div>
    `;
  });

  const total = getCartTotal();
  html += `
    <div style="margin-top:20px;padding-top:10px;border-top:2px solid #eee;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:800;font-size:1.1rem">Total Amount</span>
      <span style="font-weight:900;font-size:1.2rem;color:#C84B2F">₹${total}</span>
    </div>
  `;

  container.innerHTML = html;
}

function sendWhatsAppOrder() {
  if (cart.length === 0) return;

  const table = document.getElementById('table-no')?.value || 'Not specified';
  const name = document.getElementById('cust-name')?.value || 'Guest';

  let text = `*New Order - ${data.name}*\n`;
  text += `--------------------------\n`;
  text += `👤 *Customer:* ${name}\n`;
  text += `📍 *Table/Note:* ${table}\n`;
  text += `--------------------------\n`;

  cart.forEach(c => {
    const item = data.items.find(i => i.id === c.id);
    if (item) {
      text += `• ${c.qty}x ${item.name} - ₹${item.price * c.qty}\n`;
    }
  });

  text += `--------------------------\n`;
  text += `💰 *Total: ₹${getCartTotal()}*\n`;
  text += `--------------------------\n`;
  text += `_Sent via KarQR Digital Menu_`;

  const encoded = encodeURIComponent(text);
  const num = data.whatsappNumber || '916238093007';
  window.open(`https://wa.me/${num}?text=${encoded}`, '_blank');
}

// Global exposure for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.clearCart = clearCart;
window.closeCart = () => document.getElementById('cart-overlay').classList.remove('open');
window.openCart = () => {
  renderCartModal();
  document.getElementById('cart-overlay').classList.add('open');
};

document.addEventListener('DOMContentLoaded', loadCart);
