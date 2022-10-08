import {
    isDeviceSetting,
    isIncludePageSetting,
    isExcludePageSetting,
    isProductPageSetting,
    renderBarToDom
} from "@src/utils/shippingBar";

export const initialize = async ({ shipping_bar }, cart) => {
    console.log("initialize shipping bar", shipping_bar);

    const shippingBarPromise = await new Promise((res, rej) => {
        let shippingBar = null;
        try {
            shipping_bar.forEach(async (item, index) => {
                if (shippingBar) {
                    res(shippingBar)
                }
                if (
                    isDeviceSetting({ device: item?.display?.device }) &&
                    isIncludePageSetting({ include_page: item?.display?.include_page }) &&
                    isExcludePageSetting({ include_page: item?.display?.include_page })
                ) {
                    const isProductPage = await isProductPageSetting({ product_page: item?.display?.product_page })
                    if (isProductPage) {
                        shippingBar = item;
                    }

                    if (index === shipping_bar.length - 1) {
                        res(shippingBar)
                    }
                }
            });
        } catch (error) {
            console.log('Error shippingBarPromise', error);
            res(shippingBar)
        }
    })

    if (shippingBarPromise) {
        // sau khi tim duoc duong shipping bar phu hop thi add bar vao DOM
        renderBarToDom({ shipping_bar: shippingBarPromise }, cart)
    } else {
        console.log('Not found shipping bar correct setting');
    }

};
