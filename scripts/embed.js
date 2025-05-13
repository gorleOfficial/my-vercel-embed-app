const images = document.querySelectorAll('.image-grid img');

images.forEach((img) => {
  img.addEventListener('click', () => {
    images.forEach(i => i.style.flex = '1');
    img.style.flex = '2';
  });
});
