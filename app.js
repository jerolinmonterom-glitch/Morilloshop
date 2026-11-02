let allProducts = [];
let cart = JSON.parse(localStorage.getItem('morilloshop_cart')) || [];
const API_URL = 'https://fakestoreapi.com/products';

// Diccionario de categorías traducidas al español
const categoryTranslations = {
  "electronics": "Electrónica",
  "jewelery": "Joyería",
  "men's clothing": "Ropa de Hombre",
  "women's clothing": "Ropa de Mujer"
};

// Traducciones de productos al español
const productTranslations = {
  1: {
    title: "Mochila Fjallraven - Foldsack No. 1 para Laptop",
    description: "Tu mochila perfecta para el día a día y paseos escolares. Guarda portátiles de hasta 15 pulgadas en su compartimento acolchado."
  },
  2: {
    title: "Camisa Casual Slim Fit de Manga Larga",
    description: "Estilo ajustado, cuello de solapa, tejido de algodón de alta calidad y excelente comodidad para cualquier ocasión."
  },
  3: {
    title: "Chaqueta de Algodón con Capucha para Hombre",
    description: "Gran chaqueta de abrigo para primavera, otoño o invierno. Ideal para actividades al aire libre y uso diario."
  },
  4: {
    title: "Camiseta Casual Slim Fit para Hombre",
    description: "Diseño ligero y transpirable, corte moderno y ajuste perfecto para combinar con jeans o chaquetas."
  },
  5: {
    title: "Pulsera de Cadena de Dragón de Oro y Plata con Micro Pave",
    description: "Joyas de alta calidad con acabados metálicos brillantes y diseño clásico en relieve."
  },
  6: {
    title: "Anillo Solitario de Oro Blanco Platinado",
    description: "Clásico anillo de compromiso o regalo especial. Brillante circonita cúbica con ajuste seguro."
  },
  7: {
    title: "Anillo Princesa Chapado en Oro Rosa",
    description: "Diseño elegante con detalles finos y acabado brillante resistente al desgaste diario."
  },
  8: {
    title: "Pendientes de Acero Inoxidable con Circonita",
    description: "Aretes elegantes y ligeros, perfectos para resaltar tu estilo diario con máxima comodidad."
  },
  9: {
    title: "Disco Duro Externo Portátil WD Elements de 1TB",
    description: "Almacenamiento portátil rápido y seguro, compatible con USB 3.0 y USB 2.0 para respaldar tus archivos."
  },
  10: {
    title: "Disco SSD SanDisk Plus interno de 1TB - Sata III",
    description: "Aumenta la velocidad de arranque y respuesta de tu sistema con almacenamiento de estado sólido confiable."
  },
  11: {
    title: "Disco Duro Interno Silicon Power de 256GB",
    description: "Tecnología 3D NAND flash para un rendimiento superior y transferencia veloz de datos."
  },
  12: {
    title: "Acer SB220Q bi - Monitor IPS ultra delgado de 21.5 pulgadas",
    description: "Resolución Full HD (1920 x 1080) con tecnología Radeon FreeSync y diseño sin marcos."
  },
  13: {
    title: "Monitor para Juegos Samsung CHG90 de 49 pulgadas Ultrawide",
    description: "Pantalla curva gigante con tecnología QLED y alta tasa de refresco para una experiencia inmersiva total."
  },
  14: {
    title: "Chaqueta Impermeable Casual para Mujer con Capucha",
    description: "Impermeable, ligera y resistente al viento. Perfecta para caminatas y días lluviosos."
  },
  15: {
    title: "Chaqueta de Cuero Sintético con Cremallera para Mujer",
    description: "Diseño moderno tipo biker con detalles metálicos, forro suave y estilo audaz."
  },
  16: {
    title: "Abrigo de Mezclilla con Capucha Desmontable para Mujer",
    description: "Estilo clásico de mezclilla con capucha de felpa ajustable para mayor comodidad en climas frescos."
  },
  17: {
    title: "Camiseta de Algodón con Cuello en V para Mujer",
    description: "Suave, elástica y cómoda. Una prenda básica indispensable en cualquier guardarropa."
  },
  18: {
    title: "Camiseta Casual de Manga Corta con Estampado para Mujer",
    description: "Diseño fresco, corte relajado y tela transpirable para uso diario o deportivo."
  },
  19: {
    title: "Camiseta Deportiva de Manga Corta para Mujer",
    description: "Tejido de secado rápido que absorbe la humedad, ideal para entrenamientos y fitness."
  },
  20: {
    title: "Camiseta de Verano con Cuello Redondo para Mujer",
    description: "Estilo ligero, cómodo y versátil para combinar con faldas, shorts o pantalones."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  updateCartBadge();
});

async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    const rawProducts = await res.json();
    
    allProducts = rawProducts.map(product => {
      const translation = productTranslations[product.id] || {};
      return {
        ...product,
        title: translation.title || product.title,
        description: translation.description || product.description,
        category: categoryTranslations[product.category] || product.category,
        originalCategory: product.category
      };
    });

    document.getElementById('loading').classList.add('d-none');
    renderProducts(allProducts);
  } catch (error) {
    document.getElementById('loading').innerHTML = `
      <p class="text-danger font-monospace">Error al cargar productos de la API.</p>
    `;
  }
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 product-card">
        <div class="product-img-container">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="card-body d-flex flex-column p-4">
          <span class="badge bg-cyber-dark text-cyber-cyan font-monospace border border-secondary mb-2 align-self-start">
            ${product.category}
          </span>
          <h6 class="card-title text-light fw-semibold text-truncate mb-2" title="${product.title}">${product.title}</h6>
          <div class="mt-auto d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
            <span class="fs-5 fw-bold text-cyber-cyan font-monospace">$${product.price.toFixed(2)}</span>
            <button class="btn btn-cyber-cyan btn-sm" onclick="openModal(${product.id})">
              <i class="fa-solid fa-eye me-1"></i> Ver más
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

function filterCategory(cat, event) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.replace('btn-cyber-cyan', 'btn-outline-cyan'));
  event.target.classList.replace('btn-outline-cyan', 'btn-cyber-cyan');

  if (cat === 'all') {
    renderProducts(allProducts);
  } else {
    renderProducts(allProducts.filter(p => p.originalCategory === cat));
  }
}

function openModal(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  document.getElementById('modalTitle').innerText = product.title;
  document.getElementById('modalBody').innerHTML = `
    <div class="row g-4 align-items-center">
      <div class="col-md-5 text-center bg-white p-4 rounded-3">
        <img src="${product.image}" class="img-fluid" style="max-height: 250px; object-fit: contain;">
      </div>
      <div class="col-md-7">
        <span class="badge bg-secondary mb-2 text-uppercase font-monospace">${product.category}</span>
        <h4 class="text-light mb-3 font-monospace">$${product.price.toFixed(2)}</h4>
        <p class="text-secondary small mb-4">${product.description}</p>
        <div class="d-flex align-items-center gap-3">
          <label class="text-light font-monospace">Cantidad:</label>
          <input type="number" id="modalQty" class="form-control bg-cyber-darker text-light border-secondary" value="1" min="1" style="width: 80px;">
          <button class="btn btn-cyber-magenta flex-grow-1" onclick="addToCartFromModal(${product.id})">
            <i class="fa-solid fa-cart-plus me-1"></i> Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  `;

  new bootstrap.Modal(document.getElementById('productModal')).show();
}

function addToCartFromModal(id) {
  const qty = parseInt(document.getElementById('modalQty').value) || 1;
  const product = allProducts.find(p => p.id === id);
  
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  saveCart();
  bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
}

function saveCart() {
  localStorage.setItem('morilloshop_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartItems();
}

function updateCartBadge() {
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  document.getElementById('cartCount').innerText = count;
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center text-secondary py-4 font-monospace">El carrito está vacío 🛍️</p>`;
    totalEl.innerText = '$0.00';
    document.getElementById('btnCheckout').disabled = true;
    return;
  }

  document.getElementById('btnCheckout').disabled = false;
  let total = 0;
  let html = `
    <table class="table table-dark table-borderless align-middle font-monospace mb-0">
      <thead>
        <tr class="text-secondary border-bottom border-secondary">
          <th>Producto</th>
          <th>Precio</th>
          <th class="text-center">Cant.</th>
          <th class="text-end">Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    html += `
      <tr class="border-bottom border-secondary">
        <td><span class="text-truncate d-inline-block" style="max-width: 180px;">${item.title}</span></td>
        <td>$${item.price.toFixed(2)}</td>
        <td class="text-center">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary text-light" onclick="updateQty(${item.id}, -1)">-</button>
            <span class="btn btn-dark text-cyan px-3" disabled>${item.qty}</span>
            <button class="btn btn-outline-secondary text-light" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </td>
        <td class="text-end text-cyber-cyan">$${subtotal.toFixed(2)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
  totalEl.innerText = `$${total.toFixed(2)}`;
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
    }
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

document.getElementById('cartModal').addEventListener('show.bs.modal', renderCartItems);

function showCheckout() {
  bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
  new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

function processPayment(e) {
  e.preventDefault();
  const clientName = document.getElementById('clientName').value || 'Cliente General';

  generatePDFTicket(clientName);

  cart = [];
  saveCart();

  bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
  alert('¡Pago procesado con éxito! Se ha descargado tu recibo de compra.');
}

function generatePDFTicket(clientName) {
  const { jsPDF } = window.jspdf;
  
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 160]
  });

  doc.setFont("courier", "normal");
  doc.setFontSize(9);

  let y = 10;
  doc.text("================================", 40, y, { align: "center" }); y += 4;
  doc.text("MORILLOSHOP", 40, y, { align: "center" }); y += 4;
  doc.text("Comercio Virtual Cyberpunk", 40, y, { align: "center" }); y += 4;
  doc.text("RNC: 101-009876-1", 40, y, { align: "center" }); y += 4;
  doc.text("================================", 40, y, { align: "center" }); y += 6;

  const date = new Date().toLocaleString();
  doc.text(`Fecha: ${date}`, 5, y); y += 4;
  doc.text(`Cliente: ${clientName.substring(0, 22)}`, 5, y); y += 4;
  doc.text(`Vendedora: Jerolin Montero`, 5, y); y += 5;
  doc.text("--------------------------------", 40, y, { align: "center" }); y += 4;

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    const lineItem = `${item.qty}x ${item.title.substring(0, 14)}`;
    const linePrice = `$${subtotal.toFixed(2)}`;
    doc.text(lineItem, 5, y);
    doc.text(linePrice, 75, y, { align: "right" });
    y += 4;
  });

  doc.text("--------------------------------", 40, y, { align: "center" }); y += 5;
  doc.setFontSize(10);
  doc.text(`TOTAL: $${total.toFixed(2)}`, 75, y, { align: "right" }); y += 8;

  doc.setFontSize(8);
  doc.text("¡Gracias por tu compra!", 40, y, { align: "center" }); y += 4;
  doc.text("www.morilloshop.com", 40, y, { align: "center" }); y += 4;
  doc.text("================================", 40, y, { align: "center" });

  doc.save(`Ticket_Morilloshop_${Date.now()}.pdf`);
}