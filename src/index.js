import { getShopifyInfo } from '@src/utils/shopify';
import { getStoreFrontData, getCartShopify } from '@src/services/fetchData.service';

import * as ShippingBar from '@src/modules/ShippingBar';
// import * as SalesPop from '@src/modules/SalesPop';

import './scss/bundle.scss';

const initializeStoreFront = async () => {
    const shopifyInfo = getShopifyInfo();

    if (shopifyInfo) {
        window.SpShopifyInfo = shopifyInfo
        let params = (new URL(window.location.href)).searchParams;
        let view_demo = undefined;
        let shipping_bar_demo = params.get('shipping_bar_demo');
        if (shipping_bar_demo) {
            view_demo = { shipping_bar_demo }
        }
        const frontData = await getStoreFrontData({ myshopify_domain: shopifyInfo?.shop, view_demo })

        if (frontData && frontData?.shipping_bar) {
            window.SpConversionRates = JSON.parse(frontData?.conversion_rates);
            const cart = await getCartShopify({ myshopify_domain: shopifyInfo?.shop });
            window.SpCart = cart;
            window.__SpSalesMessage = JSON.parse(frontData?.shipping_bar)
            await ShippingBar.initialize({ shipping_bar: JSON.parse(frontData?.shipping_bar), shipping_bar_demo: frontData?.shipping_bar_demo }, cart);
        }
    }
}

initializeStoreFront();
