const params = new URLSearchParams(window.location.search);
const fav = params.get("fav") || "gorleofficial";
const quality = params.get("quality") || "sample";
const grid = document.querySelector('.image-grid');

// Number of posts to retrieve per page
const postsPerPage = 100;

// Function to fetch and display the images from e621
async function fetchFavorites() {
  let allPosts = [];
  let page = 1;

  try {
    // Keep fetching pages until we have enough images
    while (allPosts.length < 4) {
      const response = await fetch(`https://e621.net/posts.json?tags=fav:${fav}&limit=${postsPerPage}&page=${page}`, {
        headers: {
          'User-Agent': 'my-e621-embed-app (by your_username_or_email@example.com)'
        }
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      const posts = data.posts || [];

      if (posts.length === 0) {
        console.warn("No more posts found.");
        break;  // No more posts, stop the loop
      }

      // Add posts to allPosts
      allPosts = allPosts.concat(posts);

      // Increment page for the next request
      page++;
    }

    // Randomize the order of posts to ensure variability
    shuffleArray(allPosts);

    // Filter posts to ensure only those with valid image URLs are included
    const imageUrls = [];
    let i = 0;

    // Loop through posts until we have 4 valid images
    while (imageUrls.length < 4 && i < allPosts.length) {
      const post = allPosts[i];
      const file = post[quality] || post.sample || post.file;
      if (file?.url) {
        imageUrls.push({ url: file.url, id: post.id });
      }
      i++;
    }

    // If not enough valid images were found, log a warning
    if (imageUrls.length < 4) {
      console.warn("Only found", imageUrls.length, "valid images.");
    }

    // Pre-apply and read layout to preload transition
    grid.style.gridTemplateColumns = Array(imageUrls.length).fill('1fr').join(' ');
    grid.offsetHeight; // force reflow

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

// Function to shuffle the array randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

fetchFavorites();
