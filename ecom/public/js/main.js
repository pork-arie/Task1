function skeletonCards(count) {
  return Array.from({ length: count }, () => `
    <div class="card skeleton" aria-hidden="true">
      <div class="media"></div>
      <div class="card-body">
        <div class="line"></div>
        <div class="line short"></div>
      </div>
    </div>
  `).join("")
}

function stockTag(stock) {
  if (stock <= 0) return `<span class="tag">Sold out</span>`
  if (stock <= 3) return `<span class="tag tag-low">Only ${stock} left</span>`
  return ""
}

async function loadProducts() {
  const container = document.getElementById("products")
  const countEl = document.getElementById("productCount")
  container.innerHTML = skeletonCards(8)

  try {
    const res = await fetch("/api/product")
    if (!res.ok) throw new Error("Request failed")
    const products = await res.json()

    if (products.length === 0) {
      container.outerHTML = `
        <div class="empty-state">
          <h2>No products yet</h2>
          <p>Check back soon. New items are on the way.</p>
        </div>`
      return
    }

    countEl.textContent = `${products.length} item${products.length === 1 ? "" : "s"}`

    container.innerHTML = products.map(p => `
      <a class="card ${p.stock <= 0 ? "sold-out" : ""}" href="product.html?id=${encodeURIComponent(p._id)}">
        ${mediaHtml(p.image, p.name, stockTag(p.stock))}
        <div class="card-body">
          <h3>${escapeHtml(p.name)}</h3>
          <p class="price">${formatPeso(p.price)}</p>
        </div>
      </a>
    `).join("")
  } catch (error) {
    container.outerHTML = `
      <div class="empty-state">
        <h2>Couldn't load products</h2>
        <p>Something went wrong on our side. Try refreshing the page.</p>
      </div>`
  }
}

loadProducts()
