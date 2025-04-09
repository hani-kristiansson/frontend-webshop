let shoppingCart = [];
let productList = [];

let totalSum = 0;

function loadShoppingCart() {
  const cartLocalStorage = localStorage.getItem("selectedProducts");
  if (cartLocalStorage) {
    shoppingCart = JSON.parse(cartLocalStorage);
  }
}

function saveShoppingCart() {
  localStorage.setItem(
    "selectedProducts",
    JSON.stringify(shoppingCart)
  );
}

function convertToSEK(usd) {
  const fixedExchangeRateUSDtoSEK = 10.5;
  return (usd * fixedExchangeRateUSDtoSEK).toFixed(0);
}

function increaseProduct(cartIndex){
  const productData = productList[cartIndex];
  const product = shoppingCart[cartIndex];
  product[1] += 1;
  const productId = product[0];
  const quantity =product[1];
  saveShoppingCart();
  const amountTag = document.getElementById(`amount-product-${productId}`);
  amountTag.innerHTML = `Amount: ${quantity}`;
  const totalTag = document.getElementById(`total-product-${productId}`);
  totalTag.innerHTML = `Total: ${convertToSEK(productData.price * quantity)} kr`;
  updateTotalValue();
}

function decreaseProduct(cartIndex){
  const productData = productList[cartIndex];
  const product = shoppingCart[cartIndex];
  product[1] -= 1;
  const productId = product[0];
  const quantity =product[1];
  if(quantity > 0){
    saveShoppingCart();
    const amountTag = document.getElementById(`amount-product-${productId}`);
    amountTag.innerHTML = `Amount: ${quantity}`;
    const totalTag = document.getElementById(`total-product-${productId}`);
    totalTag.innerHTML = `Total: ${convertToSEK(productData.price * quantity)} kr`;
    updateTotalValue();
  }
  else {
    shoppingCart.splice(cartIndex,1);
    productList.splice(cartIndex,1);
    saveShoppingCart();
    displayShoppingCart();
  }
}

function removeProduct(cartIndex){
  shoppingCart.splice(cartIndex,1);
  productList.splice(cartIndex,1);
  saveShoppingCart();
  displayShoppingCart();
}

function updateTotalValue() {
  totalSum = 0;
  const cartSummary = document.querySelector('.cart-summary'); 
  cartSummary.innerHTML = "";
  for(let i = 0; i < shoppingCart.length; i++ ){
    const cartItem = shoppingCart[i];
    const quantity =cartItem[1];
    totalSum += (productList[i].price * quantity);
  }
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("cart-total");
  totalDiv.innerHTML = `<h3>Total: ${convertToSEK(totalSum)} kr</h3>`;
  cartSummary.appendChild(totalDiv);
}

async function displayShoppingCart() {
  loadShoppingCart();  
  productList = [];
  totalSum = 0;
  const containerCheckout = document.getElementById("checkout-container");
  containerCheckout.innerHTML = "";
  const cartSummary = document.querySelector('.cart-summary'); 
  cartSummary.innerHTML = "";
  if (shoppingCart.length > 0) {
    
    for(let i = 0; i < shoppingCart.length; i++ ){
      const data = shoppingCart[i];
      const productId = data[0];
      const quantity =data[1];
      await fetchProductData(productId).then(productData => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product", "card", "order-card");
        productList[i] = productData;
        const sek = convertToSEK(productData.price); 
  
        productDiv.innerHTML = `
          <div class="row no-gutters">
            <div class="col-md-4">
              <img src="${productData.image}" alt="${productData.title}" class="checkout-img card-img rounded mx-auto d-block">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h3>${productData.title}</h3>
                <p>${sek} kr</p>
                <p id="amount-product-${productId}">Amount: ${quantity}</p>
                <p id="total-product-${productId}">Total: ${convertToSEK(productData.price * quantity)} kr</p>
                <div class="row no-gutters">
                  <div class="col-3">
                    <button onclick="decreaseProduct(${i})">-</button>
                  </div>
                  <div class="col-3">
                    <button onclick="increaseProduct(${i})">+</button>
                  </div>
                  <div class="col-6">
                    <button onclick="removeProduct(${i})">remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        containerCheckout.appendChild(productDiv);
  
        totalSum += productData.price * quantity;
      });
    }
      
    

    const totalDiv = document.createElement("div");
    totalDiv.classList.add("cart-total");
    totalDiv.innerHTML = `<h3>Total: ${convertToSEK(totalSum)} kr</h3>`;
    cartSummary.appendChild(totalDiv);
  } else {
    containerCheckout.innerHTML = "<p>Your cart is empty.</p>";
  }
}




function fetchProductData(productId) {
  return fetch(`https://fakestoreapi.com/products/${productId}`)
  .then(response => response.json());
}

function orderConfirmation() {
  const productID = localStorage.getItem("selectedProduct");
  console.log("Found product ID:", productID);
  window.location.href = `order-confirmation.html?product-id=${productID}`;
}

function validateForm() {
  let isValid = true;

  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("addressError").textContent = "";
  document.getElementById("areaCodeError").textContent = "";
  document.getElementById("districtError").textContent = "";
  document.getElementById("mobileError").textContent = "";

  let name = document.getElementById("exampleInputname").value;
  if (name.length < 2 || name.length > 50) {
    document.getElementById("nameError").textContent =
      "Name must be between 2 and 50 characters.";
    isValid = false;
  }

  let email = document.getElementById("exampleInputEmail1").value;
  if (!email.includes("@") || email.length > 50) {
    document.getElementById("emailError").textContent =
      "Email must contain '@' and be less than 50 characters.";
    isValid = false;
  }

  let address = document.getElementById("exampleInputAddress").value;
  if (address.length < 2 || address.length > 50) {
    document.getElementById("addressError").textContent =
      "Address must be between 2 and 50 characters.";
    isValid = false;
  }

  let postalCode = document.getElementById("exampleInputAreaCode").value;
  if (postalCode.length !== 5 || isNaN(postalCode)) {
    document.getElementById("areaCodeError").textContent =
      "Postal code must be exactly 5 digits.";
    isValid = false;
  }

  let district = document.getElementById("exampleInputDistrict").value;
  if (district.length < 2 || district.length > 50) {
    document.getElementById("districtError").textContent =
      "District must be between 2 and 50 characters.";
    isValid = false;
  }

  let mobile = document.getElementById("exampleInputMobileNumber").value;
  if (mobile.length > 50 || /[^0-9()-]/.test(mobile)) {
    document.getElementById("mobileError").textContent =
      "Phone number can only contain numbers, hyphens, and parentheses, and must be up to 50 characters.";
    isValid = false;
  }

  if (isValid) {
    window.location.href = "order-confirmation.html";
  }
  return isValid;
}

document.addEventListener("DOMContentLoaded", displayShoppingCart);