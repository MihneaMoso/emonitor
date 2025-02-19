document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('productList');

    // Initial state
    let products = [];

    // Fetch products from storage
    chrome.storage.local.get(['products'], (result) => {
        products = result.products || [];
        renderProducts();
    });

    function renderProducts() {
        productList.innerHTML = products.map(product => `
        <div class="product-item">
          <img src="${product.imageUrl}" alt="${product.title}" />
          <div class="product-info">
            <h3>${product.title}</h3>
            <p>${product.price} ${product.currency}</p>
          </div>
        </div>
      `).join('');
    }
});

class ProductList {
    constructor() {
        this.container = document.getElementById('productList');
        this.intervalPicker = document.getElementById('checkInterval');
        this.products = [];
        this.init();
    }

    async init() {
        const result = await chrome.storage.local.get(['products']);
        this.products = result.products || [];
        this.render();
        this.setupIntervalPicker();
    }

    setupIntervalPicker() {
        this.intervalPicker.addEventListener('change', (e) => {
            const interval = parseInt(e.target.value);
            chrome.runtime.sendMessage({
                type: 'UPDATE_CHECK_INTERVAL',
                interval: interval
            });
        });
    }

    render() {
        this.container.innerHTML = this.products.map(product => `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.imageUrl}" alt="${product.title}" />
          </div>
          <div class="product-details">
            <h3 class="product-title">${product.title}</h3>
            <div class="price-info">
              <span class="current-price">${product.price} ${product.currency}</span>
              <span class="discount">${product.discount}% OFF</span>
            </div>
            <div class="price-metrics">
              <div>PRP: ${product.prp}</div>
              <div>FDP: ${product.fdp}</div>
            </div>
          </div>
        </div>
      `).join('');

        this.attachEventListeners();
    }

    attachEventListeners() {
        const cards = this.container.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => this.handleProductClick(this.products[index]));
        });
    }

    handleProductClick(product) {
        chrome.tabs.create({ url: product.productUrl });
    }
}

// Initialize the product list when popup opens
// new ProductList();


// Add this to the existing popup.js

class ProductManager {
    constructor() {
        this.addButton = document.getElementById('addProduct');
        this.initializeAddButton();
    }

    initializeAddButton() {
        this.addButton.addEventListener('click', async () => {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (tab) {
                try {
                    const response = await chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_PRODUCT_INFO' });

                    if (response) {
                        await this.addProduct(response);
                        // Refresh the product list
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Failed to extract product info:', error);
                }
            }
        });
    }

    async addProduct(productInfo) {
        const { products } = await chrome.storage.local.get(['products']);
        const updatedProducts = [...(products || []), productInfo];
        await chrome.storage.local.set({ products: updatedProducts });

        // Notify background script
        chrome.runtime.sendMessage({
            type: 'ADD_PRODUCT',
            product: productInfo
        });
    }
}

// Initialize both classes when popup opens
document.addEventListener('DOMContentLoaded', () => {
    new ProductList();
    new ProductManager();
});
