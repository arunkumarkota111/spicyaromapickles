// 1. Products Data

const products = [{
        id: 1,
        name: "Chicken Boneless Pickle",
        basePrice: 150,
        image: "https://sumadhurafoods.com/cdn/shop/files/bone-chicken-pickle.png?v=1732191308"
    },
    {
        id: 2,
        name: "Chicken with Bone Pickle",
        basePrice: 120,
        image: "https://foodonfarmpickles.com/cdn/shop/files/chicken-boneless-pickle-1-scaled_1000x.webp?v=1761405307"
    },
    {
        id: 3,
        name: "Gongura Chicken Pickle",
        basePrice: 130,
        image: "https://kollipickles.com/wp-content/uploads/2024/06/IMG_0409.jpg"
    },

    {
        id: 4,
        name: "Thokku Chicken Pickle",
        basePrice: 140,
        image: "https://www.licious.in/blog/wp-content/uploads/2022/02/chicken-pickle-750x422.jpg"
    }

];

let cart = [];
// 2. Helper Functions (UI and Cart Management)

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');

        // Lock/Unlock background scroll based on sidebar state
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden'; // Prevents homepage from scrolling
        } else {
            document.body.style.overflow = 'auto'; // Re-enables homepage scroll
        }
    }
}
// Listen for scrolling to show/hide the "Back to Top" button
window.onscroll = function() {
    const topBtn = document.getElementById("backToTop");
    if (topBtn) {
        // Show button after scrolling down 200px
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    }
};


function updateUI() {
    // Update count in header
    document.getElementById('cart-count').innerText = cart.length;
    // Update items in sidebar
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

    // Update total price
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('total-price').innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateUI();
}

// 3. Main Action Functions
function displayProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(product => {
        // Calculate prices once for the dropdown
        const p100 = product.basePrice;
        const p250 = Math.round(product.basePrice * 2.4);
        const p500 = Math.round(product.basePrice * 4.5);
        const p1kg = Math.round(product.basePrice * 8.5);
        return `
            <div class="product-card">
                <img src="${product.image}" class="imagesize" alt="${product.name}">
                <h2>${product.name}</h2>
                <div class="purchase-controls">
                    <label>Select Weight & Price:</label>
                    <select id="weight-${product.id}">
                        <option value="100g" data-price="${p100}">100 grms : Rs.${p100}/-</option>
                        <option value="250g" data-price="${p250}">250 grms : Rs.${p250}/-</option>
                        <option value="500g" data-price="${p500}">500 grms : Rs.${p500}/-</option>
                        <option value="1kg" data-price="${p1kg}">1 kg : Rs.${p1kg}/-</option>
                    </select>
                    <button class="add-btn w-100" onclick="prepareAddToCart(${product.id})">Add to Cart</button>
                    <div id="msg-${product.id}" class="added-msg">Added to Cart! ✅</div>
                </div>
            </div>
        `;
    }).join('');
}

function prepareAddToCart(productId) {
    const weightSelect = document.getElementById(`weight-${productId}`);
    const selectedOption = weightSelect.options[weightSelect.selectedIndex];
    // Add to cart array
    cart.push({
        name: products.find(p => p.id === productId).name,
        weight: selectedOption.value,
        price: parseInt(selectedOption.dataset.price)
    });
    updateUI();
    // Call the message function
    showConfirmation(productId);
}



function showConfirmation(productId) {
    const msg = document.getElementById(`msg-${productId}`);
    if (msg) {
        msg.style.setProperty('display', 'block', 'important'); // Forces it to show
        setTimeout(() => {
            msg.style.setProperty('display', 'none', 'important'); // Hides it after 2 seconds
        }, 2000);
    } else {
        console.error("Could not find message div for ID: " + productId);
    }
}

function processCheckout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    let message = "Hello Spicy Aroma Pickles! 🌶️\nI would like to place an order:\n\n";
    cart.forEach(item => {
        message += `✅ ${item.name} x quantity x ${item.weight}\n   Price: Rs.${item.price}\n\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `Total Amount: Rs. ${total}/-\n\nPlease confirm my order. Thank you!`;
    const whatsappURL = `https://wa.me/917989872395?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// 4. Initialize the site
displayProducts();