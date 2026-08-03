/* ==========================================
   MH PARVEZ PORTFOLIO - GOOGLE SHEETS BACKEND
========================================== */

const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKtX4pSnCjRVBB4Dq25f2Zgp-MK-TaueGyqg-sQCLlV4k2iBJmmLmtf16mO111QokNeHHPJd_f_HKB/pub?gid=0&single=true&output=tsv';

let portfolio = [];
const grid = document.querySelector(".portfolio-grid");

// Auto-convert Cloudinary links to pure .mp4 files
function formatVideoUrl(rawUrl) {
    if (!rawUrl) return '';
    
    if (rawUrl.includes('player.cloudinary.com')) {
        try {
            const urlObj = new URL(rawUrl);
            const cloudName = urlObj.searchParams.get('cloud_name');
            const publicId = urlObj.searchParams.get('public_id');
            if (cloudName && publicId) {
                return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp4`;
            }
        } catch(e) {
            return rawUrl;
        }
    }
    return rawUrl;
}

async function loadFromGoogleSheets() {
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        
        const rows = text.split('\n').slice(1); 
        
        portfolio = rows.map(row => {
            const columns = row.split('\t');
            let rawUrl = columns[2] ? columns[2].trim() : '';
            let thumbnailUrl = columns[3] ? columns[3].trim() : ''; 
            
            // NEW: Grab Column E (index 4) for the Featured True/False status
            let isFeatured = columns[4] ? columns[4].trim().toLowerCase() : 'false';
            
            return {
                title: columns[0] ? columns[0].trim() : '',
                category: columns[1] ? columns[1].trim() : '',
                embedUrl: formatVideoUrl(rawUrl), 
                thumbnailUrl: thumbnailUrl,
                featured: isFeatured === 'true' // Converts to boolean
            };
        }).filter(video => video.title !== '' && video.embedUrl !== '');
        
        // NEW: Load the 'All' tab by default when the site opens
        createCards("All");
    } catch (error) {
        console.error('Error fetching Google Sheet:', error);
    }
}

/* ==========================================
   PLAY VIDEO FUNCTION (Custom Button Logic)
========================================== */
window.playCustomVideo = function(button) {
    const container = button.closest('.video-container');
    const video = container.querySelector('video');
    
    // Hide the custom play button
    button.style.display = 'none';
    
    // Show the native controls (volume, fullscreen) and play
    video.setAttribute('controls', 'true');
    video.play();
};

/* ==========================================
   RENDER CARDS 
========================================== */
function createCards(categoryFilter = "All") {
    if (!grid) return;
    grid.innerHTML = "";

    let filteredVideos = [];

    // THE SMART LOGIC FOR 'FEATURED' OR 'ALL' TAB
    if (categoryFilter.toLowerCase() === "featured" || categoryFilter.toLowerCase() === "all") {
        filteredVideos = portfolio.filter(video => 
            video.featured === true && 
            video.category.toLowerCase() !== "documentary" // Blocks horizontal docs
        ).slice(0, 10); // Limits perfectly to 10 videos max

    } else {
        // STANDARD CATEGORY FILTERING (Real Estate, SaaS, etc.)
        filteredVideos = portfolio.filter(video => 
            video.category.toLowerCase() === categoryFilter.toLowerCase()
        );
    }

    // Render the selected videos
    filteredVideos.forEach(video => {
        grid.innerHTML += `
        <div class="portfolio-card">
            <div class="video-container">
                <!-- Notice: 'controls' is initially removed so it looks clean -->
                <!-- Download disabled and right-click blocked below -->
                <video preload="metadata" playsinline controlsList="nodownload" oncontextmenu="return false;" poster="${video.thumbnailUrl}">
                    <source src="${video.embedUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                
                <!-- YOUR NEW CUSTOM PLAY BUTTON -->
                <div class="custom-play-btn" onclick="playCustomVideo(this)">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="rgba(0,0,0,0.6)" />
                        <polygon points="40,30 40,70 70,50" fill="#ffffff" />
                    </svg>
                </div>

                <div class="watermark">Parvez Edits</div>
            </div>
            <div class="card-content">
                <div class="category">${video.category}</div>
                <h3>${video.title}</h3>
            </div>
        </div>
        `;
    });
}

/* ==========================================
   FILTER & ANIMATIONS
========================================== */
const buttons = document.querySelectorAll(".filter-buttons button");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        
        // Pass the inner text of the button (e.g., "Real Estate" or "All")
        createCards(button.innerText.trim());
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll("section").forEach(section => {
    section.classList.add("fade-up");
    observer.observe(section);
});

// Navbar Shrink Logic (Disabled on PC)
const navbar = document.querySelector('.navbar'); 
window.addEventListener('scroll', () => {
    // window.innerWidth < 1100 ensures it ONLY shrinks on mobile/tablets
    if (window.scrollY > 50 && window.innerWidth < 1100) {
        navbar.classList.add('shrink');
    } else {
        navbar.classList.remove('shrink');
    }
});

/* ==========================================
   INITIALIZE ON LOAD
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    loadFromGoogleSheets();
});
