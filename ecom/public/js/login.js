const form = document.getElementById("loginForm")
const message = document.getElementById("message")

form.addEventListener("submit", async(e) => {
   e.preventDefault()
   const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  try {
    const res = await fetch('/api/auth/login',{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})})
    const data = await res.json()
    if(!res.ok){
        message.textContent = data.error
        return
    }

    window.location.href = "index.html"
  } catch (error) {
    message.textContent = "Something went wrong. Try again."
  }
})