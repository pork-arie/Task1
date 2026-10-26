const id = new URLSearchParams(window.location.search).get("id")

async function loadProd() {
  const container = document.getElementById("product")
  container.textContent = "loading..."

  if (!id) {
    container.textContent = "No product selected."
    return
  }

  try {
    const res = await fetch(`/api/product/${encodeURIComponent(id)}`)

    if (!res.ok) {
      container.textContent = "Product not found."
      return
    }

    const product = await res.json()
    const inStock = product.stock > 0

    container.innerHTML = `
      <div class="product-detail">
        ${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">` : ""}
        <div>
          <h1>${escapeHtml(product.name)}</h1>
          <p class="price">${formatPeso(product.price)}</p>
          <p>${escapeHtml(product.description)}</p>
          <p>${inStock ? `${product.stock} in stock` : "Out of stock"}</p>
          <button id="addBtn" ${inStock ? "" : "disabled"}>Add to cart</button>
          <p id="message"></p>
        </div>
      </div>`

    document.getElementById("addBtn").addEventListener("click", () => {
      addToCart(product)
      document.getElementById("message").innerHTML = `Added to cart. <a href="cart.html">View cart</a>`
    })
  } catch (error) {
    container.textContent = "Couldn't load product"
  }
}

loadProd()
