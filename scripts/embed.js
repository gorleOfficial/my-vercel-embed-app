const params = new URLSearchParams(window.location.search);
const fav = params.get("fav") || "gorleofficial";
const quality = params.get("quality") || "sample";
const grid = document.querySelector('.image-grid');

let postsPerPage = 100;
const maxPages = 26; // Estimate based on how many favorites you expect (e.g. 20 pages × 100 = 2000 posts)

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function fetchFavorites() {
  let allPosts = [];

  try {
    // You can increase this loop count to fetch more pages
    for (let i = 0; i < 3; i++) {
      const page = Math.floor(Math.random() * maxPages) + 1;
      const response = await fetch(`https://e621.net/posts.json?tags=fav:${fav}&limit=${postsPerPage}&page=${page}`, {
        headers: {
          'User-Agent': 'my-e621-embed-app (by your_email_or_username@example.com)'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch page ${page}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.posts.length === 0) break;

      console.log(data.posts);

      if (data.posts != null)
      {
        allPosts = allPosts.concat(data.posts);
      }
      else
      {
        maxPages = page - 1;
        i--;
      }
    }

    //console.log(allPosts);

    shuffleArray(allPosts);

    const imageUrls = [];
    let i = 0;

    while (imageUrls.length < 4 && i < allPosts.length) {
      const post = allPosts[i];
      const file = post[quality] || post.sample || post.file;
      if (file?.url) {
        imageUrls.push({ url: file.url, id: post.id });
      }
      i++;
    }

    grid.style.gridTemplateColumns = Array(imageUrls.length).fill('1fr').join(' ');
    grid.offsetHeight;

    imageUrls.forEach((imgData, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper';

      const img = document.createElement('img');
      img.src = imgData.url;
      img.className = 'image-display';
      img.title = `Click to open #${imgData.id} in a new tab`;

      img.addEventListener('click', () => {
        window.open(`https://e621.net/posts/${imgData.id}`, '_blank');
      });

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

  } catch (err) {
    console.error("Error fetching data from e621:", err);
  }
}

fetchFavorites();
