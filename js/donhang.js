// JAVASCRIPT CHO TRANG ĐƠN HÀNG CỦA TÔI (THEO DÕI ĐƠN HÀNG - UC-04)

// Dữ liệu đơn hàng mẫu ban đầu nếu localStorage chưa có
const defaultSampleOrders = [
    {
        id: "HQ928314",
        date: "20/11/2026 14:30:15",
        name: "Đặng Hồng Quân",
        phone: "0938336601",
        email: "quandg@gmail.com",
        address: "Trung Đạo, TT. Yên Mỹ, Hưng Yên",
        note: "Giao trong giờ hành chính",
        payment: "Thanh toán tiền mặt khi nhận hàng (COD)",
        status: "Chờ xác nhận",
        total: "50.000.000₫",
        cart: [
            {
                id: "vinf01",
                name: "VinFast THEON S",
                price: 50000000,
                quantity: 1,
                image: "img/vinf/theon-s-1.jpg"
            }
        ]
    },
    {
        id: "HQ812049",
        date: "15/10/2026 09:15:00",
        name: "Đặng Hồng Quân",
        phone: "0938336601",
        email: "quandg@gmail.com",
        address: "Trung Đạo, TT. Yên Mỹ, Hưng Yên",
        note: "Gọi trước khi giao 30 phút",
        payment: "Thanh toán qua chuyển khoản ngân hàng",
        status: "Đã hoàn thành",
        total: "46.900.000₫",
        cart: [
            {
                id: "honda05",
                name: "HONDA WINNER X 150",
                price: 46900000,
                quantity: 1,
                image: "img/honda/winner-x-1.jpg"
            }
        ]
    }
];

// Khởi tạo và lấy danh sách đơn hàng theo tài khoản đang đăng nhập
function getAllStoredOrders() {
    let orders = JSON.parse(localStorage.getItem('orders'));
    if (!orders || !Array.isArray(orders)) {
        orders = defaultSampleOrders;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    return orders;
}

function getOrders() {
    const allOrders = getAllStoredOrders();
    const user = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
    
    // Nếu chưa đăng nhập, trả về mảng rỗng
    if (!user) {
        return [];
    }

    const currentUsername = (user.username || user.tailkhoan || '').toLowerCase();
    const currentEmail = (user.email || '').toLowerCase();
    const currentPhone = (user.phone || '').trim();

    return allOrders.filter(o => {
        const oUser = (o.username || '').toLowerCase();
        const oEmail = (o.email || '').toLowerCase();
        const oPhone = (o.phone || '').trim();

        if (currentUsername && oUser === currentUsername) return true;
        if (currentEmail && oEmail === currentEmail) return true;
        if (currentPhone && oPhone && currentPhone === oPhone) return true;

        // Nếu là tài khoản mẫu quandg, hiển thị các đơn mẫu
        if ((currentUsername === 'quandg' || currentEmail === 'quandg@gmail.com') && (!o.username || o.username === 'quandg')) {
            return true;
        }

        return false;
    });
}

function saveOrders(updatedOrders) {
    let allOrders = getAllStoredOrders();
    updatedOrders.forEach(uOrder => {
        const idx = allOrders.findIndex(o => o.id === uOrder.id);
        if (idx !== -1) {
            allOrders[idx] = uOrder;
        } else {
            allOrders.unshift(uOrder);
        }
    });
    localStorage.setItem('orders', JSON.stringify(allOrders));
}

// Format tiền tệ
function formatCurrency(amount) {
    if (typeof amount === 'number') {
        return amount.toLocaleString('vi-VN') + '₫';
    }
    if (typeof amount === 'string' && amount.includes('₫')) {
        return amount;
    }
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('vi-VN') + '₫';
}

// Lấy class và icon tương ứng theo trạng thái
function getStatusBadge(status) {
    switch (status) {
        case 'Chờ xác nhận':
            return `<span class="status-badge status-pending"><i class='bx bx-time-five'></i> Chờ xác nhận</span>`;
        case 'Đang giao hàng':
            return `<span class="status-badge status-shipping"><i class='bx bx-trip'></i> Đang giao hàng</span>`;
        case 'Đã hoàn thành':
            return `<span class="status-badge status-completed"><i class='bx bx-check-circle'></i> Đã hoàn thành</span>`;
        case 'Đã hủy':
            return `<span class="status-badge status-cancelled"><i class='bx bx-x-circle'></i> Đã hủy</span>`;
        default:
            return `<span class="status-badge">${status}</span>`;
    }
}

// Cập nhật số lượng trên các tab
function updateTabCounts(orders) {
    const counts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'Chờ xác nhận').length,
        shipping: orders.filter(o => o.status === 'Đang giao hàng').length,
        completed: orders.filter(o => o.status === 'Đã hoàn thành').length,
        cancelled: orders.filter(o => o.status === 'Đã hủy').length,
    };

    const countAll = document.getElementById('count-all');
    const countPending = document.getElementById('count-pending');
    const countShipping = document.getElementById('count-shipping');
    const countCompleted = document.getElementById('count-completed');
    const countCancelled = document.getElementById('count-cancelled');

    if (countAll) countAll.textContent = counts.all;
    if (countPending) countPending.textContent = counts.pending;
    if (countShipping) countShipping.textContent = counts.shipping;
    if (countCompleted) countCompleted.textContent = counts.completed;
    if (countCancelled) countCancelled.textContent = counts.cancelled;
}

// Biến lưu trạng thái lọc hiện tại
let currentFilter = 'all';
let currentSearch = '';

// Render danh sách đơn hàng ra giao diện
function renderOrders() {
    const allOrders = getOrders();
    updateTabCounts(allOrders);

    let filtered = allOrders;

    // Lọc theo tab
    if (currentFilter === 'pending') {
        filtered = filtered.filter(o => o.status === 'Chờ xác nhận');
    } else if (currentFilter === 'shipping') {
        filtered = filtered.filter(o => o.status === 'Đang giao hàng');
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(o => o.status === 'Đã hoàn thành');
    } else if (currentFilter === 'cancelled') {
        filtered = filtered.filter(o => o.status === 'Đã hủy');
    }

    // Lọc theo từ khóa tìm kiếm
    if (currentSearch.trim() !== '') {
        const query = currentSearch.trim().toLowerCase();
        filtered = filtered.filter(o => {
            const matchId = o.id && o.id.toLowerCase().includes(query);
            const matchPhone = o.phone && o.phone.toLowerCase().includes(query);
            const matchItem = o.cart && o.cart.some(item => item.name && item.name.toLowerCase().includes(query));
            return matchId || matchPhone || matchItem;
        });
    }

    const container = document.getElementById('orders-list-container');
    const emptyState = document.getElementById('order-empty-state');

    if (!filtered || filtered.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    let html = '';

    filtered.forEach(order => {
        let itemsHtml = '';
        if (order.cart && Array.isArray(order.cart)) {
            order.cart.forEach(item => {
                const itemImg = item.image || 'img/motorcycle.png';
                itemsHtml += `
                    <div class="order-item-row">
                        <img src="${itemImg}" alt="${item.name}" class="order-item-img" onerror="this.src='img/motorcycle.png'">
                        <div class="order-item-detail">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-qty">Số lượng: x${item.quantity}</div>
                        </div>
                        <div class="order-item-price">${formatCurrency(item.price)}</div>
                    </div>
                `;
            });
        }

        // Kiểm tra nút hủy đơn: chỉ hủy được khi đang ở trạng thái 'Chờ xác nhận' (quy tắc UC-04)
        let cancelBtn = '';
        if (order.status === 'Chờ xác nhận') {
            cancelBtn = `<button class="btn-order-action btn-order-cancel" onclick="cancelOrder('${order.id}')">
                <i class='bx bx-x'></i> Hủy đơn
            </button>`;
        }

        html += `
            <div class="order-card" id="card-${order.id}">
                <div class="order-card-header">
                    <div class="order-info-left">
                        <span class="order-id">Mã đơn: #${order.id}</span>
                        <span class="order-date"><i class='bx bx-calendar'></i> ${order.date || 'Gần đây'}</span>
                    </div>
                    <div>
                        ${getStatusBadge(order.status)}
                    </div>
                </div>

                <div class="order-card-body">
                    ${itemsHtml}
                </div>

                <div class="order-card-footer">
                    <div class="order-total-box">
                        <span class="order-total-label">Tổng thanh toán:</span>
                        <span class="order-total-price">${order.total}</span>
                    </div>
                    <div class="order-actions">
                        ${cancelBtn}
                        <button class="btn-order-action btn-order-print" onclick="reprintOrder('${order.id}')">
                            <i class='bx bx-printer'></i> In hóa đơn
                        </button>
                        <button class="btn-order-action btn-order-detail" onclick="openOrderDetail('${order.id}')">
                            <i class='bx bx-info-circle'></i> Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Xử lý Hủy đơn hàng (UC-04: chỉ khi đơn đang ở trạng thái 'Chờ xác nhận')
function cancelOrder(orderId) {
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không?`)) {
        return;
    }

    const orders = getOrders();
    const target = orders.find(o => o.id === orderId);

    if (target) {
        if (target.status !== 'Chờ xác nhận') {
            alert('Đơn hàng đã được xác nhận hoặc đang giao, không thể hủy trực tiếp! Vui lòng liên hệ cửa hàng.');
            return;
        }

        target.status = 'Đã hủy';
        saveOrders(orders);
        alert(`Đơn hàng #${orderId} đã được hủy thành công.`);
        renderOrders();
    }
}

// Xem chi tiết đơn hàng (Mở modal)
function openOrderDetail(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('modal-order-id').textContent = '#' + order.id;
    document.getElementById('modal-order-date').textContent = order.date || '';
    document.getElementById('modal-order-status').innerHTML = getStatusBadge(order.status);
    document.getElementById('modal-cust-name').textContent = order.name || '';
    document.getElementById('modal-cust-phone').textContent = order.phone || '';
    document.getElementById('modal-cust-email').textContent = order.email || 'Không có';
    document.getElementById('modal-cust-address').textContent = order.address || '';
    document.getElementById('modal-cust-note').textContent = order.note || 'Không có ghi chú';
    document.getElementById('modal-cust-payment').textContent = order.payment || 'Tiền mặt';
    document.getElementById('modal-order-total').textContent = order.total;

    let itemsHtml = '';
    if (order.cart && Array.isArray(order.cart)) {
        order.cart.forEach((item, index) => {
            const subtotal = (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
            itemsHtml += `
                <div class="order-item-row">
                    <img src="${item.image || 'img/motorcycle.png'}" class="order-item-img" onerror="this.src='img/motorcycle.png'">
                    <div class="order-item-detail">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-qty">Số lượng: x${item.quantity} | Đơn giá: ${formatCurrency(item.price)}</div>
                    </div>
                    <div class="order-item-price">${formatCurrency(subtotal)}</div>
                </div>
            `;
        });
    }
    document.getElementById('modal-items-container').innerHTML = itemsHtml;

    document.getElementById('orderDetailModal').style.display = 'flex';
}

function closeOrderDetail() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

// In lại hóa đơn
function reprintOrder(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
        localStorage.setItem('invoiceData', JSON.stringify(order));
        window.open('inhoadon.html', '_blank');
    }
}

// Gắn sự kiện khi DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Xử lý chuyển tab
    const tabButtons = document.querySelectorAll('.order-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-status');
            renderOrders();
        });
    });

    // Tìm kiếm đơn hàng
    const searchInput = document.getElementById('order-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            renderOrders();
        });
    }

    // Đóng modal khi click ra ngoài
    const modal = document.getElementById('orderDetailModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeOrderDetail();
            }
        });
    }

    renderOrders();
});
