document.addEventListener('DOMContentLoaded', function() {
    initCart();
    setupCartItemEvents();
    
    const orderBtn = document.querySelector('.submit-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', processOrder);
    }
});

function initCart() {
    const savedCart = localStorage.getItem('plantsCart');
    if (savedCart) {
        updateCartFromStorage(JSON.parse(savedCart));
    }
    
    updateCartCount();
}

function setupCartItemEvents() {
    const minusBtns = document.querySelectorAll('.qty-btn.minus');
    const plusBtns = document.querySelectorAll('.qty-btn.plus');
    
    minusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            changeQuantity(this, -1);
        });
    });
    
    plusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            changeQuantity(this, 1);
        });
    });
    
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            removeCartItem(this.closest('.cart-item'));
        });
    });
}

function changeQuantity(button, change) {
    const cartItem = button.closest('.cart-item');
    const qtyElement = cartItem.querySelector('.qty-value');
    let currentQty = parseInt(qtyElement.textContent);
    
    if (change === -1 && currentQty <= 1) {
        removeCartItem(cartItem);
        return;
    }
    
    const newQty = currentQty + change;
    qtyElement.textContent = newQty;
    
    updateItemPrice(cartItem, newQty);
    
    updateCartTotals();
    updateCartCount();
    saveCartToStorage();
}

function updateItemPrice(cartItem, quantity) {
    const priceElement = cartItem.querySelector('.current-price');
    const oldPriceElement = cartItem.querySelector('.old-price');
    const basePrice = parseFloat(priceElement.getAttribute('data-base-price') || 
        parseFloat(priceElement.textContent.replace('$', '')));
    const baseOldPrice = oldPriceElement.textContent ? 
        parseFloat(oldPriceElement.textContent.replace('$', '')) : null;
    
    if (!priceElement.hasAttribute('data-base-price')) {
        priceElement.setAttribute('data-base-price', basePrice);
    }
    if (baseOldPrice && !oldPriceElement.hasAttribute('data-base-price')) {
        oldPriceElement.setAttribute('data-base-price', baseOldPrice);
    }
    
    priceElement.textContent = `$${basePrice * quantity}`;
    if (baseOldPrice) {
        oldPriceElement.textContent = `$${baseOldPrice * quantity}`;
    }
}

function removeCartItem(cartItem) {
    cartItem.style.opacity = '0.5';
    cartItem.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        cartItem.remove();

        const itemsList = document.querySelector('.items-list');
        if (itemsList.children.length === 0) {
            showEmptyCart();
        }
        
        updateCartTotals();
        updateCartCount();
        saveCartToStorage();
    }, 300);
}

function updateCartTotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    let totalItems = 0;
    let totalPrice = 0;
    
    cartItems.forEach(item => {
        const qty = parseInt(item.querySelector('.qty-value').textContent);
        const priceText = item.querySelector('.current-price').textContent;
        const price = parseFloat(priceText.replace('$', '').replace(',', ''));
        
        totalItems += qty;
        totalPrice += price;
    });

    const itemsCountElement = document.querySelector('.items-count');
    const totalPriceElement = document.querySelector('.total-price');
    
    if (itemsCountElement) {
        itemsCountElement.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    }
    
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
}

function updateCartCount() {
    const cartItems = document.querySelectorAll('.cart-item');
    let totalCount = 0;
    
    cartItems.forEach(item => {
        totalCount += parseInt(item.querySelector('.qty-value').textContent);
    });
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;

        if (totalCount === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'flex';
        }
    }
}

function saveCartToStorage() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartData = [];
    
    cartItems.forEach(item => {
        const itemData = {
            title: item.querySelector('.item-title').textContent,
            image: item.querySelector('img').src.split('/').pop(),
            quantity: parseInt(item.querySelector('.qty-value').textContent),
            price: parseFloat(item.querySelector('.current-price').textContent.replace('$', '')),
            oldPrice: item.querySelector('.old-price').textContent ? 
                parseFloat(item.querySelector('.old-price').textContent.replace('$', '')) : null
        };
        cartData.push(itemData);
    });
    
    localStorage.setItem('plantsCart', JSON.stringify(cartData));
}

function updateCartFromStorage(cartData) {
    updateCartTotals();
    updateCartCount();
}

function processOrder(event) {
    event.preventDefault();

    const nameInput = document.querySelector('input[placeholder="Name"]');
    const phoneInput = document.querySelector('input[placeholder="Phone number"]');
    const emailInput = document.querySelector('input[placeholder="Email"]');

    if (!nameInput.value || !phoneInput.value || !emailInput.value) {
        alert('Please fill in all fields');
        return;
    }

    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    showOrderSuccess();
    
    nameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
}

function showOrderSuccess() {
    const overlay = document.createElement('div');
    overlay.className = 'order-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;

    const notification = document.createElement('div');
    notification.className = 'order-notification';
    notification.style.cssText = `
        background: #339933;
        border-radius: 16px;
        padding: 60px 80px;
        max-width: 800px;
        width: 90%;
        position: relative;
        color: white;
        text-align: center;
        animation: slideUp 0.5s ease;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 36px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s;
    `;
    
    closeBtn.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseout', function() {
        this.style.background = 'none';
        this.style.transform = 'scale(1)';
    });
    
    const notificationContent = document.createElement('div');
    notificationContent.innerHTML = `
        <div style="font-size: 40px; font-weight: 700; margin-bottom: 30px; line-height: 1.2;">
            Congratulations!
        </div>
        <div style="font-size: 24px; font-weight: 500; line-height: 1.5; margin-bottom: 15px;">
            Your order has been successfully placed
        </div>
        <div style="font-size: 20px; font-weight: 500; line-height: 1.5; opacity: 0.9;">
            A manager will contact you shortly
        </div>
        <div style="font-size: 20px; font-weight: 500; line-height: 1.5; opacity: 0.9;">
            to confirm your order.
        </div>
    `;
    
    notification.appendChild(closeBtn);
    notification.appendChild(notificationContent);
    overlay.appendChild(notification);
    document.body.appendChild(overlay);
    

    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideDown 0.3s ease';
        overlay.style.animation = 'fadeOut 0.3s ease';
        
        setTimeout(() => {
            document.body.removeChild(overlay);
            clearCart();
        }, 300);
    });

    document.body.classList.add('order-success');

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeBtn.click();
        }
    });
    
    addNotificationStyles();
}

function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0; 
                transform: translateY(50px) scale(0.9); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        
        @keyframes slideDown {
            from { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
            to { 
                opacity: 0; 
                transform: translateY(50px) scale(0.9); 
            }
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2) !important;
        }
    `;
    document.head.appendChild(style);
}

function clearCart() {
    const itemsList = document.querySelector('.items-list');
    itemsList.innerHTML = '';

    showEmptyCart();
    updateCartTotals();
    updateCartCount();
    
    localStorage.removeItem('plantsCart');
    
    document.body.classList.remove('order-success');
}

function showEmptyCart() {
    const itemsList = document.querySelector('.items-list');
    
    const emptyCartHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-bag"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you have no items in your basket currently.</p>
            <button class="continue-shopping-btn" style="
                margin-top: 20px;
                padding: 16px 32px;
                background: #339933;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 18px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.3s;
            ">Continue Shopping</button>
            <p style="margin-top: 10px; font-size: 14px; color: #8B8B8B;">
                Back to the store
            </p>
        </div>
    `;
    
    itemsList.innerHTML = emptyCartHTML;
    
    const continueBtn = itemsList.querySelector('.continue-shopping-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            alert('Redirecting to store...');
        });
    }
}

function showOrderSuccess() {
    const notification = document.createElement('div');
    notification.className = 'small-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #339933;
        border-radius: 8px;
        padding: 24px 40px;
        min-width: 400px;
        max-width: 90%;
        color: white;
        text-align: center;
        z-index: 2000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        animation: slideDownSmall 0.5s ease;
        border: 2px solid #2a7c2a;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close-small';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s;
        line-height: 1;
        padding: 0;
    `;
    
    closeBtn.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255, 255, 255, 0.3)';
        this.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseout', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.transform = 'scale(1)';
    });
    
    const notificationContent = document.createElement('div');
    notificationContent.innerHTML = `
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; line-height: 1.3;">
            Congratulations!
        </div>
        <div style="font-size: 14px; font-weight: 500; line-height: 1.4; opacity: 0.9;">
        <p> Your order has been successfully placed on the website.</p>
        <p>A manager will contact you shortly to confirm your order.</p>
        </div>
    `;
    
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1999;
        animation: fadeIn 0.3s ease;
        backdrop-filter: blur(3px);
    `;
    
    notification.appendChild(closeBtn);
    notification.appendChild(notificationContent);
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideUpSmall 0.3s ease';
        overlay.style.animation = 'fadeOut 0.3s ease';
        
        setTimeout(() => {
            document.body.removeChild(notification);
            document.body.removeChild(overlay);
            
            clearCart();
        }, 300);
    });
    

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeBtn.click();
        }
    });
    

    addSmallNotificationStyles();
}

function addSmallNotificationStyles() {
    if (document.getElementById('small-notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'small-notification-styles';
    style.textContent = `
        @keyframes slideDownSmall {
            from { 
                opacity: 0; 
                transform: translateX(-50%) translateY(-50px); 
            }
            to { 
                opacity: 1; 
                transform: translateX(-50%) translateY(0); 
            }
        }
        
        @keyframes slideUpSmall {
            from { 
                opacity: 1; 
                transform: translateX(-50%) translateY(0); 
            }
            to { 
                opacity: 0; 
                transform: translateX(-50%) translateY(-50px); 
            }
        }
    `;
    document.head.appendChild(style);
}

function showEmptyCart() {
    const cartContent = document.querySelector('.cart-content');
    
    const cartHeader = document.querySelector('.cart-header');
    const headerActions = document.querySelector('.header-actions');
    
    cartContent.innerHTML = `
        <div class="empty-cart-container">
            <div class="empty-cart-message">
                Looks like you have no items in your basket currently.
            </div>
            <button class="continue-shopping-btn">
                Continue Shopping
            </button>
        </div>
    `;
    
    const continueBtn = cartContent.querySelector('.continue-shopping-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            alert('Redirecting to store...');
        });
    }
    
    document.body.classList.remove('order-success');
}
    
    const continueBtn = cartContainer.querySelector('.continue-shopping-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            alert('Redirecting to store...');
        });
    }
    
    document.body.classList.remove('order-success');
