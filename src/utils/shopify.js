
const defaultShopify = {
    "shop": "sinlipee-124.myshopify.com",
    "locale": "en",
    "currency": {
        "active": "USD",
        "rate": "1.0"
    },
    "country": "US",
    "theme": {
        "name": "Dawn",
        "id": 123598864473,
        "theme_store_id": 887,
        "role": "main",
        "handle": "null",
        "style": {
            "id": null,
            "handle": null
        }
    },
    "cdnHost": "cdn.shopify.com",
    "routes": {
        "root": "/"
    },
    "analytics": {
        "replayQueue": []
    },
    "modules": true,
    "PaymentButton": {},
    "recaptchaV3": {
        "siteKey": "6LcCR2cUAAAAANS1Gpq_mDIJ2pQuJphsSQaUEuc9"
    }
}

export const addScriptCurrencies = () => {
    var script = `<script src="https://cdn.shopify.com/s/javascripts/currencies.js"></script>`;
    document.head.insertAdjacentHTML("beforeend", script);
}

export const getShopifyInfo = () => {
    try {
        const shopifyInfo = window.Shopify || defaultShopify
        return shopifyInfo;
    } catch (error) {
        return null
    }
}
