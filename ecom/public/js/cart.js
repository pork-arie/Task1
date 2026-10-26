function formatPeso(amount) {
  return amount.toLocaleString("en-PH", { style: "currency", currency: "PHP" })
}

function renderCart() {
  const cart = getCart()
  const container = document.getElementById("cartItems")
  const totalEl = document.getElementById("cartTotal")
  const checkoutBtn = document.getElementById("checkoutBtn")

  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty. <a href="/">Shop now</a></p>`
    totalEl.textContent = ""
    checkoutBtn.style.display = "none"
    return
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-row">
      <h3>${item.name}</h3>
      <p>${formatPeso(item.price)}</p>
      <div>
        <button class="minus" data-id="${item.productId}" data-qty="${item.qty}">−</button>
        <span>${item.qty}</span>
        <button class="plus" data-id="${item.productId}" data-qty="${item.qty}">+</button>
      </div>
      <p>Subtotal: ${formatPeso(item.price * item.qty)}</p>
      <button class="remove" data-id="${item.productId}">Remove</button>
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

renderCart()