import { getShopifyInfo } from '@src/utils/shopify';
import { getStoreFrontData, getCartShopify } from '@src/services/fetchdata.service';

import * as ShippingBar from '@src/modules/ShippingBar';
import * as SalesPop from '@src/modules/SalesPop';

import './scss/bundle.scss';

const initializeStoreFront = async () => {
    const shopifyInfo = getShopifyInfo();

    if (shopifyInfo) {
        const frontData = await getStoreFrontData({ myshopify_domain: shopifyInfo?.shop })
        if (frontData && frontData?.shipping_bar) {
            const cart = await getCartShopify({ myshopify_domain: shopifyInfo?.shop })
            await ShippingBar.initialize({ shipping_bar: JSON.parse(frontData?.shipping_bar) }, cart)
        }
    }
}

initializeStoreFront()
