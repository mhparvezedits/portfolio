/* ==========================================
   MH PARVEZ PORTFOLIO - GOOGLE SHEETS BACKEND
========================================== */

// Your live Google Sheets TSV Link
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKtX4pSnCjRVBB4Dq25f2Zgp-MK-TaueGyqg-sQCLlV4k2iBJmmLmtf16mO111QokNeHHPJd_f_HKB/pub?gid=0&single=true&output=tsv';

let portfolio = [];
const grid = document.querySelector(".portfolio-grid");

// Fetch data from Google Sheets
async function loadFromGoogleSheets() {
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        
        // Split text by rows and skip the header row
        const rows = text.split('\n').slice(1); 
        
        portfolio = rows.map(row => {
            const columns = row.split('\t');
            let embedUrl = columns[2] ? columns[2].trim() : '';
            let thumbnailUrl = columns[3] ? columns[3].trim() : '';
            
            return {
                title: columns[0] ? columns[0].trim() : '',
                category: columns[1] ? columns[1].trim() : '',
                embedUrl: embedUrl,
                thumbnailUrl: thumbnailUrl
            };
        }).filter(video => video.title !== '' && video.embedUrl !== '');
        
        createCards();
    } catch (error) {
        console.error('Error fetching Google Sheet:', error);
    }
}

/* ==========================================
   RENDER CARDS (HTML5 Video & Custom Thumbnail)
========================================== */
function createCards(categoryFilter = "All") {
    if (!grid) return;
    grid.innerHTML = "";

    portfolio
        .filter(video => categoryFilter === "All" || video.category === categoryFilter)
        .forEach(video => {
            grid.innerHTML += `
            <div class="portfolio-card">
                <div class="video-container">
                    <video controls preload="metadata" playsinline poster="${video.thumbnailUrl}">
                        <source src="${video.embedUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <!-- THIS IS YOUR WATERMARK -->
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
   FILTER
========================================== */
const buttons = document.querySelectorAll(".filter-buttons button");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        createCards(button.innerText);
    });
});

/* ==========================================
   SCROLL ANIMATION
========================================== */
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

/* ==========================================
   INITIALIZE ON LOAD
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    loadFromGoogleSheets();
});
