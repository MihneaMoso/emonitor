// Handle product monitoring in the background
chrome.runtime.onInstalled.addListener(() => {
    // Initialize storage with empty products array
    chrome.storage.local.set({ products: [] });
});

// Check prices periodically
const CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

async function checkPrices() {
    const { products } = await chrome.storage.local.get(['products']);

    products.forEach(async (product) => {
        try {
            const response = await fetch('YOUR_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: product.productUrl }),
            });

            const data = await response.json();

            if (data.price < product.price) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon128.png',
                    title: 'Price Drop Alert!',
                    message: `${product.title} price dropped to ${data.price} ${product.currency}`,
                });
            }
        } catch (error) {
            console.error('Price check failed:', error);
        }
    });
}

// Start price monitoring
setInterval(checkPrices, CHECK_INTERVAL);

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'ADD_PRODUCT') {
        chrome.storage.local.get(['products'], ({ products }) => {
            products.push(request.product);
            chrome.storage.local.set({ products });
        });
    }
});
