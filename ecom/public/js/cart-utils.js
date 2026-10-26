function getCart() {
  try {
    const saved = localStorage.getItem("cart")
    if (!saved) return []
    return JSON.parse(saved)
  } catch (error) {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
  if (typeof updateCartCount === "function") updateCartCount()
}

function clearCart() {
  localStorage.removeItem("cart")
  if (typeof updateCartCount === "function") updateCartCount()
}

function addToCart(product) {
  const cart = getCart()
  const existing = cart.find(item => item.productId === product._id)

  if (existing) {
    existing.qty += 1
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    })
  }

  saveCart(cart)
}

function updateQty(productId, qty) {
  if (qty < 1) {
    removeFromCart(productId)
    return
  }

  const cart = getCart()
  const item = cart.find(item => item.productId === productId)
  if (item) {
    item.qty = qty
    saveCart(cart)
  }
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.productId !== productId)
  saveCart(cart)
}

function formatPeso(amount) {
  return Number(amount).toLocaleString("en-PH", { style: "currency", currency: "PHP" })
}

// use this before putting user/product text inside innerHTML
function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// product image, or the first letter of the name if there's no image / it fails to load
function mediaHtml(src, name, extra = "") {
  const letter = escapeHtml(String(name || "?").trim().charAt(0).toUpperCase())
  const img = src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(name)}" loading="lazy" onerror="this.remove()">` : ""
  return `<div class="media" data-letter="${letter}">${extra}${img}</div>`
}

function showToast(html) {
  let toast = document.querySelector(".toast")
  if (!toast) {
    toast = document.createElement("div")
    toast.className = "toast"
    toast.setAttribute("role", "status")
    document.body.appendChild(toast)
  }

  toast.innerHTML = html
  requestAnimationFrame(() => toast.classList.add("show"))

  clearTimeout(toast.hideTimer)
  toast.hideTimer = setTimeout(() => toast.classList.remove("show"), 3000)
}
