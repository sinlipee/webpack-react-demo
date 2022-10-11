import { getShopifyInfo } from '@src/utils/shopify';
import { getStoreFrontData, getCartShopify } from '@src/services/fetchData.service';

import * as ShippingBar from '@src/modules/ShippingBar';
// import * as SalesPop from '@src/modules/SalesPop';

import './scss/bundle.scss';

const initializeStoreFront = async () => {
    const shopifyInfo = getShopifyInfo();

    if (shopifyInfo) {
        window.SpShopifyInfo = shopifyInfo
        const frontData = await getStoreFrontData({ myshopify_domain: shopifyInfo?.shop })
        if (frontData && frontData?.shipping_bar) {
            window.SpConversionRates = JSON.parse(frontData?.conversion_rates);
            const cart = await getCartShopify({ myshopify_domain: shopifyInfo?.shop });
            window.SpCart = cart;
            window.__SpSalesMessage = JSON.parse(frontData?.shipping_bar)
            await ShippingBar.initialize({ shipping_bar: JSON.parse(frontData?.shipping_bar) }, cart);
        }
    }
}

initializeStoreFront();
