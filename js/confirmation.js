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

function clearShoppingCart() {
    shoppingCart = [];
    productList = [];
    localStorage.removeItem("selectedProducts");
}

function fetchProductData(productId) {
    return fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(response => response.json());
  }

function convertToSEK(usd) {
    const fixedExchangeRateUSDtoSEK = 10.5;
    return (usd * fixedExchangeRateUSDtoSEK).toFixed(0);
}

async function displayShoppingCart() {
    loadShoppingCart();
    productList = [];
    totalSum = 0;
    const orderItemsContainer = document.getElementById('order-items');
    orderItemsContainer.innerHTML = "";
    if (shoppingCart.length > 0) {
        const orderNumber = Math.floor(100000 + Math.random() * 900000); // Random order number
        document.getElementById('order-number').textContent = orderNumber;
        for (let i = 0; i < shoppingCart.length; i++) {
            const data = shoppingCart[i];
            const productId = data[0];
            const quantity = data[1];
            await fetchProductData(productId).then(productData => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product", "card", "order-card");
                productList[i] = productData;
                const sek = convertToSEK(productData.price);

                productDiv.classList.add('product-item');
                productDiv.innerHTML = `
                <img src="${productData.image}" alt="${productData.title}" class="product-img">
                <p>${productData.title} - <strong>${convertToSEK(productData.price)} kr</strong></p>
                <p>Quantity - <strong>${quantity}</strong></p>
            `;
                orderItemsContainer.appendChild(productDiv);

                totalSum += productData.price * quantity;
            });
        }
        clearShoppingCart();

    } else {
        orderItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    }
}

displayShoppingCart();