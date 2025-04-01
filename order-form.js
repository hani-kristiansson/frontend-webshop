let shoppingCart;

function loadShoppingCart() {
  const cartLocalStorage = localStorage.getItem("selectedProducts");
  if (cartLocalStorage) {
    shoppingCart = new Map(JSON.parse(cartLocalStorage));
  } else {
    shoppingCart = new Map();
  }
}



async function fetchProductData(productId) {
  const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
  const data = await response.json();
  return data;
}

async function getData() {
  const productID = localStorage.getItem("selectedProduct");
  if (!productID) {
    console.error("No product ID found in localStorage.");
    return;
  }

  const containerCheckout = document.getElementById("checkout-container");
  //Clear container checkout before adding current products
  containerCheckout.innerHTML = '';
  //If we have a shoppingcart
  if (shoppingCart) {
    console.log(shoppingCart)
    shoppingCart.forEach(function (value, key) {
      const product = fetchProductData(key).then(product => {
        if (product) {
          const productDiv = document.createElement("div");
          productDiv.classList.add("product","card","order-card");
          productDiv.innerHTML = `
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <h3>${product.title}</h3>
            <p>${product.price} kr </p>
            <p>Amount: ${value}</p>
        `;
          containerCheckout.appendChild(productDiv);
        }
      });

    })
  }
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

loadShoppingCart();
getData();