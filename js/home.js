let current = 0;
const totalSlides = document.querySelectorAll('.slide-img img').length;
// Lưu slide container để tái sử dụng
const slideImg = document.querySelector('.slide-img');
let autoSlide = setInterval(nextSlide, 4000); // bắt đầu auto slide

// Chuyển sang slide kế tiếp
function nextSlide() {
  current = (current + 1) % totalSlides;
  slideImg.style.transform = `translateX(-${current * 100}vw)`;
}

// Di chuyển đến slide cụ thể
function goToSlide(index) {
  slideImg.style.transform = `translateX(-${index * 100}vw)`;
}

// Dừng slide tự động và khởi động lại sau timeout
function resetAutoSlide() {
  clearInterval(autoSlide); // dừng trượt tự động
  autoSlide = setInterval(nextSlide, 4000); // khởi động lại sau 4s
}

// Sự kiện nút trái
document.querySelector('.btn-left').addEventListener('click', () => {
  current = (current - 1 + totalSlides) % totalSlides;
  goToSlide(current);
  resetAutoSlide();
});

// Sự kiện nút phải
document.querySelector('.btn-right').addEventListener('click', () => {
  current = (current + 1) % totalSlides;
  goToSlide(current);
  resetAutoSlide();
});