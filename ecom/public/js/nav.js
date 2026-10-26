async function loadUser() {
  const userArea = document.getElementById("userArea")
  const guestLinks = `<a href="login.html">Login</a> <a href="register.html">Register</a>`

  try {
    const res = await fetch("/api/auth/me")

    if (!res.ok) {
      userArea.innerHTML = guestLinks
      return
    }

    const user = await res.json()

    userArea.innerHTML = `Hi, <span id="userName"></span> <button id="logoutBtn">Logout</button>`
    document.getElementById("userName").textContent = user.name

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.reload()
    })
  } catch (error) {
    userArea.innerHTML = guestLinks
  }
}

loadUser()