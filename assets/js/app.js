import { updateContent, changeLanguage, initLanguageSelector, getDefaultLanguage } from './languageUtils.js';
import { langData } from './translations.js';

async function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
}

async function loadRandomScreenshots() {
    const wrapper = document.getElementById('screenshot-wrapper');
    const totalScreenshots = 208;
    const randomIndexes = new Set();
    const imagesToLoad = [];

    while (randomIndexes.size < 8) {
        const randomIndex = Math.floor(Math.random() * totalScreenshots) + 1;
        randomIndexes.add(randomIndex);
    }

    for (const index of randomIndexes) {
        const imgUrl = `./assets/screenshots/webp/s${String(index).padStart(5, '0')}.webp`;
        imagesToLoad.push({ index, url: imgUrl });
    }    

    for (const { index, url } of imagesToLoad) {
        const exists = await checkImageExists(url);
        const imgElement = document.createElement('div');
        imgElement.className = 'swiper-slide';

        if (exists) {
            imgElement.innerHTML = `<img src="${url}" alt="Screenshot ${index}" loading="lazy">`;
        } else {
            imgElement.innerHTML = `<img src="./assets/screenshots/webp/lock00001.webp" alt="Default Screenshot" loading="lazy">`;
        }
        wrapper.appendChild(imgElement);
    }
}

function initSwiper() {
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        }
    });
}

function initNavbarToggle() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    navbarToggle.addEventListener('click', () => {
        toggleMenu();
    });

    const menuLinks = navbarMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    document.addEventListener('click', (event) => {
        if (!navbarMenu.contains(event.target) && !navbarToggle.contains(event.target)) {
            closeMenu();
        }
    });

    function toggleMenu() {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    }

    function closeMenu() {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function fetchAppReviews() {
    try {
        const response = await fetch('https://itunes.apple.com/cn/rss/customerreviews/id=1639052102/sortBy=mostRecent/json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const reviews = data.feed.entry
            .filter(entry => parseInt(entry['im:rating'].label) >= 4 && entry.content.label.length >= 6)
            .map(entry => ({
                rating: parseInt(entry['im:rating'].label),
                content: entry.content.label,
                author: entry.author.name.label,
                title: entry.title.label
            }))
            .slice(0, 40);
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

function getFallbackReviews(lang) {
    const data = langData[lang] || langData['en'];
    return [
        { rating: 5, title: data.reviewTitle1, content: data.review1, author: data.reviewAuthor1 },
        { rating: 5, title: data.reviewTitle2, content: data.review2, author: data.reviewAuthor2 },
        { rating: 5, title: data.reviewTitle3, content: data.review3, author: data.reviewAuthor3 },
        { rating: 5, title: data.reviewTitle4, content: data.review4, author: data.reviewAuthor4 }
    ];
}

function displayReviews(reviews) {
    const container = document.getElementById('reviews-container');
    container.innerHTML = '';
    
    const selectedReviews = shuffleArray(reviews).slice(0, 8);
    
    selectedReviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.innerHTML = `
            <div class="review-stars">${'★'.repeat(review.rating)}</div>
            <h3 class="review-title">${review.title}</h3>
            <p class="review-text">${review.content}</p>
            <p class="review-author">- ${review.author}</p>
        `;
        container.appendChild(reviewElement);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (index === 0) {
            item.classList.add('active');
        }
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = 'none';
                answer.style.opacity = '1';
                answer.style.padding = '1rem';
            } else {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.padding = '0 1rem';
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const defaultLang = getDefaultLanguage();
        changeLanguage(defaultLang);
        await loadRandomScreenshots();
        initSwiper();
        initNavbarToggle();
        initLanguageSelector();
        
        let reviews = await fetchAppReviews();
        if (reviews.length === 0) {
            reviews = getFallbackReviews(defaultLang);
        }
        displayReviews(reviews);
    } catch (error) {
        console.error('Error initializing page:', error);
    }
});