const id = new URLSearchParams(window.location.search).get("id")

function notFound(text) {
  return `
    <div class="empty-state">
      <h2>${text}</h2>
      <p>It may have been removed or the link is wrong.</p>
      <a href="/" class="btn">Back to store</a>
    </div>`
}

function stockLabel(stock) {
  if (stock <= 0) return `<span class="stock out">Out of stock</span>`
  if (stock <= 3) return `<span class="stock low">Only ${stock} left</span>`
  return `<span class="stock">In stock</span>`
}

async function loadProd() {
  const container = document.getElementById("product")

  if (!id) {
    container.innerHTML = notFound("No product selected")
    return
  }

  try {
    const res = await fetch(`/api/product/${encodeURIComponent(id)}`)

    if (!res.ok) {
      container.innerHTML = notFound("Product not found")
      return
    }

    const product = await res.json()
    const inStock = product.stock > 0
    document.title = `${product.name} | My Store`

    container.innerHTML = `
      <div class="product-detail">
        ${mediaHtml(product.image, product.name)}
        <div class="product-info">
          <h1>${escapeHtml(product.name)}</h1>
          <p class="price">${formatPeso(product.price)}</p>
          ${stockLabel(product.stock)}
          <p class="description">${escapeHtml(product.description)}</p>
          <button id="addBtn" ${inStock ? "" : "disabled"}>${inStock ? "Add to cart" : "Sold out"}</button>
        </div>
      </div>`

    document.getElementById("addBtn").addEventListener("click", () => {
      addToCart(product)
      showToast(`Added to cart <a href="cart.html">View cart</a>`)
    })
  } catch (error) {
    container.innerHTML = notFound("Couldn't load product")
  }
}

loadProd()
