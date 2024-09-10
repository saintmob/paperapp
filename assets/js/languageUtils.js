import { langData, languageConfig } from './translations.js';

export function updateContent(lang) {
    const data = langData[lang] || langData['en']; // 使用英语作为后备语言

    function safelySetTextContent(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
    }

    function safelySetInnerHTML(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = content;
        }
    }

    safelySetTextContent("app-title-suffix", data.appTitle);
    safelySetTextContent("app-description", data.appDescription);
    safelySetTextContent("app-requires", data.appRequires);
    safelySetTextContent("brand-description", data.brandDescription);
    safelySetTextContent("slogan-text", data.brandSlogan);
    safelySetTextContent("direct-download", data.directDownload);
    safelySetTextContent("old-version-download", data.oldVersionDownload);
    safelySetTextContent("features-title", data.features);
    safelySetTextContent("reviews-title", data.reviewsTitle);
    safelySetTextContent("contact-title", data.contactTitle);
    safelySetTextContent("contact-description", data.contactDescription);
    safelySetTextContent("contact-button", data.contactButton);
    safelySetTextContent("footer-terms", data.footerTerms);
    safelySetTextContent("footer-privacy", data.footerPrivacy);
    safelySetInnerHTML(".copyright", `<span class="pap-er-brand">©️ pap.er</span> ${data.footerCopyright}`);

    // 更新 FAQ 标题
    const faqTitle = document.getElementById('faq-title');
    if (faqTitle) {
        faqTitle.textContent = data.faqTitle;
    }

    // 更新 FAQ 内容
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        const questionElement = item.querySelector('h3'); // 获取问题标题元素
        const answerElement = item.querySelector('p'); // 获取答案内容元素

        if (questionElement && answerElement && data[`faq${index + 1}`] && data[`faq${index + 1}Answer`]) {
            questionElement.textContent = data[`faq${index + 1}`];
            answerElement.textContent = data[`faq${index + 1}Answer`];
        }
    });

    const featureItems = document.querySelectorAll("#app-features .feature-item");
    if (featureItems.length >= 4) {
        const fragment = document.createDocumentFragment();

        featureItems.forEach((item, index) => {
            const titleElement = item.querySelector('h3');
            const descriptionElement = item.querySelector('p');

            switch (index) {
                case 0:
                    titleElement.textContent = data.featureEditorial;
                    descriptionElement.textContent = data.featureEditorialDesc;
                    break;
                case 1:
                    titleElement.textContent = data.featureScreenAdapt;
                    descriptionElement.textContent = data.featureScreenAdaptDesc;
                    break;
                case 2:
                    titleElement.textContent = data.featureOneClick;
                    descriptionElement.textContent = data.featureOneClickDesc;
                    break;
                case 3:
                    titleElement.textContent = data.featureMyWallpapers;
                    descriptionElement.textContent = data.featureMyWallpapersDesc;
                    break;
            }

            fragment.appendChild(item); // 添加到 fragment 中
        });

        // 一次性将所有更改插入到 DOM 中
        document.getElementById('app-features').appendChild(fragment);
    }


    const featuresLink = document.querySelector('.navbar-item[href="#features"]');
    if (featuresLink) featuresLink.textContent = data.menuFeatures;

    const userReviewsLink = document.querySelector('.navbar-item[href="#user-reviews"]');
    if (userReviewsLink) userReviewsLink.textContent = data.menuUserReviews;

    const faqLink = document.querySelector('.navbar-item[href="#faq"]');
    if (faqLink) faqLink.textContent = data.menuFAQ;

    const contactLink = document.getElementById("contact-link");
    if (contactLink) contactLink.textContent = data.menuContact;

    const config = languageConfig[lang] || languageConfig['en'];
    const downloadBadge = document.getElementById('download-badge');
    const downloadLink = document.getElementById('download-link');
    if (downloadBadge) {
        downloadBadge.src = config.badgeSrc;
        downloadBadge.alt = config.altText;
    }
    if (downloadLink) {
        downloadLink.href = config.appStoreLink;
    }
}

export function changeLanguage(selectedLanguage) {
    try {
        localStorage.setItem('preferredLanguage', selectedLanguage);
        updateContent(selectedLanguage);
        const languageText = document.querySelector('.language-text');
        const selectedLangElement = document.querySelector(`.language-dropdown a[data-lang="${selectedLanguage}"]`);
        if (languageText && selectedLangElement) {
            languageText.textContent = selectedLangElement.textContent;
        }
    } catch (error) {
        console.error('Error changing language:', error);
    }
}

export function initLanguageSelector() {
    const languageDropdown = document.querySelector('.language-dropdown');
    languageDropdown.addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            changeLanguage(e.target.getAttribute('data-lang'));
        }
    });
}

export function getDefaultLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    const userLang = savedLang || navigator.language || navigator.userLanguage;

    const langMapping = {
        'zh-Hans-CN': ['zh', 'zh-Hans-CN', 'zh-CN'],
        'zh-Hant': ['zh-Hant', 'zh-TW', 'zh-HK'],
        'ja': ['ja'],
        'ko': ['ko'],
        'en': ['en']
    };

    for (const [lang, variants] of Object.entries(langMapping)) {
        if (variants.some(variant => userLang.startsWith(variant))) {
            return lang;
        }
    }

    return 'zh-Hans-CN';
}