const statuses = ["pending", "paid", "shipped"]

async function loadAllOrders() {
  const container = document.getElementById("orders")
  container.textContent = "loading..."

  try {
    const res = await fetch("/api/orders")

    if (res.status === 401) {
      window.location.href = "login.html"
      return
    }
    if (res.status === 403) {
      container.textContent = "Admins only."
      return
    }
    if (!res.ok) throw new Error("Request failed")

    const orders = await res.json()

    if (orders.length === 0) {
      container.textContent = "No orders yet."
      return
    }

    container.innerHTML = orders.map(order => `
      <div class="order">
        <div class="order-head">
          <strong>${order.user ? `${escapeHtml(order.user.name)} (${escapeHtml(order.user.email)})` : "Deleted user"}</strong>
          <span>${new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <ul>
          ${order.items.map(item => `
            <li>${escapeHtml(item.name)} × ${item.qty} — ${formatPeso(item.price * item.qty)}</li>
          `).join("")}
        </ul>
        <p>Total: ${formatPeso(order.total)}</p>
        <label>
          Status
          <select data-id="${escapeHtml(order._id)}">
            ${statuses.map(s => `<option value="${s}" ${s === order.status ? "selected" : ""}>${s}</option>`).join("")}
          </select>
        </label>
        <span class="saved"></span>
      </div>
    `).join("")

    container.querySelectorAll("select").forEach(select => {
      select.addEventListener("change", () => saveStatus(select))
    })
  } catch (error) {
    container.textContent = "Couldn't load orders"
  }
}

async function saveStatus(select) {
  const note = select.closest(".order").querySelector(".saved")
  note.textContent = "saving..."

  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(select.dataset.id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: select.value })
    })
    const data = await res.json()

    note.textContent = res.ok ? "saved" : data.error
  } catch (error) {
    note.textContent = "Something went wrong. Try again."
  }
}

loadAllOrders()
