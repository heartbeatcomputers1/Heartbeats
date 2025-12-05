const storageKey = 'hbData';
const cartKey = 'hbCart';

const defaultData = {
  products: [
    {
      id: 'hb-essentials',
      name: 'Heartbeat Essentials PC',
      price: 65000,
      spec: 'i5 / 16GB / 512GB SSD / 24" FHD',
      paymentLink: 'https://buy.stripe.com/test_essentials'
    },
    {
      id: 'hb-creator',
      name: 'Creator Plus',
      price: 115000,
      spec: 'Ryzen 7 / 32GB / 1TB NVMe / RTX 4060',
      paymentLink: 'https://buy.stripe.com/test_creator'
    },
    {
      id: 'hb-business',
      name: 'Business Mini',
      price: 82000,
      spec: 'i7 / 16GB / 512GB SSD / Small form factor',
      paymentLink: 'https://buy.stripe.com/test_business'
    },
    {
      id: 'hb-ultra',
      name: 'Ultra Quiet',
      price: 98000,
      spec: 'i5 / 32GB / 1TB NVMe / Silent case',
      paymentLink: 'https://buy.stripe.com/test_ultra'
    }
  ],
  spares: [
    {
      id: 'sp-battery',
      name: 'Laptop batteries',
      description: 'Brand-matched replacements with warranty.',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'sp-charger',
      name: 'Chargers & adapters',
      description: 'OEM and high-quality adapters with surge protection.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'sp-ssd',
      name: 'SSDs & RAM',
      description: 'Upgrades for speed—NVMe, SATA, and DDR4/DDR5 kits.',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'sp-screen',
      name: 'Screens & hinges',
      description: 'Display replacements, hinges, and bezel repairs.',
      image: 'https://images.unsplash.com/photo-1587202372775-98927a7fa440?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'sp-psu',
      name: 'Desktop PSUs',
      description: 'Reliable power supplies from 450W to 850W.',
      image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'sp-gpu',
      name: 'GPUs & cards',
      description: 'Entry to midrange graphics cards with install support.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    }
  ],
  blog: [
    { id: 'b1', title: 'Backup before festival trips', summary: 'Simple checklist to protect your data before you travel.', link: '#' },
    { id: 'b2', title: 'When to upgrade vs repair', summary: 'Decide if a part swap or new system fits your budget.', link: '#' },
    { id: 'b3', title: 'Keep laptops cool in summer', summary: 'Cleaning, pads, and settings that extend device life.', link: '#' }
  ],
  testimonials: [
    { id: 't1', quote: '“Diagnosed and fixed my laptop in a day. Honest pricing and clear updates.”', author: '— A. Gurung' },
    { id: 't2', quote: '“They set up our office PCs with backups and support. Smooth rollout.”', author: '— R. KC' },
    { id: 't3', quote: '“Appreciated the on-site visit in Pokhara. Preventive maintenance saved downtime.”', author: '— S. Thapa' }
  ],
  warranties: []
};

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) {
      localStorage.setItem(storageKey, JSON.stringify(defaultData));
      return { ...defaultData };
    }
    return { ...defaultData, ...saved };
  } catch {
    localStorage.setItem(storageKey, JSON.stringify(defaultData));
    return { ...defaultData };
  }
}

function saveData(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function uid() {
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

let data = loadData();

function formatNpr(amount) {
  return `NPR ${amount.toLocaleString('en-IN')}`;
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(cartKey, JSON.stringify(items));
}

function addToCart(productId) {
  const cart = loadCart();
  const item = cart.find((c) => c.id === productId);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  renderCart();
}

function removeFromCart(productId) {
  const cart = loadCart().filter((c) => c.id !== productId);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';
  data.products.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'card product-card';
    card.innerHTML = `
      <div class="pill">${p.spec}</div>
      <h3>${p.name}</h3>
      <p class="price">${formatNpr(p.price)}</p>
      <div class="product-actions">
        <button class="btn primary" data-add="${p.id}">Add to cart</button>
        <a class="btn ghost" href="${p.paymentLink}" target="_blank" rel="noopener">Buy now</a>
      </div>
    `;
    grid.appendChild(card);
  });
  if (!grid.dataset.bound) {
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add]');
      if (btn) {
        addToCart(btn.dataset.add);
      }
    });
    grid.dataset.bound = 'true';
  }
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const checkoutLink = document.getElementById('checkout-link');
  const cart = loadCart();
  container.innerHTML = '';

  if (!cart.length) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = 'NPR 0';
    checkoutLink.href = '#';
    checkoutLink.classList.add('disabled');
    checkoutLink.setAttribute('aria-disabled', 'true');
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const product = data.products.find((p) => p.id === item.id);
    if (!product) return;
    const row = document.createElement('div');
    row.className = 'card cart-row';
    const lineTotal = product.price * item.qty;
    total += lineTotal;
    row.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <div class="helper">${product.spec}</div>
      </div>
      <div>Qty: ${item.qty}</div>
      <div>${formatNpr(lineTotal)}</div>
      <button class="btn ghost" data-remove="${product.id}">Remove</button>
    `;
    container.appendChild(row);
  });

  totalEl.textContent = formatNpr(total);
  checkoutLink.href = data.products[0]?.paymentLink || '#';
  checkoutLink.classList.remove('disabled');
  checkoutLink.removeAttribute('aria-disabled');

  container.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.remove));
  });
}

function handleForm(formId, successMessage, onSubmit) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(new FormData(form));
    }
    form.reset();
    alert(successMessage);
  });
}

function setupMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu-list');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== toggle) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupWarranty() {
  const form = document.getElementById('warranty-form');
  const result = document.getElementById('warranty-result');
  if (!form || !result) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const entry = {
      id: uid(),
      serial: fd.get('serial'),
      email: fd.get('email'),
      status: 'Pending'
    };
    data.warranties.unshift(entry);
    saveData(data);
    renderWarrantyAdmin();
    result.textContent = 'Request received — we will verify and reply via email.';
  });
}

function renderSpares() {
  const grid = document.querySelector('.spares-grid');
  if (!grid) return;
  grid.innerHTML = '';
  data.spares.forEach((s) => {
    const card = document.createElement('article');
    card.className = 'card spare-card';
    card.innerHTML = `
      <img src="${s.image}" alt="${s.name}">
      <h3>${s.name}</h3>
      <p>${s.description}</p>
    `;
    grid.appendChild(card);
  });
}

function renderTestimonials() {
  const grid = document.querySelector('.testimonial-grid');
  if (!grid) return;
  grid.innerHTML = '';
  data.testimonials.forEach((t) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<p>${t.quote}</p><span class="author">${t.author}</span>`;
    grid.appendChild(card);
  });
}

function renderBlog() {
  const list = document.getElementById('blog-list');
  if (!list) return;
  list.innerHTML = '';
  data.blog.forEach((b) => {
    const card = document.createElement('article');
    card.className = 'card blog-card';
    card.innerHTML = `
      <h3>${b.title}</h3>
      <p>${b.summary}</p>
      <a href="${b.link || '#'}" target="_blank" rel="noopener">Read more</a>
    `;
    list.appendChild(card);
  });
}

function renderWarrantyAdmin() {
  const container = document.getElementById('warranty-admin-list');
  if (!container) return;
  container.innerHTML = '';
  data.warranties.forEach((w) => {
    const row = document.createElement('div');
    row.className = 'crud-row';
    row.innerHTML = `
      <div>
        <strong>${w.serial}</strong>
        <div class="label-small">${w.email} • ${w.status}</div>
      </div>
      <div class="crud-actions">
        <button class="btn ghost small" data-edit-warranty="${w.id}">Edit</button>
        <button class="btn primary small" data-delete-warranty="${w.id}">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function renderCrudList(entity, targetId, formatter) {
  const container = document.getElementById(targetId);
  if (!container) return;
  container.innerHTML = '';
  (data[entity] || []).forEach((item) => {
    const row = document.createElement('div');
    row.className = 'crud-row';
    row.innerHTML = `
      <div>${formatter(item)}</div>
      <div class="crud-actions">
        <button class="btn ghost small" data-edit="${entity}" data-id="${item.id}">Edit</button>
        <button class="btn primary small" data-delete="${entity}" data-id="${item.id}">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function bindCrudForm(formId, entity, fields) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const id = fd.get('id');
    const item = { id: id || uid() };
    fields.forEach((f) => (item[f] = fd.get(f)));
    const list = data[entity] || [];
    const existingIndex = list.findIndex((x) => x.id === item.id);
    if (existingIndex >= 0) {
      list[existingIndex] = item;
    } else {
      list.push(item);
    }
    data[entity] = list;
    saveData(data);
    form.reset();
    renderAll();
  });
  form.querySelector('[data-reset]')?.addEventListener('click', () => form.reset());
}

function handleCrudButtons() {
  document.addEventListener('click', (e) => {
    const del = e.target.closest('[data-delete]');
    const edit = e.target.closest('[data-edit]');
    const delWarranty = e.target.closest('[data-delete-warranty]');
    const editWarranty = e.target.closest('[data-edit-warranty]');

    if (del) {
      const entity = del.dataset.delete;
      const id = del.dataset.id;
      data[entity] = (data[entity] || []).filter((x) => x.id !== id);
      saveData(data);
      renderAll();
    }
    if (edit) {
      const entity = edit.dataset.edit;
      const id = edit.dataset.id;
      const item = (data[entity] || []).find((x) => x.id === id);
      if (!item) return;
      const form = document.querySelector(`form[data-entity="${entity}"]`);
      if (!form) return;
      Object.entries(item).forEach(([k, v]) => {
        const input = form.querySelector(`[name="${k}"]`);
        if (input) input.value = v;
      });
      window.location.hash = form.getAttribute('id');
    }
    if (delWarranty) {
      const id = delWarranty.dataset.deleteWarranty;
      data.warranties = data.warranties.filter((x) => x.id !== id);
      saveData(data);
      renderAll();
    }
    if (editWarranty) {
      const id = editWarranty.dataset.editWarranty;
      const item = data.warranties.find((x) => x.id === id);
      const form = document.querySelector('form[data-entity="warranties"]');
      if (item && form) {
        ['id', 'serial', 'email', 'status'].forEach((k) => {
          const input = form.querySelector(`[name="${k}"]`);
          if (input) input.value = item[k] || '';
        });
        window.location.hash = form.getAttribute('id');
      }
    }
  });
}

function renderAll() {
  renderProducts();
  renderCart();
  renderSpares();
  renderTestimonials();
  renderBlog();
  renderCrudList('products', 'product-admin-list', (p) => `<strong>${p.name}</strong><div class="label-small">${p.spec} • ${formatNpr(Number(p.price) || 0)}</div>`);
  renderCrudList('spares', 'spare-admin-list', (s) => `<strong>${s.name}</strong><div class="label-small">${s.description}</div>`);
  renderCrudList('blog', 'blog-admin-list', (b) => `<strong>${b.title}</strong><div class="label-small">${b.summary}</div>`);
  renderCrudList('testimonials', 'testimonial-admin-list', (t) => `<strong>${t.author}</strong><div class="label-small">${t.quote}</div>`);
  renderWarrantyAdmin();
}

document.addEventListener('DOMContentLoaded', () => {
  bindCrudForm('product-form', 'products', ['name', 'spec', 'price', 'paymentLink']);
  bindCrudForm('spare-form', 'spares', ['name', 'description', 'image']);
  bindCrudForm('blog-form', 'blog', ['title', 'summary', 'link']);
  bindCrudForm('testimonial-form', 'testimonials', ['quote', 'author']);
  bindCrudForm('warranty-admin-form', 'warranties', ['serial', 'email', 'status']);

  handleCrudButtons();
  renderAll();

  handleForm('service-form', 'Service request sent. We will confirm shortly.');
  handleForm('contact-form', 'Message sent. We will respond soon.');
  handleForm('newsletter-form', 'Subscribed! Watch for updates.');
  setupMenu();
  setupWarranty();

  document.getElementById('clear-cart')?.addEventListener('click', clearCart);
});

