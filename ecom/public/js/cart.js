const checkoutBtn = document.getElementById("checkoutBtn")
const message = document.getElementById("message")

function renderCart() {
  const cart = getCart()
  const layout = document.getElementById("cartLayout")
  const container = document.getElementById("cartItems")

  if (cart.length === 0) {
    layout.classList.add("empty")
    container.innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="/" class="btn">Start shopping</a>
      </div>`
    return
  }

  layout.classList.remove("empty")

  container.innerHTML = cart.map(item => `
    <div class="cart-row">
      ${mediaHtml(item.image, item.name)}
      <div class="cart-info">
        <h3>${escapeHtml(item.name)}</h3>
        <p class="muted">${formatPeso(item.price)} each</p>
        <button class="link-btn remove" data-id="${escapeHtml(item.productId)}">Remove</button>
      </div>
      <div class="qty">
        <button class="minus" data-id="${escapeHtml(item.productId)}" data-qty="${item.qty}" aria-label="Decrease quantity">−</button>
        <span>${item.qty}</span>
        <button class="plus" data-id="${escapeHtml(item.productId)}" data-qty="${item.qty}" aria-label="Increase quantity">+</button>
      </div>
      <p class="line-total">${formatPeso(item.price * item.qty)}</p>
    </div>
  `).join("")

  const count = cart.reduce((sum, item) => sum + item.qty, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  document.getElementById("itemCount").textContent = `${count} item${count === 1 ? "" : "s"}`
  document.getElementById("subtotal").textContent = formatPeso(total)
  document.getElementById("cartTotal").textContent = formatPeso(total)

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
  checkoutBtn.textContent = "Placing order..."

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
    checkoutBtn.textContent = "Checkout"
  }
})

renderCart()
