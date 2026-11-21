document.querySelectorAll('input[name="payment"]').forEach(input => {
  input.addEventListener('change', () => {
    const bankInput = document.getElementById('bank-account');
    if (input.value === 'bank' && input.checked) {
      bankInput.style.display = 'block';
    } else {
      bankInput.style.display = 'none';
    }
  });
});

function getActiveCartKey() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
    if (user && (user.username || user.email || user.tailkhoan)) {
        return `cart_${(user.username || user.email || user.tailkhoan).toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    }
    return 'cart_guest';
}

document.addEventListener('DOMContentLoaded', () => {
    const cartKey = getActiveCartKey();
    const cart = JSON.parse(localStorage.getItem(cartKey)) || JSON.parse(localStorage.getItem('cart')) || [];
    const cartTotal = localStorage.getItem('cartTotal') || '0₫';
    const orderItemsDisplay = document.getElementById('order-items-display');
    const cartTotalDisplay = document.getElementById('cart-total-display');

    // Tự động điền thông tin nếu người dùng đã đăng nhập
    const user = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
    if (user) {
        const form = document.getElementById('checkout-form');
        if (form) {
            if (user.fullname && form.elements['name']) form.elements['name'].value = user.fullname;
            if (user.phone && form.elements['phone']) form.elements['phone'].value = user.phone;
            if (user.email && form.elements['email']) form.elements['email'].value = user.email;
            if (user.address && form.elements['address']) form.elements['address'].value = user.address;
        }
    }

    // Xóa nội dung cũ để đảm bảo không có mục cứng
    orderItemsDisplay.innerHTML = ''; 

    if (cart.length > 0) {
        cart.forEach(item => {
            const orderItemDiv = document.createElement('div');
            orderItemDiv.classList.add('order-item');
            const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price);
            orderItemDiv.innerHTML = `
                <span>${item.name} * ${item.quantity}</span>
                <span>${priceFormatted}</span>
            `;
            orderItemsDisplay.appendChild(orderItemDiv);
        });
    } else {
        orderItemsDisplay.innerHTML = '<div class="order-item"><span>Không có sản phẩm trong giỏ hàng.</span></div>';
    }

    cartTotalDisplay.textContent = cartTotal;
});

// Xử lý nút ĐẶT HÀNG
document.querySelector('.btn-order').addEventListener('click', () => {
  const form = document.getElementById('checkout-form');

  const formData = new FormData(form);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const email = formData.get('email');
  const address = formData.get('address');
  const note = formData.get('note');
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const bank = payment === 'bank' ? document.getElementById('bank-account').value.trim() : '';

  if (!name || !phone || !address) {
    alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
    return;
  }

  const cartKey = getActiveCartKey();
  const cart = JSON.parse(localStorage.getItem(cartKey)) || JSON.parse(localStorage.getItem('cart')) || [];
  const total = localStorage.getItem('cartTotal') || '0₫';

  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi đặt hàng.");
    return;
  }

  const user = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
  const username = user ? (user.username || user.email || user.tailkhoan) : 'guest';

  const orderId = "HQ" + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const orderDate = now.toLocaleDateString('vi-VN') + " " + now.toLocaleTimeString('vi-VN');

  // Xây dựng đối tượng order
  const order = {
    id: orderId,
    username: username,
    date: orderDate,
    name: name,
    phone: phone,
    email: email,
    address: address,
    note: note,
    payment: payment === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng' : 'Thanh toán qua chuyển khoản ngân hàng', 
    bank: bank,
    status: 'Chờ xác nhận',
    cart: cart,
    total: total
  };

  // Lưu thông tin hóa đơn cho trang in hóa đơn
  localStorage.setItem('invoiceData', JSON.stringify(order));

  // Lưu đơn hàng vào danh sách đơn hàng đã đặt
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.unshift(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Làm trống giỏ hàng của tài khoản sau khi đặt hàng thành công
  localStorage.removeItem(cartKey);
  localStorage.removeItem('cart');
  localStorage.removeItem('cart_guest');
  localStorage.removeItem('cartTotal');

  alert(`Đặt hàng thành công! Mã đơn hàng của bạn là: #${orderId}. Đang chuyển đến trang in hóa đơn...`);

  // Chuyển đến in hóa đơn
  window.location.href = 'inhoadon.html';
});
