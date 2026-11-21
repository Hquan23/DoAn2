window.onload = () => {
  // Hàm hỗ trợ định dạng tiền tệ
  function formatCurrency(amount) {
    if (typeof amount === 'string') {
      amount = parseFloat(amount.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0;
    }
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  // Hiển thị ngày tháng
  const n = new Date();
  const y = n.getFullYear();
  const m = n.getMonth() + 1;
  const d = n.getDate();
  const dateEl = document.getElementById('date');
  if (dateEl) {
    dateEl.textContent = `Ngày ${d} tháng ${m} năm ${y}`;
  }

  const invoice = JSON.parse(localStorage.getItem('invoiceData'));

  if (!invoice) {
    document.body.innerHTML = '<p style="text-align:center; padding: 20px;">Không có dữ liệu hóa đơn để hiển thị. Vui lòng đặt hàng trước.</p>';
    return;
  }

  // Điền thông tin khách hàng và thông tin chung
  document.getElementById('inv-name').textContent = invoice.name || '';
  document.getElementById('inv-phone').textContent = invoice.phone || '';
  document.getElementById('inv-email').textContent = invoice.email || '';
  document.getElementById('inv-address').textContent = invoice.address || '';
  document.getElementById('inv-note').textContent = invoice.note || '';

  // Hiển thị tên phương thức thanh toán dạng dễ đọc
  let paymentText = '';
  switch (invoice.payment) {
    case 'cod':
      paymentText = 'Thanh toán tiền mặt khi nhận hàng';
      break;
    case 'bank':
      paymentText = 'Thanh toán qua chuyển khoản ngân hàng';
      break;
    default:
      paymentText = invoice.payment || '';
  }
  document.getElementById('inv-payment').textContent = paymentText;

  // Xử lý hiển thị số tài khoản ngân hàng
  const invBankLabel = document.getElementById('inv-bank-label');
  const invBankSpan = document.getElementById('inv-bank');
  if (invoice.payment === 'bank') {
    if (invBankSpan) invBankSpan.textContent = invoice.bank || '';
    if (invBankLabel) invBankLabel.style.display = 'block';
  } else {
    if (invBankLabel) invBankLabel.style.display = 'none';
  }

  // Điền chi tiết đơn hàng vào bảng (<tbody>)
  const detailTableBody = document.getElementById('inv-detail');
  detailTableBody.innerHTML = '';

  let stt = 1;
  if (invoice.cart && Array.isArray(invoice.cart) && invoice.cart.length > 0) {
    invoice.cart.forEach(item => {
      const row = document.createElement('tr');
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      const itemTotalPrice = itemPrice * itemQuantity;

      row.innerHTML = `
          <td>${stt++}</td>
          <td>${item.name || ''}</td>
          <td>${itemQuantity}</td>
          <td>${formatCurrency(itemPrice)}</td>
          <td>${formatCurrency(itemTotalPrice)}</td>
      `;
      detailTableBody.appendChild(row);
    });
  } else {
    const noItemsRow = document.createElement('tr');
    noItemsRow.innerHTML = `<td colspan="5" style="text-align: center; padding: 10px;">Không có sản phẩm nào trong đơn hàng.</td>`;
    detailTableBody.appendChild(noItemsRow);
  }

  // Hiển thị tổng tiền
  document.getElementById('inv-total').textContent = formatCurrency(invoice.total || 0);

  // Hiển thị hóa đơn
  const invoiceEl = document.getElementById('invoice');
  if (invoiceEl) invoiceEl.style.display = 'block';

  // Mở hộp thoại in
  window.print();
};