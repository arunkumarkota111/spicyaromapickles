const products = [{
        id: 1,
        name: "Chicken Boneless Pickle",
        price: 150,
        image: "https://dwarakapickles.com/wp-content/uploads/2022/05/Chicken-1.png"
    },
    {
        id: 2,
        name: "Chicken with Bone Pickle",
        price: 120,
        image: "https://dwarakapickles.com/wp-content/uploads/2022/05/Chicken-1.png"
    },
    {
        id: 3,
        name: "Gongura Chicken Pickle",
        price: 130,
        image: "https://kollipickles.com/wp-content/uploads/2024/06/IMG_0409.jpg"
    },
    {
        id: 4,
        name: "Thokku Chicken Pickle",
        price: 140,
        image: "https://www.licious.in/blog/wp-content/uploads/2022/02/chicken-pickle-750x422.jpg"
    }
];

let cart = [];

function displayProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" class="imagesize" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Rs.${product.price}/- 100g</p>
            
            <div class="purchase-controls">
                <label for="qty-${product.id}">Qty:</label>
                <select id="qty-${product.id}">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button class="add-btn" onclick="prepareAddToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function prepareAddToCart(productId) {
    const qtySelect = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtySelect.value);
    const product = products.find(p => p.id === productId);

    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
        cart.push({
            ...product
        }); // Push a copy of the product
    }

    updateUI();
}

function updateUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');

    // Grouping items to show "Item Name x Quantity"
    const groupedCart = cart.reduce((acc, item) => {
        const found = acc.find(i => i.id === item.id);
        if (found) {
            found.qty++;
        } else {
            acc.push({
                ...item,
                qty: 1
            });
        }
        return acc;
    }, []);

    cartItems.innerHTML = groupedCart.map((item) => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <small>Rs.${item.price} x ${item.qty}</small>
            </div>
            <span>Rs.${item.price * item.qty}</span>
            <button onclick="removeFromCartById(${item.id})" style="color:red; border:none; background:none; cursor:pointer;">✕</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total-price').innerText = total;
}

// New remove function for grouped items
function removeFromCartById(id) {
    cart = cart.filter(item => item.id !== id);
    updateUI();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

displayProducts();