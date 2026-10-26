const statuses = ["pending", "paid", "shipped"]

function emptyState(title, text) {
  return `<div class="empty-state"><h2>${title}</h2><p>${text}</p></div>`
}

async function loadAllOrders() {
  const container = document.getElementById("orders")
  container.innerHTML = `<p class="muted">Loading orders...</p>`

  try {
    const res = await fetch("/api/orders")

    if (res.status === 401) {
      window.location.href = "login.html"
      return
    }
    if (res.status === 403) {
      container.innerHTML = emptyState("Admins only", "You need an admin account to see this page.")
      return
    }
    if (!res.ok) throw new Error("Request failed")

    const orders = await res.json()

    if (orders.length === 0) {
      container.innerHTML = emptyState("No orders yet", "Orders from customers will appear here.")
      return
    }

    container.innerHTML = orders.map(order => `
      <article class="order">
        <div class="order-head">
          <div>
            <strong>${order.user ? escapeHtml(order.user.name) : "Deleted user"}</strong>
            <span class="muted">${order.user ? escapeHtml(order.user.email) : ""}</span>
          </div>
          <div>
            <strong>Order #${escapeHtml(order._id.slice(-6).toUpperCase())}</strong>
            <span class="muted">${new Date(order.createdAt).toLocaleString()}</span>
          </div>
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
          <div class="status-control">
            <span class="status status-${escapeHtml(order.status)}">${escapeHtml(order.status)}</span>
            <select data-id="${escapeHtml(order._id)}" aria-label="Order status">
              ${statuses.map(s => `<option value="${s}" ${s === order.status ? "selected" : ""}>${s}</option>`).join("")}
            </select>
            <span class="saved"></span>
          </div>
          <span class="total">${formatPeso(order.total)}</span>
        </div>
      </article>
    `).join("")

    container.querySelectorAll("select").forEach(select => {
      select.addEventListener("change", () => saveStatus(select))
    })
  } catch (error) {
    container.innerHTML = emptyState("Couldn't load orders", "Try refreshing the page.")
  }
}

async function saveStatus(select) {
  const order = select.closest(".order")
  const note = order.querySelector(".saved")
  const pill = order.querySelector(".status")
  note.textContent = "saving..."

  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(select.dataset.id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: select.value })
    })
    const data = await res.json()

    if (!res.ok) {
      note.textContent = data.error
      return
    }

    pill.className = `status status-${select.value}`
    pill.textContent = select.value
    note.textContent = "saved ✓"
  } catch (error) {
    note.textContent = "Something went wrong. Try again."
  }
}

loadAllOrders()
