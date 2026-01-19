// ==========================================
// 1. GLOBAL VARIABLES & DATA INITIALIZATION
// ==========================================
let users = JSON.parse(localStorage.getItem('pickle_users')) || {};
let currentUser = JSON.parse(localStorage.getItem('pickle_current_user')) || null;
let cart = [];
let currentCategory = 'chicken';

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

// ==========================================
// 2. UI & HELPER FUNCTIONS
// ==========================================
function updateProfileUI() {
    if (currentUser) {
        const nameDisplay = document.getElementById('user-name-display');
        if (nameDisplay) {
            nameDisplay.innerText = currentUser.name;
            nameDisplay.style.color = "#4B0082"; // Brinjal Color
        }
        const userIcon = document.querySelector('.fa-user-circle');
        if (userIcon) userIcon.style.color = "#25D366"; // Success Green
    }
}

function updateUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = cart.length;

    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                    <strong style="color:#4B0082">${item.name}</strong><br>
                    <small>${item.weight}</small>
                </div>
                <span>Rs.${item.price}</span>
                <button onclick="removeFromCart(${index})" class="btn btn-sm text-danger">✕</button>
            </div>
        `).join('');
    }

    const totalDisplay = document.getElementById('total-price');
    if (totalDisplay) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalDisplay.innerText = total;
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
    }
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

// ==========================================
// 3. USER ACCOUNT & PROFILE FUNCTIONS
// ==========================================
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const name = document.getElementById('login-username').value;

    if (!email || !name) return alert("Please enter your name and email");

    if (!users[email]) {
        users[email] = {
            name: name,
            email: email,
            orderHistory: []
        };
    }

    currentUser = users[email];
    localStorage.setItem('pickle_users', JSON.stringify(users));
    localStorage.setItem('pickle_current_user', JSON.stringify(currentUser));

    updateProfileUI();
    $('#loginModal').modal('hide');
}

function checkUserStatus() {
    if (!currentUser) {
        $('#loginModal').modal('show');
    } else {
        showProfile();
    }
}

function showProfile() {
    if (!currentUser) return $('#loginModal').modal('show');

    const nameHeader = document.getElementById('profile-name-header');
    if (nameHeader) nameHeader.innerText = currentUser.name;

    const historyList = document.getElementById('order-history-list');
    if (historyList) {
        if (currentUser.orderHistory.length === 0) {
            historyList.innerHTML = "<p class='text-muted'>No orders yet. Start shopping! 🌶️</p>";
        } else {
            historyList.innerHTML = currentUser.orderHistory.map(order => `
                <div class="order-card p-3 mb-2 bg-light rounded border border-secondary text-dark">
                    <div class="d-flex justify-content-between">
                        <strong>Date: ${order.date}</strong>
                        <span class="text-primary">Rs.${order.total}</span>
                    </div>
                    <small>${order.items.map(i => i.name + " (" + i.weight + ")").join(', ')}</small>
                </div>
            `).join('');
        }
    }
    $('#profileModal').modal('show');
}

function logout() {
    localStorage.removeItem('pickle_current_user');
    location.reload();
}

// ==========================================
// 4. PRODUCT DISPLAY & SEARCH LOGIC
// ==========================================
function displayProducts(category = 'chicken') {
    const container = document.getElementById('product-container');
    const productsToShow = categories[category];

    if (!productsToShow || productsToShow.length === 0) {
        container.innerHTML = `<h3 class="text-center w-100 py-5" style="color:#4B0082">Fresh Batches Coming Soon! 🌶️</h3>`;
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
                    <label style="color:#4B0082">Choose Quantity:</label>
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

function filterCategory(categoryName) {
    currentCategory = categoryName;
    document.querySelectorAll('.category-filter .btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === categoryName) btn.classList.add('active');
    });
    displayProducts(categoryName);
}

function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (query === "") {
        displayProducts(currentCategory);
        return;
    }

    let allProducts = [];
    Object.keys(categories).forEach(cat => {
        allProducts = allProducts.concat(categories[cat]);
    });

    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    renderFilteredList(filtered);
}

function renderFilteredList(results) {
    const container = document.getElementById('product-container');
    if (results.length === 0) {
        container.innerHTML = `<h3 class="text-center w-100 py-5" style="color:#4B0082">No pickles found! 🌶️</h3>`;
        return;
    }
    // (Similar mapping as displayProducts for result items...)
}

// ==========================================
// 5. SHOPPING CART & CHECKOUT LOGIC
// ==========================================
function prepareAddToCart(productId) {
    const product = categories[currentCategory].find(p => p.id === productId);
    const weightSelect = document.getElementById(`weight-${productId}`);
    const selectedOption = weightSelect.options[weightSelect.selectedIndex];

    cart.push({
        name: product.name,
        weight: selectedOption.value,
        price: parseInt(selectedOption.dataset.price)
    });

    updateUI();
    showConfirmation(productId);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateUI();
}

function processCheckout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!currentUser) {
        alert("Please login to proceed with your order.");
        $('#loginModal').modal('show');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const newOrder = {
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: total
    };

    users[currentUser.email].orderHistory.push(newOrder);
    localStorage.setItem('pickle_users', JSON.stringify(users));

    let message = `*NEW ORDER - SPICY AROMA* 🌶️\n*Customer:* ${currentUser.name}\n\n`;
    cart.forEach(item => {
        message += `• ${item.name} (${item.weight})\n`;
    });
    message += `\n*Total: Rs.${total}/-*`;

    window.open(`https://wa.me/917989872395?text=${encodeURIComponent(message)}`, '_blank');
    cart = [];
    updateUI();
}

// ==========================================
// 6. INITIALIZATION (The Bottom)
// ==========================================
window.onload = function() {
    const mainContent = document.querySelector('main');
    const headerContent = document.querySelector('header');

    if (mainContent) mainContent.style.display = 'block';
    if (headerContent) headerContent.style.opacity = '1';

    if (currentUser) {
        updateProfileUI();
    }
    displayProducts('chicken');
};
