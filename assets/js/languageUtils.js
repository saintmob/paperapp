import { langData, languageConfig } from './translations.js';

export function updateContent(lang) {
    const data = langData[lang] || langData['en']; // 使用英语作为后备语言
    
    function safelySetTextContent(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
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
    safelySetTextContent("features-title", data.features);
    safelySetTextContent("reviews-title", data.reviewsTitle);
    safelySetTextContent("contact-title", data.contactTitle);
    safelySetTextContent("contact-description", data.contactDescription);
    safelySetTextContent("contact-button", data.contactButton);
    safelySetTextContent("footer-terms", data.footerTerms);
    safelySetTextContent("footer-privacy", data.footerPrivacy);
    safelySetInnerHTML(".copyright", `<span class="pap-er-brand">©️ pap.er</span> ${data.footerCopyright}`);

    // 更新Key Features
    const featureItems = document.querySelectorAll("#app-features .feature-item");
    if (featureItems.length >= 4) {
        featureItems[0].querySelector("h3").textContent = data.featureEditorial;
        featureItems[0].querySelector("p").textContent = data.featureEditorialDesc;
        featureItems[1].querySelector("h3").textContent = data.featureScreenAdapt;
        featureItems[1].querySelector("p").textContent = data.featureScreenAdaptDesc;
        featureItems[2].querySelector("h3").textContent = data.featureOneClick;
        featureItems[2].querySelector("p").textContent = data.featureOneClickDesc;
        featureItems[3].querySelector("h3").textContent = data.featureMyWallpapers;
        featureItems[3].querySelector("p").textContent = data.featureMyWallpapersDesc;
    }
    
    // 更新导航菜单项
    const featuresLink = document.querySelector('.navbar-item[href="#features"]');
    if (featuresLink) featuresLink.textContent = data.menuFeatures;
    
    const userReviewsLink = document.querySelector('.navbar-item[href="#user-reviews"]');
    if (userReviewsLink) userReviewsLink.textContent = data.menuUserReviews;
    
    const faqLink = document.querySelector('.navbar-item[href="#faq"]');
    if (faqLink) faqLink.textContent = data.menuFAQ;
    
    const contactLink = document.getElementById("contact-link");
    if (contactLink) contactLink.textContent = data.menuContact;

    // 更新下载链接文本
    safelySetTextContent("direct-download", data.directDownload);
    safelySetTextContent("old-version-download", data.oldVersionDownload);

    // 更新下载按钮
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
    languageDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            changeLanguage(e.target.getAttribute('data-lang'));
        }
    });
}

export function getDefaultLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    const userLang = savedLang || navigator.language || navigator.userLanguage;
    
    if (userLang.startsWith('zh') || userLang === 'zh-Hans-CN' || userLang === 'zh-CN') return 'zh-Hans-CN';
    if (userLang === 'zh-Hant' || userLang === 'zh-TW' || userLang === 'zh-HK') return 'zh-Hant';
    if (userLang.startsWith('ja')) return 'ja';
    if (userLang.startsWith('ko')) return 'ko';
    if (userLang.startsWith('en')) return 'en';
    
    return 'zh-Hans-CN';
}