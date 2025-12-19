document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.querySelector('.checkbox-container');
    const productsTitle = document.querySelector('.products-title');
    const originalTitle = productsTitle.textContent;
    const productCards = document.querySelectorAll('.product-card');
    const discountedOnlyText = 'Discounted items';
    
    // Проверяем, есть ли уже активный класс при загрузке
    const isInitiallyActive = checkbox.classList.contains('active');
    
    // Если чекбокс активен при загрузке, сразу применяем фильтр
    if (isInitiallyActive) {
        applyDiscountFilter();
    }
    
    function applyDiscountFilter() {
        productsTitle.textContent = discountedOnlyText;
        
        productCards.forEach(card => {
            const hasSaleBadge = card.querySelector('.sale-badge');
            if (!hasSaleBadge) {
                card.style.display = 'none';
            }
        });
    }
    
    function removeDiscountFilter() {
        productsTitle.textContent = originalTitle;
        
        productCards.forEach(card => {
            card.style.display = 'flex';
        });
    }
    
    function toggleDiscountFilter() {
        const isActive = checkbox.classList.contains('active');
        
        if (!isActive) {
            checkbox.classList.add('active');
            applyDiscountFilter();
        } else {
            checkbox.classList.remove('active');
            removeDiscountFilter();
        }
    }
    const productsSection = document.querySelector('.products-section');
    const productDetailsSection = document.getElementById('product-details');
    const backButton = document.getElementById('back-to-products');
    const productDetailTitle = document.getElementById('product-detail-title');
    const mainProductImage = document.getElementById('main-product-image');
    const currentPriceDetail = document.getElementById('current-price-detail');
    const oldPriceDetail = document.getElementById('old-price-detail');
    const discountBadge = document.getElementById('discount-badge');
    const productDescriptionText = document.getElementById('product-description-text');
    const featuresList = document.getElementById('features-list');
    const thumbnailImages = document.querySelector('.thumbnail-images');
    const addToCartDetailBtn = document.getElementById('add-to-cart-detail');
    const cartCount = document.querySelector('.cart-count');
    const productsData = {
        'Secateurs': {
            description: "This high quality everyday secateur features a fully hardened and tempered, high-carbon steel blade for lasting sharpness. For comfort, the robust but lightweight alloy handles are covered in a soft grip, in a bright terracotta colour for maximum visibility in the garden. It won't be easy to leave this pruner behind at the end of the day! Rubber cushion stops prevent jarring over repeated use, reducing hand strain for the user. This secateur cuts up to 2.5 cm diameter. Carrying RHS endorsement, possibly the highest accolade in gardening, for peace of mind this pruner comes with a ten-year guarantee against manufacturing defects.",
            features: [

            ],
            images: ['../photo/1.png', '../photo/1_side.png', '../photo/1_detail.png']
        },
        'Berry Collection (pack)': {
            description: "A collection of premium berry plants perfect for any garden. Includes strawberry, raspberry, and blueberry plants. All plants are grown organically and come with detailed planting instructions.",
            features: [

            ],
            images: ['../photo/2.png', '../photo/2_side.png', '../photo/2_detail.png']
        },
    };
    
    function toggleDiscountFilter() {
        const isActive = checkbox.classList.contains('active');
        
        if (!isActive) {
            checkbox.classList.add('active');
            productsTitle.textContent = discountedOnlyText;
            
            productCards.forEach(card => {
                const hasSaleBadge = card.querySelector('.sale-badge');
                if (!hasSaleBadge) {
                    card.style.display = 'none';
                }
            });
        } else {
            checkbox.classList.remove('active');
            productsTitle.textContent = originalTitle;
            
            productCards.forEach(card => {
                card.style.display = 'flex';
            });
        }
    }
    
    function showProductDetails(productCard) {
        const productName = productCard.querySelector('.product-name').textContent;
        const productImage = productCard.querySelector('.product-img').src;
        const currentPrice = productCard.querySelector('.current-price').textContent;
        const oldPriceElement = productCard.querySelector('.old-price');
        const oldPrice = oldPriceElement ? oldPriceElement.textContent : null;
        const saleBadge = productCard.querySelector('.sale-badge');
        productDetailTitle.textContent = productName;
        mainProductImage.src = productImage;
        currentPriceDetail.textContent = currentPrice;
        if (oldPrice) {
            oldPriceDetail.textContent = oldPrice;
            oldPriceDetail.style.display = 'inline';
            if (saleBadge) {
                discountBadge.textContent = saleBadge.textContent;
                discountBadge.style.display = 'inline-flex';
            }
        } else {
            oldPriceDetail.style.display = 'none';
            discountBadge.style.display = 'none';
        }
        const productData = productsData[productName] || {
            description: "Detailed description for this product is coming soon.",
            features: ["High quality materials", "Durable construction", "Garden approved"],
            images: [productImage]
        };
        
        productDescriptionText.textContent = productData.description;
        featuresList.innerHTML = '';
        productData.features.forEach(feature => {
            const li = document.createElement('li');
            li.className = 'feature-item';
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        thumbnailImages.innerHTML = '';
        productData.images.forEach((imgSrc, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${imgSrc}" alt="${productName} ${index + 1}">`;
            
            thumbnail.addEventListener('click', function() {
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                mainProductImage.src = imgSrc;
            });
            
            thumbnailImages.appendChild(thumbnail);
        });
        productsSection.style.display = 'none';
        productDetailsSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function showProductsList() {
        productsSection.style.display = 'block';
        productDetailsSection.style.display = 'none';
    }
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.add-to-cart-btn')) {
                showProductDetails(this);
            }
        });
    });
    backButton.addEventListener('click', showProductsList);
    const minusBtn = document.querySelector('.minus-btn');
    const plusBtn = document.querySelector('.plus-btn');
    const quantityValue = document.querySelector('.quantity-value');
    
    let quantity = 1;
    
    minusBtn.addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        quantity++;
        quantityValue.textContent = quantity;
    });
    addToCartDetailBtn.addEventListener('click', function() {
        let currentCount = parseInt(cartCount.textContent) || 0;
        currentCount += quantity;
        cartCount.textContent = currentCount;
        const originalText = addToCartDetailBtn.innerHTML;
        addToCartDetailBtn.innerHTML = '<i class="fas fa-check"></i> Added to cart';
        addToCartDetailBtn.style.background = '#339933';
        
        setTimeout(() => {
            addToCartDetailBtn.innerHTML = originalText;
            addToCartDetailBtn.style.background = '#282828';
        }, 1500);
    });
    checkbox.addEventListener('click', toggleDiscountFilter);
});
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            let currentCount = parseInt(cartCount.textContent) || 0;
            currentCount++;
            cartCount.textContent = currentCount;
            const originalText = this.innerHTML;
            this.innerHTML = 'Added!';
            this.style.background = '#339933';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '#282828';
            }, 1000);
        });
    });