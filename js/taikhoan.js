// JAVASCRIPT CHO TRANG TÀI KHOẢN CỦA TÔI (UC-07/UC-09)

// Dữ liệu người dùng mặc định nếu chưa đăng nhập
const defaultUser = {
    username: "quandg",
    fullname: "Đặng Hồng Quân",
    email: "quandg@gmail.com",
    phone: "0938336601",
    address: "Trung Đạo, TT. Yên Mỹ, Hưng Yên",
    gender: "Nam",
    birthday: "2002-05-15",
    password: "123"
};

// Sổ địa chỉ mặc định
const defaultAddresses = [
    {
        id: "addr_1",
        name: "Đặng Hồng Quân",
        phone: "0938336601",
        detail: "Số 12, Thôn Trung Đạo, Thị trấn Yên Mỹ, Huyện Yên Mỹ, Hưng Yên",
        isDefault: true
    },
    {
        id: "addr_2",
        name: "Đặng Hồng Quân (Cơ quan)",
        phone: "0938336601",
        detail: "Trường Đại học Sư phạm Kỹ thuật Hưng Yên, Khoa CNTT, Cơ sở 1",
        isDefault: false
    }
];

// Lấy thông tin người dùng đang đăng nhập
function getCurrentUser() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        user = JSON.parse(localStorage.getItem('user'));
    }
    return user || null;
}

function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));

    // Cập nhật vào danh sách users chung nếu có
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => (u.username && u.username === user.username) || (u.email && u.email === user.email));
    if (index !== -1) {
        users[index] = { ...users[index], ...user };
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Lấy danh sách sổ địa chỉ theo từng tài khoản
function getAddresses() {
    const user = getCurrentUser();
    const storageKey = user ? `userAddresses_${(user.username || user.email || user.tailkhoan).toLowerCase().replace(/[^a-z0-9]/g, '_')}` : 'userAddresses_guest';
    let addresses = JSON.parse(localStorage.getItem(storageKey));
    if (!addresses || !Array.isArray(addresses)) {
        addresses = [
            {
                id: "addr_1",
                name: user ? (user.fullname || user.username) : "Đặng Hồng Quân",
                phone: user ? (user.phone || "0938336601") : "0938336601",
                detail: user ? (user.address || "Trung Đạo, TT. Yên Mỹ, Hưng Yên") : "Trung Đạo, TT. Yên Mỹ, Hưng Yên",
                isDefault: true
            }
        ];
        localStorage.setItem(storageKey, JSON.stringify(addresses));
    }
    return addresses;
}

function saveAddresses(addresses) {
    const user = getCurrentUser();
    const storageKey = user ? `userAddresses_${(user.username || user.email || user.tailkhoan).toLowerCase().replace(/[^a-z0-9]/g, '_')}` : 'userAddresses_guest';
    localStorage.setItem(storageKey, JSON.stringify(addresses));
}

// Đổ dữ liệu thông tin cá nhân vào form
function loadUserInfo() {
    const user = getCurrentUser();
    if (!user) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập trang quản lý tài khoản.');
        window.location.href = 'dangnhap.html';
        return;
    }

    document.getElementById('side-user-name').textContent = user.fullname || user.username || "Thành viên";
    document.getElementById('side-avatar-letter').textContent = (user.fullname || user.username || "U").charAt(0).toUpperCase();

    document.getElementById('profile-username').value = user.username || user.tailkhoan || "";
    document.getElementById('profile-fullname').value = user.fullname || "";
    document.getElementById('profile-email').value = user.email || "";
    document.getElementById('profile-phone').value = user.phone || "";
    document.getElementById('profile-address').value = user.address || "";
    document.getElementById('profile-birthday').value = user.birthday || "";

    const genderInputs = document.querySelectorAll('input[name="gender"]');
    genderInputs.forEach(input => {
        if (input.value === (user.gender || "Nam")) {
            input.checked = true;
        }
    });
}

// Render danh sách sổ địa chỉ
function renderAddresses() {
    const addresses = getAddresses();
    const container = document.getElementById('address-list-container');
    if (!container) return;

    if (addresses.length === 0) {
        container.innerHTML = '<p style="color: #777; font-style: italic;">Bạn chưa lưu địa chỉ giao hàng nào.</p>';
        return;
    }

    let html = '';
    addresses.forEach(addr => {
        const defaultBadge = addr.isDefault ? `<span class="default-badge">Mặc định</span>` : '';
        const setDefaultAction = !addr.isDefault 
            ? `<a onclick="setDefaultAddress('${addr.id}')">Thiết lập mặc định</a>` 
            : '';

        html += `
            <div class="address-card ${addr.isDefault ? 'default-card' : ''}">
                <div class="address-header">
                    <div>
                        <span class="address-name">${addr.name}</span>
                        <span class="address-phone"><i class='bx bx-phone'></i> ${addr.phone}</span>
                    </div>
                    ${defaultBadge}
                </div>
                <div class="address-detail">${addr.detail}</div>
                <div class="address-actions">
                    ${setDefaultAction}
                    <a class="delete" onclick="deleteAddress('${addr.id}')">Xóa</a>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Thiết lập địa chỉ mặc định
function setDefaultAddress(id) {
    let addresses = getAddresses();
    addresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
    }));
    saveAddresses(addresses);
    renderAddresses();
}

// Xóa địa chỉ
function deleteAddress(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này không?')) return;
    let addresses = getAddresses();
    addresses = addresses.filter(addr => addr.id !== id);
    if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
        addresses[0].isDefault = true;
    }
    saveAddresses(addresses);
    renderAddresses();
}

// Mở modal thêm địa chỉ mới
function openAddressModal() {
    document.getElementById('new-addr-name').value = '';
    document.getElementById('new-addr-phone').value = '';
    document.getElementById('new-addr-detail').value = '';
    document.getElementById('new-addr-default').checked = false;
    document.getElementById('addressModal').style.display = 'flex';
}

function closeAddressModal() {
    document.getElementById('addressModal').style.display = 'none';
}

// Lưu địa chỉ mới
function saveNewAddress() {
    const name = document.getElementById('new-addr-name').value.trim();
    const phone = document.getElementById('new-addr-phone').value.trim();
    const detail = document.getElementById('new-addr-detail').value.trim();
    const isDefault = document.getElementById('new-addr-default').checked;

    if (!name || !phone || !detail) {
        alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ chi tiết.');
        return;
    }

    let addresses = getAddresses();
    const newId = 'addr_' + Date.now();

    if (isDefault || addresses.length === 0) {
        addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }

    addresses.push({
        id: newId,
        name: name,
        phone: phone,
        detail: detail,
        isDefault: isDefault || addresses.length === 0
    });

    saveAddresses(addresses);
    closeAddressModal();
    renderAddresses();
    alert('Thêm địa chỉ thành công!');
}

// Xử lý thông báo
function showAlert(elementId, message, type = 'success') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.className = `alert-message alert-${type}`;
    el.textContent = message;
    el.style.display = 'block';

    setTimeout(() => {
        el.style.display = 'none';
    }, 4000);
}

// Đăng xuất
function handleLogout() {
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
window.handleLogout = handleLogout;

// Khởi tạo các sự kiện
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    renderAddresses();

    // Xử lý chuyển tab
    const menuLinks = document.querySelectorAll('.account-menu-item[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');

    menuLinks.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.getAttribute('data-tab');

            menuLinks.forEach(m => m.classList.remove('active'));
            item.classList.add('active');

            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `tab-${targetTab}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // Form Lưu thông tin cá nhân
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = document.getElementById('profile-fullname').value.trim();
            const email = document.getElementById('profile-email').value.trim();
            const phone = document.getElementById('profile-phone').value.trim();
            const address = document.getElementById('profile-address').value.trim();
            const birthday = document.getElementById('profile-birthday').value;
            const gender = document.querySelector('input[name="gender"]:checked')?.value || "Nam";

            if (!fullname || !email || !phone) {
                showAlert('profile-alert', 'Vui lòng nhập đầy đủ các trường bắt buộc (*)', 'danger');
                return;
            }

            const currentUser = getCurrentUser();
            currentUser.fullname = fullname;
            currentUser.email = email;
            currentUser.phone = phone;
            currentUser.address = address;
            currentUser.birthday = birthday;
            currentUser.gender = gender;

            saveCurrentUser(currentUser);
            loadUserInfo();
            showAlert('profile-alert', 'Cập nhật thông tin cá nhân thành công!', 'success');
        });
    }

    // Form Đổi mật khẩu
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const oldPass = document.getElementById('current-password').value;
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-password').value;

            const currentUser = getCurrentUser();
            const realCurrentPass = currentUser.password || currentUser.matkhau || "123";

            if (oldPass !== realCurrentPass) {
                showAlert('password-alert', 'Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại.', 'danger');
                return;
            }

            if (newPass.length < 8) {
                showAlert('password-alert', 'Mật khẩu mới phải có ít nhất 8 ký tự.', 'danger');
                return;
            }

            if (newPass !== confirmPass) {
                showAlert('password-alert', 'Mật khẩu nhập lại không trùng khớp.', 'danger');
                return;
            }

            currentUser.password = newPass;
            currentUser.matkhau = newPass;
            saveCurrentUser(currentUser);

            passwordForm.reset();
            showAlert('password-alert', 'Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.', 'success');
        });
    }

    // Đóng modal khi click ra ngoài vùng xám overlay
    const addrModal = document.getElementById('addressModal');
    if (addrModal) {
        addrModal.addEventListener('click', (e) => {
            if (e.target === addrModal) {
                closeAddressModal();
            }
        });
    }
});
