// JAVASCRIPT ĐỒNG BỘ TRẠNG THÁI TÀI KHOẢN VÀ MENU HEADER TRÊN TOÀN BỘ WEBSITE

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('user'));
}

function headerLogout(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        localStorage.removeItem('cart_guest');
        localStorage.removeItem('cartTotal');
        alert('Đã đăng xuất thành công!');
        window.location.href = 'Home.html';
    }
}
window.headerLogout = headerLogout;

function initHeaderAuth() {
    const user = getLoggedInUser();
    const searchTienIch = document.querySelector('.search-tienich');
    if (!searchTienIch) return;

    // 1. Chuyển đổi icon yeuthich.html (nếu còn) thành donhang.html
    const heartLink = searchTienIch.querySelector('a[href*="yeuthich"]');
    if (heartLink) {
        heartLink.href = 'donhang.html';
        heartLink.title = 'Đơn hàng của tôi';
        heartLink.innerHTML = "<i class='bx bx-package'></i>";
    } else {
        // Đảm bảo có icon đơn hàng nếu chưa có
        const hasOrderLink = searchTienIch.querySelector('a[href*="donhang"]');
        if (!hasOrderLink) {
            const cartLink = searchTienIch.querySelector('a[href*="giohang"]');
            if (cartLink) {
                const orderLink = document.createElement('a');
                orderLink.href = 'donhang.html';
                orderLink.className = 'icon-link';
                orderLink.title = 'Đơn hàng của tôi';
                orderLink.innerHTML = "<i class='bx bx-package'></i>";
                cartLink.insertAdjacentElement('afterend', orderLink);
            }
        }
    }

    // 2. Tìm icon user
    let userLink = searchTienIch.querySelector('a[href*="dangnhap"], a[href*="taikhoan"]');
    if (!userLink) {
        userLink = searchTienIch.querySelector('a.icon-link:last-child');
    }

    if (!userLink) return;

    // Nếu đã bọc trong user-menu-wrapper rồi thì không bọc lại
    if (userLink.parentElement && userLink.parentElement.classList.contains('user-menu-wrapper')) {
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'user-menu-wrapper';

    if (user) {
        // NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP
        const displayName = user.fullname || user.username || user.tailkhoan || "Tài khoản";
        
        wrapper.innerHTML = `
            <a href="taikhoan.html" class="icon-link" title="Tài khoản: ${displayName}">
                <i class='bx bx-user'></i>
                <span class="user-logged-badge" title="Đã đăng nhập"></span>
            </a>
            <div class="user-dropdown">
                <div class="user-dropdown-header">
                    <span class="greeting">Xin chào,</span>
                    <span class="name">${displayName}</span>
                </div>
                <a href="taikhoan.html" class="user-dropdown-item">
                    <i class='bx bx-user-circle'></i> Tài khoản của tôi
                </a>
                <a href="donhang.html" class="user-dropdown-item">
                    <i class='bx bx-package'></i> Đơn hàng của tôi
                </a>
                <div class="user-dropdown-divider"></div>
                <a href="javascript:void(0)" onclick="headerLogout(event)" class="user-dropdown-item logout-item">
                    <i class='bx bx-log-out'></i> Đăng xuất
                </a>
            </div>
        `;
    } else {
        // NGƯỜI DÙNG CHƯA ĐĂNG NHẬP
        wrapper.innerHTML = `
            <a href="dangnhap.html" class="icon-link" title="Đăng nhập / Đăng ký">
                <i class='bx bx-user'></i>
            </a>
            <div class="user-dropdown">
                <div class="user-dropdown-header">
                    <span class="greeting">Tài khoản</span>
                    <span class="name" style="color: #555; font-size: 13px;">Chưa đăng nhập</span>
                </div>
                <a href="dangnhap.html" class="user-dropdown-item">
                    <i class='bx bx-log-in'></i> Đăng nhập
                </a>
                <a href="dangky.html" class="user-dropdown-item">
                    <i class='bx bx-user-plus'></i> Đăng ký tài khoản
                </a>
            </div>
        `;
    }

    userLink.replaceWith(wrapper);
}

// Chạy khi DOM đã sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderAuth);
} else {
    initHeaderAuth();
}
