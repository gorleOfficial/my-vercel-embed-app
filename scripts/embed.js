const imageUrls = [
  "https://static1.e621.net/data/sample/be/86/be86307f1480ec509736ce56a96e9dcb.jpg",
  "https://static1.e621.net/data/17/84/17841211d348093c856677d1d78483e4.gif",
  "https://static1.e621.net/data/sample/fc/12/fc12e6558f54d0193ba9abce9ee16154.jpg",
  "https://static1.e621.net/data/sample/a6/aa/a6aacbf6f631f97d2129c1f89e2b8ba3.jpg"
];

const grid = document.querySelector('.image-grid');

// Pre-apply and read initial layout to force transition to preload
grid.style.gridTemplateColumns = Array(imageUrls.length).fill('1fr').join(' ');
// Trigger a reflow by reading layout
grid.offsetHeight; // This forces the browser to apply styles

imageUrls.forEach((url, index) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'image-wrapper';

  const img = document.createElement('img');
  img.src = url;
  img.className = 'image-display';
  img.title = 'Hover to expand';

  img.addEventListener('mouseenter', () => {
    const cols = Array(imageUrls.length).fill('1fr');
    cols[index] = '2fr';
    grid.style.gridTemplateColumns = cols.join(' ');
  });

  img.addEventListener('mouseleave', () => {
    grid.style.gridTemplateColumns = Array(imageUrls.length).fill('1fr').join(' ');
  });

  wrapper.appendChild(img);
  grid.appendChild(wrapper);
});
