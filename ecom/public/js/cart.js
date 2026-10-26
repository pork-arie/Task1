const checkoutBtn = document.getElementById("checkoutBtn")
const message = document.getElementById("message")

function renderCart() {
  const cart = getCart()
  const container = document.getElementById("cartItems")
  const totalEl = document.getElementById("cartTotal")

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty. <a href="/">Shop now</a></p>`
    totalEl.textContent = ""
    checkoutBtn.style.display = "none"
    return
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-row">
      <h3>${escapeHtml(item.name)}</h3>
      <p>${formatPeso(item.price)}</p>
      <div class="qty">
        <button class="minus" data-id="${escapeHtml(item.productId)}" data-qty="${item.qty}">−</button>
        <span>${item.qty}</span>
        <button class="plus" data-id="${escapeHtml(item.productId)}" data-qty="${item.qty}">+</button>
      </div>
      <p>Subtotal: ${formatPeso(item.price * item.qty)}</p>
      <button class="remove" data-id="${escapeHtml(item.productId)}">Remove</button>
    </div>
  `).join("")

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  totalEl.textContent = `Total: ${formatPeso(total)}`
  checkoutBtn.style.display = "block"

  container.querySelectorAll(".plus").forEach(btn => {
    btn.addEventListener("click", () => {
      updateQty(btn.dataset.id, Number(btn.dataset.qty) + 1)
      renderCart()
    })
  })

  container.querySelectorAll(".minus").forEach(btn => {
    btn.addEventListener("click", () => {
      updateQty(btn.dataset.id, Number(btn.dataset.qty) - 1)
      renderCart()
    })
  })

  container.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.id)
      renderCart()
    })
  })
}

checkoutBtn.addEventListener("click", async () => {
  const items = getCart().map(item => ({ productId: item.productId, qty: item.qty }))
  message.textContent = ""
  checkoutBtn.disabled = true

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    })

    if (res.status === 401) {
      window.location.href = "login.html"
      return
    }

    const data = await res.json()
    if (!res.ok) {
      message.textContent = data.error
      return
    }

    clearCart()
    window.location.href = "orders.html"
  } catch (error) {
    message.textContent = "Something went wrong. Try again."
  } finally {
    checkoutBtn.disabled = false
  }
})

renderCart()
