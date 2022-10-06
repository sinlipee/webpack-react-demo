import { getShopifyInfo } from './utils/shopify';
import { getStoreFrontData } from './services/fetchdata.service';

import * as ShippingBar from './modules/ShippingBar';
import * as SalesPop from './modules/SalesPop';

import './scss/bundle.scss';

const initializeStoreFront = async () => {
    const shopifyInfo = getShopifyInfo();

    if (shopifyInfo) {
        const frontData = await getStoreFrontData({ myshopify_domain: shopifyInfo?.shop })
        console.log(22222, frontData);
        if (frontData && frontData?.shipping_bar) {
            console.log(3333333);
            ShippingBar.initialize({ shipping_bar: frontData?.shipping_bar })
        }
    }
}

initializeStoreFront()
