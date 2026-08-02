/* ==========================================
   MH PARVEZ PORTFOLIO - GOOGLE SHEETS BACKEND
========================================== */

const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKtX4pSnCjRVBB4Dq25f2Zgp-MK-TaueGyqg-sQCLlV4k2iBJmmLmtf16mO111QokNeHHPJd_f_HKB/pub?gid=0&single=true&output=tsv';

let portfolio = [];
const grid = document.querySelector(".portfolio-grid");

async function loadFromGoogleSheets() {
    try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        
        const rows = text.split('\n').slice(1); 
        
        portfolio = rows.map(row => {
            const columns = row.split('\t');
            let embedUrl = columns[2] ? columns[2].trim() : '';
            
            return {
                title: columns[0] ? columns[0].trim() : '',
                category: columns[1] ? columns[1].trim() : '',
                embedUrl: embedUrl
            };
        }).filter(video => video.title !== '' && video.embedUrl !== '');
        
        createCards();
    } catch (error) {
        console.error('Error fetching Google Sheet:', error);
    }
}

/* ==========================================
   RENDER CARDS (Using working iframes)
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
   SCROLL ANIMATION & NAVBAR SHRINK
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

// Shrinking Header Logic
const navbar = document.querySelector('.navbar'); 
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
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
