async function loadProducts() {
  const container = document.getElementById("products")
  container.textContent = "loading..."

  try {
    const res = await fetch("/api/product")
    if (!res.ok) throw new Error("Request failed")
    const products = await res.json()

    if (products.length === 0) {
      container.textContent = "No products yet."
      return
    }

    container.innerHTML = products.map(p => `
      <div class="card">
        ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">` : ""}
        <h2>${escapeHtml(p.name)}</h2>
        <p class="price">${formatPeso(p.price)}</p>
        <a href="product.html?id=${encodeURIComponent(p._id)}">View</a>
      </div>
    `).join("")
  } catch (error) {
    container.textContent = "Couldn't load products"
  }
}

loadProducts()
