const id = new URLSearchParams(window.location.search).get("id")

async function loadProd() {
  const container = document.getElementById('products')
  container.textContent = "loading..."

  if (!id) {
    container.textContent("no products")
    return
  }

  try {
    const res = await fetch(`/api/product/${id}`)

    if (!res.ok) {
      container.textContent("notfound")
      return
    }

    const product = await res.json()

    container.innerHTML = `<div>
      <h1>${product.name}</h1>
      <img src=${product.image}/>
      <button>add to cart</button>
    </div>`
  } catch (error) {
    container.textContent = "Couldn't load product"
  }
}

loadProd()