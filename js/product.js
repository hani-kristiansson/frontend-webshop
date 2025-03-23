let products = [];

fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

getData("https://fakestoreapi.com/products");
async function getData(){
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();
    console.log(products);
    loadProducts();
}

let itemsPerPage = 8;
let currentPage = 1;

function loadProducts() {

    console.log(products);

    const grid = document.getElementById("product-grid");
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = products.slice(start, end);

    itemsToShow.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.price}</p>
        `;
        grid.appendChild(productDiv);
    });

    currentPage++;
    if (end >= products.length) {
        document.getElementById("load-more").style.display = "none";
    }
}

document.getElementById("load-more").addEventListener("click", loadProducts);

getData();