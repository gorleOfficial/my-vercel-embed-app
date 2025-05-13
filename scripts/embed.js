const imageUrls = [
  "https://static1.e621.net/data/sample/be/86/be86307f1480ec509736ce56a96e9dcb.jpg",
  "https://static1.e621.net/data/17/84/17841211d348093c856677d1d78483e4.gif",
  "https://static1.e621.net/data/sample/fc/12/fc12e6558f54d0193ba9abce9ee16154.jpg",
  "https://static1.e621.net/data/sample/a6/aa/a6aacbf6f631f97d2129c1f89e2b8ba3.jpg"
];

const grid = document.querySelector('.image-grid');

imageUrls.forEach(url => {
  const img = document.createElement('img');
  img.src = url;
  img.className = 'image-display';
  img.title = 'Click to expand';
  img.addEventListener('click', () => {
    // Toggle expanded class
    const expanded = img.classList.contains('expanded');
    document.querySelectorAll('.image-display').forEach(el => el.classList.remove('expanded'));
    grid.classList.toggle('expanding', !expanded);
    if (!expanded) {
      img.classList.add('expanded');
    } else {
      grid.classList.remove('expanding');
    }
  });
  grid.appendChild(img);
});
