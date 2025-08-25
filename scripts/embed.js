const params = new URLSearchParams(window.location.search);
const fav = params.get("fav") || "gorleofficial";
const quality = params.get("quality") || "sample";
const rows = /**parseInt(params.get("rows")) || **/1;
const columns = parseInt(params.get("columns")) || 4;
const grid = document.querySelector('.image-grid');

async function fetchFavorites() {
    const totalImages = rows * columns;
    const imageUrls = [];
    const seenIds = new Set();

    try {
        while (imageUrls.length < totalImages) {
            const need = totalImages - imageUrls.length;

            const response = await fetch(
                `https://e621.net/posts.json?tags=fav:${fav}+order:random&limit=${need}`, 
                {
                    headers: {
                        'User-Agent': 'my-e621-embed-app (by your_email_or_username@example.com)'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch favorites: ${response.statusText}`);
            }

            const data = await response.json();
            const posts = data.posts ?? [];

            for (const post of posts) {
                if (seenIds.has(post.id)) continue;

                let url;
                if (quality === "sample") url = post.sample?.url;
                else if (quality === "preview") url = post.preview?.url;
                else url = post.file?.url;

                if (url) {
                    seenIds.add(post.id);
                    imageUrls.push({ url, id: post.id });
                }

                if (imageUrls.length >= totalImages) break;
            }

            // safety: break if API gave nothing new
            if (posts.length === 0) break;
        }

        // enforce grid layout
        while (imageUrls.length < totalImages && i < allPosts.length) {
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
            cols[index] = '3fr';
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
