/* ==========================================
   MH PARVEZ PORTFOLIO - GOOGLE SHEETS BACKEND
========================================== */

// Your live Google Sheets TSV Link
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKtX4pSnCjRVBB4Dq25f2Zgp-MK-TaueGyqg-sQCLlV4k2iBJmmLmtf16mO111QokNeHHPJd_f_HKB/pub?gid=0&single=true&output=tsv';

let portfolio = [];
const grid = document.querySelector(".portfolio-grid");

// Automatic URL Converter for YouTube and Google Drive
function formatEmbedUrl(rawUrl) {
    if (!rawUrl) return '';
    
    // 1. Convert YouTube (youtu.be/ID or watch?v=ID)
    if (rawUrl.includes('youtu.be/')) {
        const videoId = rawUrl.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    if (rawUrl.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(rawUrl).search);
        return `https://www.youtube.com/embed/${urlParams.get('v')}`;
    }
    
    // 2. Convert Google Drive (drive.google.com/file/d/ID/view)
    if (rawUrl.includes('drive.google.com/file/d/')) {
        const fileId = rawUrl.split('/file/d/')[1].split('/')[0];
        return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    // Return as-is if already formatted
    return rawUrl;
}

// Fetch data from Google Sheets
async function loadFromGoogleSheets() {
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        
        // Split text by rows and skip the header row
        const rows = text.split('\n').slice(1); 
        
        portfolio = rows.map(row => {
            const columns = row.split('\t');
            let rawUrl = columns[2] ? columns[2].trim() : '';
            
            return {
                title: columns[0] ? columns[0].trim() : '',
                category: columns[1] ? columns[1].trim() : '',
                embedUrl: formatEmbedUrl(rawUrl)
            };
        }).filter(video => video.title !== '' && video.embedUrl !== '');
        
        createCards();
    } catch (error) {
        console.error('Error fetching Google Sheet:', error);
    }
}

/* ==========================================
   RENDER CARDS (Design Intact)
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
                    <iframe 
                        src="${video.embedUrl}" 
                        title="${video.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        loading="lazy">
                    </iframe>
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
