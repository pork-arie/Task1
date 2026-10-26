function getCart() {
  const saved = localStorage.getItem("cart")
  if (!saved) return []
  return JSON.parse(saved)
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
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