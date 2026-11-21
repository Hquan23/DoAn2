const imageList = [
    'img/vinf/theon-s-1.jpg',
    'img/vinf/theon-s-2.jpg',
    'img/vinf/theon-s-3.jpg'
  ];
  let current = 0;

   function change_img(index) {
    current = index;
    // đổi ảnh lớn
    document.getElementById('main-img').src = imageList[index];
   // cập nhật trạng thái viền ảnh nhỏ
    const thumbs = document.querySelectorAll('.sidebar img');
    thumbs.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
  }

   document.querySelector('.btn-left').addEventListener('click', () => {
    const newIndex = (current - 1 + imageList.length) % imageList.length;
    change_img(newIndex);
  });

  // Sự kiện nút phải
  document.querySelector('.btn-right').addEventListener('click', () => {
    const newIndex = (current + 1) % imageList.length;
    change_img(newIndex);
  });
    // đặt ảnh đầu tiên active mặc định
  window.onload = () => {
     change_img(0);
  };