async function loadOrders() {
  const container = document.getElementById("orders")
  container.innerHTML = `<p class="muted">Loading your orders...</p>`

  try {
    const res = await fetch("/api/orders/mine")

    if (res.status === 401) {
      window.location.href = "login.html"
      return
    }
    if (!res.ok) throw new Error("Request failed")

    const orders = await res.json()

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h2>No orders yet</h2>
          <p>When you check out, your orders will show up here.</p>
          <a href="/" class="btn">Start shopping</a>
        </div>`
      return
    }

    container.innerHTML = orders.map(order => `
      <article class="order">
        <div class="order-head">
          <div>
            <strong>Order #${escapeHtml(order._id.slice(-6).toUpperCase())}</strong>
            <span class="muted">${new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <span class="status status-${escapeHtml(order.status)}">${escapeHtml(order.status)}</span>
        </div>
        <ul class="order-items">
          ${order.items.map(item => `
            <li>
              <span>${escapeHtml(item.name)} <span class="muted">× ${item.qty}</span></span>
              <span>${formatPeso(item.price * item.qty)}</span>
            </li>
          `).join("")}
        </ul>
        <div class="order-foot">
          <span class="muted">${order.items.length} product${order.items.length === 1 ? "" : "s"}</span>
          <span class="total">${formatPeso(order.total)}</span>
        </div>
      </article>
    `).join("")
  } catch (error) {
    container.innerHTML = `<div class="empty-state"><h2>Couldn't load your orders</h2><p>Try refreshing the page.</p></div>`
  }
}

loadOrders()
