// 1. Products Data organized by Category
const categories = {
    chicken: [{
            id: 1,
            name: "Chicken Boneless Pickle",
            image: "https://sumadhurafoods.com/cdn/shop/files/bone-chicken-pickle.png?v=1732191308",
            prices: {
                "100g": 150,
                "250g": 350,
                "500g": 700,
                "1kg": 1400
            }
        },
        {
            id: 2,
            name: "Chicken with Bone Pickle",
            image: "https://foodonfarmpickles.com/cdn/shop/files/chicken-boneless-pickle-1-scaled_1000x.webp?v=1761405307",
            prices: {
                "100g": 130,
                "250g": 300,
                "500g": 600,
                "1kg": 1200
            }
        },
        {
            id: 3,
            name: "Gongura Chicken Pickle",
            image: "https://kollipickles.com/wp-content/uploads/2024/06/IMG_0409.jpg",
            prices: {
                "100g": 130,
                "250g": 300,
                "500g": 600,
                "1kg": 1200
            }
        },
        {
            id: 4,
            name: "Thokku Chicken Pickle",
            image: "https://www.licious.in/blog/wp-content/uploads/2022/02/chicken-pickle-750x422.jpg",
            prices: {
                "100g": 150,
                "250g": 350,
                "500g": 700,
                "1kg": 1400
            }
        }
    ],
    mutton: [],
    prawns: [{
        id: 5,
        name: "Prawns Pickle",
        image: "https://pichekkistabobby.com/storage/2025/09/PRAWNS-PICKLE-scaled.jpg",
        prices: {
            "100g": 250,
            "250g": 650,
            "500g": 1200,
            "1kg": 2200
        }
    }],
    fish: []
};

let currentCategory = 'chicken';
let cart = [];

// 2. UI & Cart Helper Functions
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
    }
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-2">
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.weight}</small>
            </div>
            <span>Rs.${item.price}</span>
            <button onclick="removeFromCart(${index})" class="btn btn-sm text-danger">✕</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total-price').innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateUI();
}

// 3. Category & Display Logic
function filterCategory(categoryName) {
    currentCategory = categoryName;
    document.querySelectorAll('.category-filter .btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === categoryName) btn.classList.add('active');
    });
    displayProducts(categoryName);
}

function displayProducts(category = 'chicken') {
    const container = document.getElementById('product-container');
    const productsToShow = categories[category];

    if (!productsToShow || productsToShow.length === 0) {
        container.innerHTML = `<h3 class="text-center text-white w-100 py-5">Fresh Batches Coming Soon! 🌶️</h3>`;
        return;
    }

    container.innerHTML = productsToShow.map(product => {
        let optionsHTML = "";
        for (const [weight, price] of Object.entries(product.prices)) {
            optionsHTML += `<option value="${weight}" data-price="${price}">${weight} - Rs.${price}</option>`;
        }

        return `
            <div class="product-card">
                <img src="${product.image}" class="imagesize" alt="${product.name}">
                <h2>${product.name}</h2>
                <div class="purchase-controls">
                    <label>Choose Quantity:</label>
                    <select id="weight-${product.id}" class="weight-selector mb-2">
                        ${optionsHTML}
                    </select>
                    <button class="add-btn w-100" onclick="prepareAddToCart(${product.id})">Add to Cart</button>
                    <div id="msg-${product.id}" class="added-msg">Added! ✅</div>
                </div>
            </div>
        `;
    }).join('');
}

function prepareAddToCart(productId) {
    // Look for the product in the CURRENT active category
    const product = categories[currentCategory].find(p => p.id === productId);
    const weightSelect = document.getElementById(`weight-${productId}`);
    const selectedOption = weightSelect.options[weightSelect.selectedIndex];

    const selectedWeight = selectedOption.value;
    const selectedPrice = parseInt(selectedOption.dataset.price);

    cart.push({
        name: product.name,
        weight: selectedWeight,
        price: selectedPrice
    });

    updateUI();
    showConfirmation(productId);
}

function showConfirmation(productId) {
    const msg = document.getElementById(`msg-${productId}`);
    if (msg) {
        msg.style.display = 'block';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 2000);
    }
}

function processCheckout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    let message = "Hello Spicy Aroma Pickles! 🌶️\nI would like to place an order:\n\n";
    cart.forEach(item => {
        message += `✅ ${item.name} (${item.weight})\n   Price: Rs.${item.price}\n\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `Total Amount: Rs. ${total}/-\n\nPlease confirm my order. Thank you!`;
    window.open(`https://wa.me/917989872395?text=${encodeURIComponent(message)}`, '_blank');
}

// 4. Start the page
displayProducts('chicken');


function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const container = document.getElementById('product-container');

    // If the search bar is empty, just show the current active category
    if (query === "") {
        displayProducts(currentCategory);
        return;
    }

    // Combine all products from all categories into one big list for searching
    let allProducts = [];
    Object.keys(categories).forEach(cat => {
        allProducts = allProducts.concat(categories[cat].map(p => ({
            ...p,
            categoryName: cat
        })));
    });

    // Filter products based on search query
    const filteredResults = allProducts.filter(product =>
        product.name.toLowerCase().includes(query)
    );

    // Display the results
    if (filteredResults.length === 0) {
        container.innerHTML = `<h3 class="text-center text-white w-100 py-5">No pickles found for "${query}" 🌶️</h3>`;
    } else {
        renderFilteredList(filteredResults);
    }
}

// Helper function to render search results
function renderFilteredList(results) {
    const container = document.getElementById('product-container');
    container.innerHTML = results.map(product => {
        let optionsHTML = "";
        for (const [weight, price] of Object.entries(product.prices)) {
            optionsHTML += `<option value="${weight}" data-price="${price}">${weight} - Rs.${price}</option>`;
        }

        return `
            <div class="product-card">
                <span class="badge badge-pill badge-warning mb-2">${product.categoryName.toUpperCase()}</span>
                <img src="${product.image}" class="imagesize" alt="${product.name}">
                <h2>${product.name}</h2>
                <div class="purchase-controls">
                    <label>Choose Quantity:</label>
                    <select id="weight-${product.id}" class="weight-selector mb-2">
                        ${optionsHTML}
                    </select>
                    <button class="add-btn w-100" onclick="prepareAddToCart(${product.id})">Add to Cart</button>
                    <div id="msg-${product.id}" class="added-msg">Added! ✅</div>
                </div>
            </div>
        `;
    }).join('');
}