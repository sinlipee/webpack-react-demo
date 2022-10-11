import { isMobileDevice, addStylesSheet } from "@src/utils/helper";
import { fontsGoogle } from '@src/utils/fonts';
import { getCartShopify } from '@src/services/fetchData.service';

/**
 *
 * @param {*} param0
 * @returns
 */
export const isDeviceSetting = ({ device }) => {
    const isMobile = isMobileDevice();
    // device = 1 show all device
    if (device === '1') {
        return true;
    }

    // device = 2 show mobile device
    if (device === '2' && !isMobile) {
        return true;
    }

    // device = 3 show desktop
    if (device === '3' && isMobile) {
        return true;
    }
    return false;
}

/**
 *
 * @param {*} param0
 * @returns
 */
export const isIncludePageSetting = ({ include_page }) => {
    try {
        let isPage = false
        const page = include_page?.page
        const url = include_page?.url
        const keyword = include_page?.keyword
        const location = window.location

        switch (page) {
            case '1': // show all page
                isPage = true;
                break;
            case '2': // show home page
                if (location?.path === '/') {
                    isPage = true;
                }
                break;

            case '3': // only url
                const urls = url.split(',')
                if (urls.include_page(location?.href)) {
                    isPage = true;
                }
                break;

            case '4': // only page contain keyword
                const keywords = keyword.split(',')
                keywords.forEach(item => {
                    if (location?.href.includes(item)) {
                        isPage = true;
                    }
                })
                break;

            default:
                break;
        }

        return isPage;
    } catch (error) {
        console.log('Error isIncludePageSetting', error);
        return false
    }
}

/**
 *
 * @param {*} param0
 * @returns
 */
export const isExcludePageSetting = ({ exclude_page }) => {
    try {
        let isPage = true
        const page = exclude_page?.page
        const url = exclude_page?.url
        const keyword = exclude_page?.keyword
        const location = window.location

        switch (page) {
            case '1': // not show any page
                isPage = true;
                break;
            case '2': // not show home page
                if (location?.path === '/') {
                    isPage = false;
                }
                break;

            case '3': // only url
                const urls = url.split(',')
                if (urls.include_page(location?.href)) {
                    isPage = false;
                }
                break;

            case '4': // only page contain keyword
                const keywords = keyword.split(',')
                keywords.forEach(item => {
                    if (location?.href.includes(item)) {
                        isPage = false;
                    }
                })
                break;

            default:
                break;
        }

        return isPage;
    } catch (error) {
        console.log('Error isExcludePageSetting', error);
        return true
    }

}

/**
 * tinh nang product target shipping required
 * Check trong cart co product nao co requires_shipping = true
 * thi moi tinh so tien ship fee con lai va hien thi message progress
 * @param {*} param0
 * @returns
 */
export const isProductTargetSetting = async ({ product_page }) => {
    try {
        let isPage = true
        const page = product_page?.page
        if (page === '2') {
            const product_url = window.location.href;

            return product;
        }
        return isPage;
    } catch (error) {
        console.log('Error isProductPageSetting', error);
        return null
    }
}

/**
 *
 * @param {*} param0
 * @param {*} cart current
 */
export const renderBarToDom = ({ shipping_bar }, cart) => {
    try {
        console.log('shipping_bar >>>', shipping_bar);
        window.SpShippingBarDetail = shipping_bar;

        const {
            background_image,
            background_color,
            text_color,
            amount_color,
            font_family,
            font_size,
            font_weight,
            padding,
        } = shipping_bar?.style || {}

        const styleStr = `padding: ${padding}px 0; font-family: '${font_family}', serif; font-size: ${font_size}px; font-weight: ${font_weight}; color: ${text_color};`

        const html = `
            <div class="smsinpee__bar_wrapper smsinpee__active">
                <div class="smsinpee__bar_container">
                    <div class="smsinpee__bar_block">
                        <div class="smsinpee__bar_bgimg" style="background-image: ${background_image ? `url(${background_image})` : 'none'};"></div>
                        <div class="smsinpee__bar_bgcolor" style="background-color: ${background_color};"></div>
                        <div class="smsinpee__bar_content" style="${styleStr}">
        ${renderContent({
            style: {
                text_color,
                amount_color,
                font_family,
                font_size,
                font_weight
            },
            content: shipping_bar?.content,
            currency: shipping_bar?.currency
        }, cart)}
                        </div>
                    </div>
                </div>
            </div>
        `
        if (document.body) {
            document.body.insertAdjacentHTML('beforeend', html)

            addGoogleFont({ font_family })
            addClassToBody()

            // document visible
            documentVisibilityChange()
        }
    } catch (error) {
        console.log('Error addShippingBarToDom', error);
    }
};

const renderContent = ({ style, content, currency }, cart) => {
    try {
        const { item_count } = cart;
        const { free_shipping_goal, initial_msg, progress_msg, goal_msg } = content

        let message = goal_msg?.first;

        // truong hop shipping fee = 0 thi show message mien phi
        if (parseInt(free_shipping_goal) === 0) {
            return initial_msg?.free
        } else {
            if (item_count) {

                const remaining = renderRemainMoney({ free_shipping_goal, currency }, cart)
                if (remaining) {
                    message = `${progress_msg?.first} ${formatMoney({ style, currency }, remaining)} ${progress_msg?.last}`
                }

            } else {
                message = `${initial_msg?.first} ${formatMoney({ style, currency }, initial_msg?.middle)} ${initial_msg?.last}`
            }
        }

        // sau khi render content thi addEvent
        changeCartEventListener()
        return message.trim()
    } catch (error) {
        console.log('Error renderContent', error);
        hideShippingBar()
    }
}

const renderRemainMoney = ({ free_shipping_goal, currency }, cart) => {
    try {
        let remaining;
        const original_total_price = cart?.original_total_price / 100
        if (cart?.currency === currency?.code) {
            remaining = parseFloat(free_shipping_goal) - original_total_price
        } else {
            if (window.SpConversionRates) {
                const rateBar = window.SpConversionRates[currency?.code]
                const rateCart = window.SpConversionRates[cart?.currency]
                if (rateBar && rateCart) {
                    remaining = parseFloat(free_shipping_goal) - (original_total_price * rateBar / rateCart)
                }
            }
        }

        if (remaining && remaining > 0) {
            return remaining.toFixed(2)
        }

        return null
    } catch (error) {
        console.log('Error renderRemainMoney', error);
        hideShippingBar()
    }
}

const formatMoney = ({ style, currency }, shippingFee) => {
    try {
        const { code, position, symbol } = currency;
        const styleStr = `font-family: ${style?.font_family}; font-size: ${style?.font_size}px; font-weight: ${style?.font_weight}; color: ${style?.amount_color};`

        let displayPrice = `<span style="${styleStr}">${symbol}${shippingFee}</span>`

        if (position) {
            displayPrice = `<span style="${styleStr}">${shippingFee}${symbol}</span>`
        }
        return displayPrice
    } catch (error) {
        hideShippingBar();
    }
}

const addGoogleFont = ({ font_family }) => {
    try {
        let fontFamily = font_family.toLowerCase();
        fontFamily = fontFamily.replace(/ /g, '_');
        document.head.insertAdjacentHTML("beforeend", fontsGoogle[fontFamily]);
    } catch (error) {
        console.log('Error addGoogleFont', error);
    }
}

const addClassToBody = () => {
    const heigh = document.querySelector('.smsinpee__bar_wrapper').offsetHeight;
    addStylesSheet(`.smsinpee__body { padding-top: ${heigh}px}`)
    document.body.classList.add('smsinpee__body')
}

const hideShippingBar = () => {
    document.querySelector('.smsinpee__bar_wrapper').classList.remove('smsinpee__active')
    document.querySelector('body').classList.remove('smsinpee__body');
}

const changeCartEventListener = () => {
    try {
        const submitForm = document.querySelectorAll('form[method="post"], form[action]')
        submitForm.forEach(element => {
            const submitButton = element.querySelectorAll('button')
            submitButton.forEach(item => {
                item.addEventListener('click', handleClickButton)
            })
            const aTag = element.querySelectorAll('a')
            aTag.forEach(item => {
                const aHref = item.getAttribute('href')
                if (aHref && aHref.includes('/cart/change')) {
                    item.addEventListener('click', handleClickButton)
                }
            })
        })

    } catch (error) {
        console.log('Error changeCartEventListener', error);
    }
}

const documentVisibilityChange = () => {
    try {
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === 'visible') {
                handleClickButton({ time_out: 0 })
            }
        });
    } catch (error) {
        console.log('Error documentVisibilityChange', error);
    }
}

const handleClickButton = async ({ time_out = 1000 }) => {
    try {
        console.log('Click button || document visibility change');
        if (window.SpShopifyInfo) {
            const cartTimeout = setTimeout(async () => {
                clearTimeout(cartTimeout)
                const cart = await getCartShopify({ myshopify_domain: window.SpShopifyInfo?.shop });
                if (window.SpCart?.item_count !== cart?.item_count) {
                    const {
                        text_color,
                        amount_color,
                        font_family,
                        font_size,
                    } = window.SpShippingBarDetail?.style

                    const message = renderContent({
                        style: {
                            text_color,
                            amount_color,
                            font_family,
                            font_size
                        },
                        content: window.SpShippingBarDetail?.content,
                        currency: window.SpShippingBarDetail?.currency
                    }, cart)

                    if (message) {
                        const contentEl = document.querySelector('.smsinpee__bar_content')
                        if (contentEl) {
                            contentEl.innerHTML = message
                        }
                    }
                }
            }, time_out)

        }
    } catch (error) {
        console.log('Error handleClickButton', error);
    }
}

export const renderImageHidden = ({ url }) => {
    try {
        const html = `<img src="${url}" class="smsinpee__hidden"/>`
        document.body.insertAdjacentHTML('beforeend', html)
    } catch (error) {
        console.log('Error renderImageHidden', error);
    }
}
