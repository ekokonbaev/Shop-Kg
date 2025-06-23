// Прелоадер
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Навигация
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Корзина
let cart = [];
let cartCount = 0;
let totalAmount = 0;

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    cartCount++;
    totalAmount += price;
    updateCartCount();
    updateCartSidebar();
    showNotification(`${productName} себетке кошулду`);
}

function removeFromCart(index) {
    const item = cart[index];
    totalAmount -= item.price;
    cart.splice(index, 1);
    cartCount--;
    updateCartCount();
    updateCartSidebar();
    showNotification(`${item.name} себеттен очурулду`);
}

function updateCartCount() {
    document.querySelector('.cart-count').textContent = cartCount;
}

function updateCartSidebar() {
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} сом</p>
            </div>
            <button class="remove-item" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    document.querySelector('.total-amount').textContent = `${totalAmount} сом`;
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Быстрый просмотр
const quickViewBtns = document.querySelectorAll('.action-btn[data-tooltip="Быстрый просмотр"]');
const quickViewModal = document.querySelector('.quick-view-modal');
const closeModal = document.querySelector('.close-modal');

quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productImage = productCard.querySelector('img').src;
        
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="quick-view-content">
                <div class="quick-view-image">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="quick-view-info">
                    <h2>${productName}</h2>
                    <p class="price">${productPrice}</p>
                    <div class="product-colors">
                        <span class="color-dot" style="background-color: #000;"></span>
                        <span class="color-dot" style="background-color: #fff; border: 1px solid #ddd;"></span>
                        <span class="color-dot" style="background-color: #ff0000;"></span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${productName}', ${parseInt(productPrice)})">
                        СЕБЕТКЕ КОШУУ
                    </button>
                </div>
            </div>
        `;
        
        quickViewModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

closeModal.addEventListener('click', () => {
    quickViewModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Кнопка "Наверх"
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Таймер обратного отсчета
function updateCountdown() {
    const countdownItems = document.querySelectorAll('.countdown-number');
    let [days, hours, minutes, seconds] = countdownItems.map(item => parseInt(item.textContent));
    
    setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    hours = 23;
                    days--;
                    if (days < 0) {
                        days = 0;
                        hours = 0;
                        minutes = 0;
                        seconds = 0;
                    }
                }
            }
        }
        
        countdownItems[0].textContent = days.toString().padStart(2, '0');
        countdownItems[1].textContent = hours.toString().padStart(2, '0');
        countdownItems[2].textContent = minutes.toString().padStart(2, '0');
        countdownItems[3].textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Фильтрация товаров
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        productCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Поиск товаров
const searchInput = document.querySelector('.search-box input');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Загрузка дополнительных товаров
const loadMoreBtn = document.querySelector('.load-more-btn');

loadMoreBtn.addEventListener('click', () => {
    // Здесь будет логика загрузки дополнительных товаров
    showNotification('Жаңы товарлар жүктөлүүдө...');
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    
    // Добавление обработчиков для кнопок "Добавить в корзину"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const price = parseInt(productCard.querySelector('.price').textContent);
            addToCart(productName, price);
        });
    });
    
    // Обработчики для удаления товаров из корзины
    document.querySelector('.cart-items').addEventListener('click', (e) => {
        if (e.target.closest('.remove-item')) {
            const index = e.target.closest('.remove-item').dataset.index;
            removeFromCart(index);
        }
    });
}); 