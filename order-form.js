let shoppingCart = [];

function loadShoppingCart() {
  const cartLocalStorage = localStorage.getItem("selectedProducts");
  if (cartLocalStorage) {
    shoppingCart = JSON.parse(cartLocalStorage);
  }
}

function convertToSEK(usd) {
  const fixedExchangeRateUSDtoSEK = 10.5;
  return (usd * fixedExchangeRateUSDtoSEK).toFixed(0);
}


async function getData() {
  loadShoppingCart();  

  const containerCheckout = document.getElementById("checkout-container");
  const cartSummary = document.querySelector('.cart-summary'); 
  let total = 0;
  if (shoppingCart.length > 0) {
    
    for(let i = 0; i < shoppingCart.length; i++ ){
      const data = shoppingCart[i];
      const productId = data[0];
      const quantity =data[1];
      await fetchProductData(productId).then(productData => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product", "card", "order-card");
  
        const sek = convertToSEK(productData.price); 
  
        productDiv.innerHTML = `
          <div class="checkout-img-container">
            <img src="${productData.image}" alt="${productData.title}">
          </div>
          <h3>${productData.title}</h3>
          <p>${sek} kr</p>
          <p>Amount: ${quantity}</p>
          <p>Total: ${convertToSEK(productData.price * quantity)} kr</p>
        `;
        containerCheckout.appendChild(productDiv);
  
        total += productData.price * quantity;
      });
    }
      
    

    const totalDiv = document.createElement("div");
    totalDiv.classList.add("cart-total");
    totalDiv.innerHTML = `<h3>Total: ${convertToSEK(total)} kr</h3>`;
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

document.addEventListener("DOMContentLoaded", getData);