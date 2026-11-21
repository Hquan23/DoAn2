// JAVASCRIPT XỬ LÝ GIỎ HÀNG RIÊNG BIỆT CHO TỪNG TÀI KHOẢN (UC-05)

// Lấy khóa lưu trữ giỏ hàng riêng cho tài khoản đang đăng nhập
function getCartStorageKey() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
    if (user && (user.username || user.email || user.tailkhoan)) {
        const id = (user.username || user.email || user.tailkhoan).toLowerCase().replace(/[^a-z0-9]/g, '_');
        return `cart_${id}`;
    }
    return 'cart_guest';
}

// Lấy danh sách sản phẩm trong giỏ hàng
function getCart() {
    const key = getCartStorageKey();
    let cart = JSON.parse(localStorage.getItem(key));
    if (!cart || !Array.isArray(cart)) {
        cart = [];
    }
    return cart;
}

// Lưu giỏ hàng
function saveCart(cart) {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(cart));
    // Đồng bộ vào 'cart' để tương thích với các script thanh toán
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    product.quantity = 1;
    let cart = getCart();

    let found = cart.find(item => item.id === product.id);
    if (found) {
        found.quantity += 1;
    } else {
        cart.push(product);
    }

    saveCart(cart);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// Định dạng tiền tệ VND
function formatCurrency(amount) {
    if (typeof amount === 'string') {
        amount = parseFloat(amount.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0;
    }
    return amount.toLocaleString('vi-VN') + '₫';
}

// Hiển thị giỏ hàng trên trang giohang.html
function renderCart() {
    const itemsContainer = document.getElementById('cart-items');
    if (!itemsContainer) return; // Nếu không phải trang giohang.html thì không chạy

    const summary = document.querySelector('.cart-summary');
    const empty = document.querySelector('.cart-empty');
    const cartTable = document.getElementById('cart-table');
    const goHomeUpdate = document.querySelector('.gohome-update');

    const cart = getCart();

    if (cart.length === 0) {
        itemsContainer.innerHTML = '';
        if (summary) summary.style.display = "none";
        if (empty) empty.style.display = "block";
        if (cartTable) cartTable.style.display = "none";
        if (goHomeUpdate) goHomeUpdate.style.display = "none";
        localStorage.removeItem('cartTotal');
        return;
    }

    if (cartTable) cartTable.style.display = "block";
    if (summary) summary.style.display = "block";
    if (empty) empty.style.display = "none";
    if (goHomeUpdate) goHomeUpdate.style.display = "flex";

    itemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQuantity = parseInt(item.quantity) || 1;
        const itemTotal = itemPrice * itemQuantity;
        total += itemTotal;

        itemsContainer.innerHTML += `
            <div class="cart-part">
                <div class="cart-img"><img src="${item.image || 'img/motorcycle.png'}" alt="${item.name}"></div>
                <div class="cart-desc"><h3>${item.name}</h3></div>
                <div class="cart-quantity">
                    <input type="number" value="${itemQuantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                </div>
                <div class="cart-price"><h4>${formatCurrency(itemPrice)}</h4></div>
                <div class="cart-total"><h4>${formatCurrency(itemTotal)}</h4></div>
                <div class="cart-remove"><button onclick="removeItem('${item.id}')">Xóa</button></div>
            </div>`;
    });

    const totalEl = document.getElementById("total");
    const subtotalEl = document.getElementById("subtotal");
    if (totalEl) totalEl.innerText = formatCurrency(total);
    if (subtotalEl) subtotalEl.innerText = formatCurrency(total);
    localStorage.setItem('cartTotal', formatCurrency(total));
}

// Cập nhật số lượng sản phẩm
function updateQuantity(id, value) {
    let cart = getCart();
    const item = cart.find(p => p.id === id);
    if (item) {
        item.quantity = Math.max(1, parseInt(value) || 1);
    }
    saveCart(cart);
    renderCart();
}

// Xóa 1 sản phẩm khỏi giỏ hàng
function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(p => p.id !== id);
    saveCart(cart);
    renderCart();
}

// Khởi tạo các sự kiện khi trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Chỉ chạy renderCart và gắn sự kiện nếu có container giỏ hàng
    if (document.getElementById('cart-items')) {
        renderCart();

        const removeAllBtn = document.querySelector('.RemoveAll');
        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
                    saveCart([]);
                    renderCart();
                }
            });
        }
    }
});
