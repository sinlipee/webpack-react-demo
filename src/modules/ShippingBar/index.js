import {
    isDeviceSetting,
    isIncludePageSetting,
    isExcludePageSetting,
    renderBarToDom,
    renderImageHidden
} from "@src/utils/shippingBar";

export const initialize = async ({ shipping_bar, shipping_bar_demo }, cart) => {
    console.log("initialize shipping bar", shipping_bar);
    console.log('shipping_bar_demo >>>', shipping_bar_demo);
    const shippingBarPromise = await new Promise((res, rej) => {
        try {
            shipping_bar.forEach(async (item, index) => {
                if (item?.style?.background_image) {
                    renderImageHidden({ url: item?.style?.background_image })
                }
                if (
                    shipping_bar_demo ||
                    (isDeviceSetting({ device: item?.display?.device }) &&
                        isIncludePageSetting({ include_page: item?.display?.include_page }) &&
                        isExcludePageSetting({ include_page: item?.display?.include_page }))
                ) {
                    res(item)

                }
                if (index === shipping_bar.length - 1) {
                    res(null)
                }
            });

        } catch (error) {
            console.log('Error shippingBarPromise', error);
            res(null)
        }
    })

    if (shippingBarPromise) {
        // sau khi tim duoc duong shipping bar phu hop thi add bar vao DOM
        renderBarToDom({ shipping_bar: shippingBarPromise }, cart)
    } else {
        console.log('Not found shipping bar correct setting');
    }

};
