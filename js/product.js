let products = [];
let shoppingCart;

async function getData() {
  const response = await fetch("https://fakestoreapi.com/products");
  products = await response.json();
  console.log(products);
  await loadProducts();
  loadShoppingCart();
}

let itemsPerPage = 8;
let currentPage = 1;

function loadShoppingCart() {
  const cartLocalStorage = localStorage.getItem("selectedProducts");
  if (cartLocalStorage) {
    shoppingCart = new Map(JSON.parse(cartLocalStorage));
  } else {
    shoppingCart = new Map();
  }
}


function addToCart(productId){
    const currentNrProducts = shoppingCart.get(productId);
    if(currentNrProducts) {
        //product id exists in shopping cart then increment
        shoppingCart.set(productId, (currentNrProducts+1))
    } else {
        //Set first time adding product to cart as 1
        shoppingCart.set(productId, 1);
    }
}

const fixedExchangeRateUSDtoSEK = 10.5; 

function convertToSEK(usd) {
    return (usd * fixedExchangeRateUSDtoSEK).toFixed(0); 
}

async function loadProducts() {
  console.log(products);

  const grid = document.getElementById("product-grid");

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const itemsToShow = products.slice(start, end);


  itemsToShow.forEach((product) => {
    const sek = convertToSEK(product.price); 

    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <h3>${product.title}</h3>
            <p>${sek} kr </p>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
        `;
    grid.appendChild(productDiv);
  });

  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productID = event.target.dataset.id;
      localStorage.setItem("selectedProduct", productID);
      // add product to cart list
      addToCart(productID);
      // update cart in memory, need to store it as string
      localStorage.setItem(
        "selectedProducts",
        JSON.stringify(Array.from(shoppingCart))
      );
      // Don't move to checkout yet
      // window.location.href = "checkout.html";
    });
  });

  currentPage++;
  if (end >= products.length) {
    document.getElementById("load-more").style.display = "none";
  }
}

document.getElementById("load-more").addEventListener("click", loadProducts);

getData();

