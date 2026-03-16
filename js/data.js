// ===== SHARED DATA MODEL (Phase 3 - Refined) =====

const DEFAULT_DATA = {
  name: 'Our Menu',
  tagline: 'Freshly Prepared · Pure Veg',
  packing: 'Packing Charge Extra ₹10/- Per Dish',
  theme: 'theme-classic',
  pwd: 'admin123',
  whatsappNumber: '916238093007',
  categories: [
    {id:'thali',   name:'Thali'},
    {id:'paratha', name:'Paratha'},
    {id:'khichadi',name:'Khichadi'},
    {id:'rice',    name:'Rice'},
    {id:'other',   name:'Other'}
  ],
  items: [
    {id:1, name:'Gujarati Fix Thali', guj:'ગુજરાતી ફિક્સ થાળી', desc:'1 Sabji · 1 Kathol · Dal Rice · 5 Roti · Butter Milk · Papad · Salad · Achar', price:100, cat:'thali', type:'thali', isVeg: true, available: true, offer: '', popular: true, mostOrdered: false},
    {id:2, name:'Rajsthani Fix Thali', guj:'રાજસ્થાની ફિક્સ થાળી', desc:'1 Aloo Matter · 1 Kathol · Dal Rice · 5 Roti · Papad · Butter Milk · Salad · Achar', price:100, cat:'thali', type:'thali', isVeg: true, available: true, offer: '10% OFF', popular: false, mostOrdered: true},
    {id:3, name:'Punjabi Fix Thali', guj:'પંજાબી ફિક્સ થાળી', desc:'1 Veg Sabji · 1 Paneer Sabji · Jeera Rice · Dal Fry · 5 Roti · 2 Lachha Paratha · Butter Milk · Papad · Salad · Achar', price:110, cat:'thali', type:'thali', isVeg: true, available: true, offer: '', popular: true, mostOrdered: true},
    {id:4, name:'Kathiyawadi Fix Thali', guj:'કાઠિયાવાડી ફિક્સ થાળી', desc:'Lasaniya Aloo · Sev Tomato · 2 Bhakhari · 5 Roti · Dal Rice · Papad · Butter Milk · Salad · Achar', price:110, cat:'thali', type:'thali', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:12,name:'Cheese Paratha', guj:'ચીઝ પરાઠા', desc:'1 Paratha · Dahi · Salad · Achar', price:100, cat:'paratha', type:'card', isVeg: true, available: true, offer: 'Flat ₹20 OFF', popular: true, mostOrdered: true},
    {id:16,name:'Cheese Khichadi', guj:'ચીઝ ખીચડી', desc:'Fry Cheese Khichadi · Papad · Salad', price:130, cat:'khichadi', type:'card', isVeg: true, available: true, offer: '', popular: true, mostOrdered: false},
    {id:25,name:'Cheese Biryani', guj:'ચીઝ બિરયાની', desc:'Cheese loaded Biryani', price:130, cat:'rice', type:'card', isVeg: true, available: true, offer: 'SPECIAL', popular: false, mostOrdered: true},
  ]
};

// Add remaining items back
const OTHER_ITEMS = [
    {id:5, name:'Regular Thali', guj:'રેગ્યુલર થાળી', desc:'5 Roti · 1 Sabji · 1 Kathol · Dal · Rice · Salad', price:70, cat:'thali', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:6, name:'Roti Sabji', guj:'રોટલી શાક', desc:'4 Roti · 1 Sabji · Salad', price:50, cat:'thali', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:7, name:'Chole Puri', guj:'છોલે પૂરી', desc:'5 Puri · Chole · Salad', price:80, cat:'thali', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:8, name:'Puri Sabji', guj:'પૂરી શાક', desc:'5 Puri · 1 Sabji · 1 Kathol · Salad', price:70, cat:'thali', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:9, name:'Dal Baati', guj:'દાળ બાટી', desc:'3 Baati · Dal · Lasan · Chatni · Salad', price:90, cat:'thali', type:'thali', isVeg: true, available: true, offer: '', popular: false, mostOrdered: true},
    {id:10,name:'Veg Paratha', guj:'વેજ પરાઠા', desc:'1 Paratha · Dahi · Salad · Achar', price:70, cat:'paratha', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:11,name:'Chole Paratha', guj:'છોલે પરાઠા', desc:'3 Paratha · Chole · Salad', price:80, cat:'paratha', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:13,name:'Paneer Paratha', guj:'પનીર પરાઠા', desc:'1 Paratha · Dahi · Salad · Achar', price:80, cat:'paratha', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:14,name:'Aloo Paratha', guj:'આળુ પરાઠા', desc:'1 Aloo Paratha · Dahi · Salad · Achar', price:60, cat:'paratha', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:15,name:'Paneer Khichadi', guj:'પનીર ખીચડી', desc:'Fry Paneer Khichadi · Papad · Salad', price:100, cat:'khichadi', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:17,name:'Veg Khichadi', guj:'વેજ ખીચડી', desc:'Fry Veg Khichadi · Dal · Papad · Salad', price:100, cat:'khichadi', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:18,name:'Dal Khichadi', guj:'દાળ ખીચડી', desc:'Fry Khichadi · Papad · Salad', price:80, cat:'khichadi', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:19,name:'Dal Rice', guj:'દાળ ભાત', desc:'Dal Rice · Papad · Salad', price:50, cat:'rice', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:20,name:'Jeera Rice', guj:'જીરા રાઈસ', desc:'Flavourful Jeera Rice', price:70, cat:'rice', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:21,name:'Masala Rice', guj:'મસાલા રાઈસ', desc:'Spiced Masala Rice', price:70, cat:'rice', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:22,name:'Veg Pulav', guj:'વેજ પુલાવ', desc:'Vegetable Pulav', price:90, cat:'rice', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:23,name:'Veg Biryani', guj:'વેજ બિરયાની', desc:'Aromatic Vegetable Biryani', price:100, cat:'rice', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
    {id:24,name:'Paneer Biryani', guj:'પનીર બિરયાની', desc:'Rich Paneer Biryani', price:120, cat:'rice', type:'card', isVeg: true, available: true, offer: '', popular: false, mostOrdered: false},
];
DEFAULT_DATA.items.push(...OTHER_ITEMS);

let data = JSON.parse(JSON.stringify(DEFAULT_DATA));

function loadData() {
  try {
    const s = localStorage.getItem('menudata');
    if (s) {
      const saved = JSON.parse(s);
      data = Object.assign(JSON.parse(JSON.stringify(DEFAULT_DATA)), saved);
    }
  } catch(e) {}
}

function saveData() {
  localStorage.setItem('menudata', JSON.stringify(data));
}

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}
