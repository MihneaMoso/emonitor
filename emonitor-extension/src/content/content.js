// Listen for clicks on the extension icon when on a product page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'EXTRACT_PRODUCT_INFO') {
        const productInfo = extractProductInfo();
        sendResponse(productInfo);
    }
});

function extractProductInfo() {
    // Extract product details from the current page
    const productInfo = {
        productUrl: window.location.href,
        title: document.title,
        price: extractPrice(),
        imageUrl: extractMainImage(),
        currency: extractCurrency()
    };

    return productInfo;
}

function extractPrice() {
    // Add price extraction logic based on common selectors
    const priceSelectors = [
        '[data-price]',
        '[itemprop="price"]',
        '.price',
        '#price'
    ];

    for (const selector of priceSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            return parseFloat(element.textContent.replace(/[^0-9.]/g, ''));
        }
    }
    return null;
}

function extractMainImage() {
    // Add image extraction logic
    const imageSelectors = [
        '[data-main-image]',
        '[itemprop="image"]',
        '.product-image img',
        '#main-image'
    ];

    for (const selector of imageSelectors) {
        const element = document.querySelector(selector);
        if (element && element.src) {
            return element.src;
        }
    }
    return null;
}

function extractCurrency() {
    // Add currency extraction logic
    const currencySelectors = [
        '[data-currency]',
        '.currency',
        '.price-currency'
    ];

    for (const selector of currencySelectors) {
        const element = document.querySelector(selector);
        if (element) {
            return element.textContent.trim();
        }
    }
    return 'USD'; // Default currency
}
