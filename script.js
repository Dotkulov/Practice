document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
    document.querySelector('.main-nav').classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelector('.main-nav').classList.remove('active');
    });
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
});

let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

function addToCart() {
    cartCount++;
    cartCountElement.textContent = cartCount;
    cartCountElement.style.transform = 'scale(1.2)';

    setTimeout(() => {
        cartCountElement.style.transform = 'scale(1)';
    }, 300);
}

document.querySelector('.cart-link').addEventListener('click', function (e) {
    e.preventDefault();
    addToCart();
});


document.querySelectorAll('.category-card-item').forEach(card => {
    card.addEventListener('click', function (e) {
        e.preventDefault();

        this.style.transform = 'scale(0.98)';

        setTimeout(() => {
            this.style.transform = '';
        }, 200);

        const randomItems = Math.floor(Math.random() * 2) + 1;
        let currentCount = parseInt(cartCountElement.textContent);

        for (let i = 0; i < randomItems; i++) {
            setTimeout(() => {
                currentCount++;
                cartCountElement.textContent = currentCount;
                cartCountElement.style.transform = 'scale(1.3)';

                setTimeout(() => {
                    cartCountElement.style.transform = 'scale(1)';
                }, 200);
            }, i * 150);
        }

        this.style.boxShadow = '0 0 0 3px rgba(14, 138, 37, 0.3)';
        this.style.borderColor = '#0e8a25';

        setTimeout(() => {
            this.style.boxShadow = '';
            this.style.borderColor = '#e0e0e0';
        }, 1000);

        const categoryTitle = this.querySelector('.category-card-title').textContent;
        console.log(`Выбрана категория: ${categoryTitle}`);
    });
});

document.querySelector('.all-categories-btn').addEventListener('click', function (e) {
    e.preventDefault();

    this.style.transform = 'scale(0.95)';

    setTimeout(() => {
        this.style.transform = '';
    }, 200);

    const randomItems = Math.floor(Math.random() * 8) + 3;
    let currentCount = parseInt(cartCountElement.textContent);

    for (let i = 0; i < randomItems; i++) {
        setTimeout(() => {
            currentCount++;
            cartCountElement.textContent = currentCount;
            cartCountElement.style.transform = 'scale(1.3)';

            setTimeout(() => {
                cartCountElement.style.transform = 'scale(1)';
            }, 200);
        }, i * 100);
    }

    alert('Переход ко всем категориям! В корзину добавлены случайные товары.');
});

// ... предыдущий код остается без изменений ...

// Обработка формы скидки
document.querySelector('.discount-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Получаем значения полей формы
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Валидация
    if (!name || !phone || !email) {
        alert('Пожалуйста, заполните все поля формы');
        return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Пожалуйста, введите корректный email адрес');
        return;
    }

    // Имитация отправки данных
    const submitBtn = document.querySelector('.discount-submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    setTimeout(() => {
        // Здесь обычно отправка данных на сервер
        alert(`Спасибо, ${name}! Ваша заявка на скидку 5% принята. Мы свяжемся с вами в ближайшее время по телефону ${phone}.`);

        // Сброс формы
        document.querySelector('.discount-form').reset();

        // Восстановление кнопки
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Добавляем товар в корзину как бонус
        const randomBonus = Math.floor(Math.random() * 3) + 1;
        let currentCount = parseInt(cartCountElement.textContent);
        currentCount += randomBonus;
        cartCountElement.textContent = currentCount;

        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 300);

    }, 1500);
});