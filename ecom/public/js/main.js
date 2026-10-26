

async function loadProducts() {
  
   const container = document.getElementById("products")
    container.textContent = "loading..."
    const res = await fetch("/api/product")
    const products = await  res.json()
    if (!res.ok) throw new Error("Request failed")

   try {
    

    container.innerHTML =""
    
    products.forEach(p => {
        container.innerHTML += `<div> 
        <h1>${p.name}</h1> 
       
        <p>${p.price}</p>
        <img src="${p.image}" alt="${p.name}">
        <a href = "product.html?id=${p._id}">view</a>
        </div>`
    });
    

   } catch (error) {
    container.textContent = "Couldn't load products"
   
   }

}

loadProducts()