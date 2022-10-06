import {
    isDeviceSetting,
    isIncludePageSetting,
    isExcludePageSetting,
    isProductPageSetting
} from "@src/utils/shippingBar";

export const initialize = async ({ shipping_bar }) => {
    console.log("initialize shipping bar", shipping_bar);
    let shippingBar = null;

    shipping_bar.forEach(async (item) => {
        if (
            isDeviceSetting({ device: item?.display?.device }) &&
            isIncludePageSetting({ include_page: item?.display?.include_page }) &&
            isExcludePageSetting({ include_page: item?.display?.include_page })
        ) {
            const isProductPage = await isProductPageSetting({ product_page: item?.display?.product_page })
            if(isProductPage || true) {
                shippingBar = item;
            }
        }
    });
};

const addDom = () => {
    doc;
};
