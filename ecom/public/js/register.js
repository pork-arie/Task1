const form = document.getElementById("registerForm")
const message = document.getElementById("message")


form.addEventListener("submit", async (e) =>{
    e.preventDefault()
    const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

   
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()

    if (!res.ok) {
      message.textContent = data.error
      return
    }

    window.location.href = "login.html"
  } catch (error) {
    message.textContent = "Something went wrong. Try again."
  }
})