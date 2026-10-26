function updateCartCount() {
  const badge = document.getElementById("cartCount")
  if (!badge) return

  let count = 0
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    count = cart.reduce((sum, item) => sum + item.qty, 0)
  } catch (error) {
    count = 0
  }

  badge.textContent = count
  badge.hidden = count === 0
}

function markCurrentPage() {
  const page = window.location.pathname.split("/").pop() || "index.html"
  document.querySelectorAll(".nav a").forEach(link => {
    if (link.getAttribute("href") === page) link.setAttribute("aria-current", "page")
  })
}

async function loadUser() {
  const userArea = document.getElementById("userArea")
  const guestLinks = `
    <a href="login.html" class="nav-link">Log in</a>
    <a href="register.html" class="btn btn-sm">Sign up</a>`

  try {
    const res = await fetch("/api/auth/me")

    if (!res.ok) {
      userArea.innerHTML = guestLinks
      markCurrentPage()
      return
    }

    const user = await res.json()

    userArea.innerHTML = `
      <span class="greeting">Hi, <span id="userName"></span></span>
      <a href="orders.html" class="nav-link">My Orders</a>
      ${user.role === "admin" ? `<a href="admin-orders.html" class="nav-link">Admin</a>` : ""}
      <button id="logoutBtn" class="btn btn-ghost btn-sm">Log out</button>`
    document.getElementById("userName").textContent = user.name
    markCurrentPage()

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "index.html"
    })
  } catch (error) {
    userArea.innerHTML = guestLinks
  }
}

updateCartCount()
loadUser()
