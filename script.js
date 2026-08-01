/* ==========================================
   MH PARVEZ PORTFOLIO
========================================== */

const portfolio = [
    /* ========= DOCUMENTARY ========= */
    {
        title: "Saudi Arabia Documentary",
        category: "Documentary",
        embedUrl: "https://www.youtube.com/embed/Z_3pP92QwRQ"
    },
    {
        title: "Siberia Urban Survival",
        category: "Documentary",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    {
        title: "Turkey Documentary",
        category: "Documentary",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    /* ========= TALKING HEAD ========= */
    {
        title: "Personal Brand Reel",
        category: "Talking Head",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    {
        title: "Business Coach Reel",
        category: "Talking Head",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    /* ========= SAAS ========= */
    {
        title: "SaaS Product Demo",
        category: "SaaS",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    {
        title: "Landing Page Promo",
        category: "SaaS",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    /* ========= CRYPTO ========= */
    {
        title: "Crypto Explainer",
        category: "Crypto",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    /* ========= REAL ESTATE ========= */
    {
        title: "Luxury House Tour",
        category: "Real Estate",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    /* ========= EDUCATIONAL ========= */
    {
        title: "Educational Video",
        category: "Educational",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    /* ========= PODCAST ========= */
    {
        title: "Podcast Highlight",
        category: "Podcast",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    },
    /* ========= MEDICAL ========= */
    {
        title: "Medical Explainer",
        category: "Medical",
        embedUrl: "https://www.youtube.com/embed/YOUR_SHORT_ID"
    }
];

/* ========================================== */

const grid = document.querySelector(".portfolio-grid");

function createCards(category="All"){
    grid.innerHTML="";

    portfolio
    .filter(video=>category==="All" || video.category===category)
    .forEach(video=>{
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

createCards();

/* ==========================================
FILTER
========================================== */
const buttons = document.querySelectorAll(".filter-buttons button");

buttons.forEach(button=>{
    button.addEventListener("click", ()=>{
        buttons.forEach(btn=>btn.classList.remove("active"));
        button.classList.add("active");
        createCards(button.innerText);
    });
});

/* ==========================================
SCROLL ANIMATION
========================================== */
const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll("section").forEach(section=>{
    section.classList.add("fade-up");
    observer.observe(section);
});