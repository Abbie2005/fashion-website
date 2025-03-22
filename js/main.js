// Prevent Flash of Unstyled Content (FOUC) by applying theme immediately
(function () {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || { theme: 'light' };
    document.documentElement.setAttribute('data-theme', profileData.theme);
})();

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Exclusive Offer Timer
function startTimer() {
    const timer = document.querySelectorAll('.timer span');
    if (!timer || timer.length < 3) return;

    let time = 6 * 3600 + 18 * 60 + 48; // 6:18:48 in seconds

    const interval = setInterval(() => {
        if (time <= 0) {
            clearInterval(interval);
            return;
        }

        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time % 3600) / 60);
        let seconds = time % 60;

        timer[0].textContent = String(hours).padStart(2, '0');
        timer[1].textContent = String(minutes).padStart(2, '0');
        timer[2].textContent = String(seconds).padStart(2, '0');

        time--;
    }, 1000);
}

// Contact Form Tab Switching
function initializeContactTabs() {
    const optionCards = document.querySelectorAll(".option-card");
    if (optionCards.length > 0) {
        optionCards.forEach((card) => {
            card.addEventListener("click", () => {
                document.querySelectorAll(".option-card").forEach((c) => c.classList.remove("active"));
                document.querySelectorAll(".form-content").forEach((form) => form.classList.remove("active"));

                card.classList.add("active");
                const target = card.getAttribute("data-target");
                const targetForm = document.getElementById(`${target}-form`);
                if (targetForm) targetForm.classList.add("active");
            });
        });
    }
}

// Shop Filters and Search
function initializeShopFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.querySelector('.search-bar input');
    const shopGrid = document.querySelector('.shop-grid');
    const shopCards = document.querySelectorAll('.shop-card');

    if (!categoryFilter || !sortFilter || !searchInput || !shopGrid) return;

    function filterProducts() {
        const category = categoryFilter.value;
        const sort = sortFilter.value;
        const search = searchInput.value.toLowerCase();

        let products = Array.from(shopCards);

        if (category !== 'all') {
            products = products.filter(card => card.dataset.category === category);
        }

        products = products.filter(card =>
            card.querySelector('h3').textContent.toLowerCase().includes(search)
        );

        if (sort === 'price-low') {
            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                return priceA - priceB;
            });
        } else if (sort === 'price-high') {
            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                return priceB - priceA;
            });
        }

        shopCards.forEach(card => card.style.display = 'none');
        products.forEach(card => {
            shopGrid.appendChild(card);
            card.style.display = 'block';
        });
    }

    categoryFilter.addEventListener('change', filterProducts);
    sortFilter.addEventListener('change', filterProducts);
    searchInput.addEventListener('input', filterProducts);

    filterProducts();
}

// Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.cart-summary p span');
    if (cartItems && totalElement) {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} x <span class="quantity">${item.quantity}</span> = $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease" data-index="${index}">-</button>
                    <button class="increase" data-index="${index}">+</button>
                    <button class="remove" data-index="${index}">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        totalElement.textContent = total.toFixed(2);

        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                if (cart[index].quantity > 1) cart[index].quantity--;
                else cart.splice(index, 1);
                updateCart();
            });
        });

        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                cart[index].quantity++;
                updateCart();
            });
        });

        document.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
    updateCartCounter();
}

function updateCartCounter() {
    const existingCounter = document.querySelector('.cart-counter');
    if (existingCounter) existingCounter.remove();

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (totalItems > 0) {
        const cartIcon = document.querySelector('.nav-icons a:first-child');
        if (cartIcon) {
            const counter = document.createElement('span');
            counter.className = 'cart-counter';
            counter.textContent = totalItems;
            cartIcon.appendChild(counter);
        }
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function showAddToCartNotification(name) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <p>${name} added to cart!</p>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function initializeAddToCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.shop-card');
            const name = card.querySelector('h3').textContent;
            const price = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
            const image = card.querySelector('img').src;

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) existingItem.quantity++;
            else cart.push({ name, price, image, quantity: 1 });

            updateCart();
            showAddToCartNotification(name);
        });
    });
}

// Checkout Functionality
function initializeCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showCheckoutMessage('Your cart is empty', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        modal.innerHTML = `
            <div class="checkout-modal-content">
                <h3>Confirm Checkout</h3>
                <p>Are you sure you want to proceed with your order?</p>
                <p>Total: $${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</p>
                <div class="checkout-modal-actions">
                    <button class="cancel-checkout">Cancel</button>
                    <button class="confirm-checkout">Confirm Order</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('show'), 10);

        modal.querySelector('.cancel-checkout').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });

        modal.querySelector('.confirm-checkout').addEventListener('click', () => {
            modal.classList.remove('show');
            showCheckoutMessage('Processing your order...', 'processing');
            setTimeout(() => {
                cart = [];
                updateCart();
                showCheckoutMessage('Order placed successfully!', 'success');
            }, 2000);
            setTimeout(() => modal.remove(), 300);
        });
    });
}

function showCheckoutMessage(message, type) {
    const existingMessage = document.querySelector('.checkout-message');
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `checkout-message ${type}`;
    let icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' :
              type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
              '<i class="fas fa-spinner fa-spin"></i>';
    messageEl.innerHTML = `
        <div class="checkout-message-content">
            ${icon}
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(messageEl);

    setTimeout(() => messageEl.classList.add('show'), 10);
    if (type !== 'processing') {
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// Profile Edit and Theme Toggle
function initializeProfileEdit() {
    const profileDetails = document.querySelector('.profile-details');
    if (!profileDetails) return;

    let profileData = JSON.parse(localStorage.getItem('profileData')) || {
        name: 'Alex Carter',
        email: 'alex.carter@example.com',
        since: 'January 2023',
        theme: 'light'
    };

    function updateProfileDisplay() {
        profileDetails.innerHTML = `
            <h3>Your Profile</h3>
            <p><strong>Name:</strong> ${profileData.name}</p>
            <p><strong>Email:</strong> ${profileData.email}</p>
            <p><strong>Member Since:</strong> ${profileData.since}</p>
            <div class="theme-toggle">
                <label for="theme-select">Preferred Theme:</label>
                <select id="theme-select">
                    <option value="light" ${profileData.theme === 'light' ? 'selected' : ''}>Light</option>
                    <option value="dark" ${profileData.theme === 'dark' ? 'selected' : ''}>Dark</option>
                </select>
            </div>
            <button class="edit-profile-btn">Edit Profile</button>
        `;

        applyTheme(profileData.theme);

        const themeSelect = document.getElementById('theme-select');
        themeSelect.addEventListener('change', () => {
            profileData.theme = themeSelect.value;
            localStorage.setItem('profileData', JSON.stringify(profileData));
            applyTheme(profileData.theme);
        });

        profileDetails.querySelector('.edit-profile-btn').addEventListener('click', showEditForm);
    }

    function showEditForm() {
        profileDetails.innerHTML = `
            <h3>Edit Profile</h3>
            <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" value="${profileData.name}">
            </div>
            <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" value="${profileData.email}">
            </div>
            <input type="hidden" id="theme-select" value="${profileData.theme}">
            <button class="save-btn">Save</button>
        `;

        profileDetails.querySelector('.save-btn').addEventListener('click', saveProfile);
    }

    function saveProfile() {
        profileData.name = document.getElementById('name').value;
        profileData.email = document.getElementById('email').value;
        profileData.theme = document.getElementById('theme-select').value;

        localStorage.setItem('profileData', JSON.stringify(profileData));
        applyTheme(profileData.theme);
        updateProfileDisplay();
    }

    updateProfileDisplay();
}

// Apply Theme Across the Site
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Initialize Theme on Page Load (for non-profile pages)
function initializeTheme() {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || { theme: 'light' };
    applyTheme(profileData.theme);
}

// DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    initializeContactTabs();
    initializeShopFilters();
    initializeAddToCart();
    updateCartDisplay();
    initializeProfileEdit();
    initializeCheckout();
    initializeTheme();
});