async function loadOrders() {
  const container = document.getElementById("orders")
  container.textContent = "loading..."

  try {
    const res = await fetch("/api/orders/mine")

    if (res.status === 401) {
      window.location.href = "login.html"
      return
    }
    if (!res.ok) throw new Error("Request failed")

    const orders = await res.json()

    if (orders.length === 0) {
      container.innerHTML = `<p>No orders yet. <a href="/">Shop now</a></p>`
      return
    }

    container.innerHTML = orders.map(order => `
      <div class="order">
        <div class="order-head">
          <strong>${new Date(order.createdAt).toLocaleString()}</strong>
          <span class="status status-${escapeHtml(order.status)}">${escapeHtml(order.status)}</span>
        </div>
        <ul>
          ${order.items.map(item => `
            <li>${escapeHtml(item.name)} × ${item.qty} — ${formatPeso(item.price * item.qty)}</li>
          `).join("")}
        </ul>
        <p>Total: ${formatPeso(order.total)}</p>
      </div>
    `).join("")
  } catch (error) {
    container.textContent = "Couldn't load your orders"
  }
}

loadOrders()
