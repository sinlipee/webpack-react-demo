import { isMobileDevice, addStylesSheet } from "@src/utils/helper";
import { fontsGoogle } from '@src/utils/fonts';
import { getCartShopify } from '@src/services/fetchData.service';
import { messageIcons } from '@src/utils/icons';

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
        window.SpShippingBarDetail = shipping_bar;

        const {
            background_image,
            background_color,
            font_family,
            padding,
        } = shipping_bar?.style || {}

        // add google before render html shipping bar
        addGoogleFont({ font_family })

        const styleStr = `padding: ${padding}px 0;`

        const html = `
            <div class="smsinpee__bar_wrapper smsinpee__active">
                <div class="smsinpee__bar_container">
                    <div class="smsinpee__bar_block">
                        <div class="smsinpee__bar_bgimg" style="background-image: ${background_image ? `url(${background_image})` : 'none'};"></div>
                        <div class="smsinpee__bar_bgcolor" style="background-color: ${background_color};"></div>
                        <div class="smsinpee__bar_content" style="${styleStr}">
        ${renderContent({
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


            addClassToBody()

            // document visible
            documentVisibilityChange()

            handleMutationObserverCart()
        }
    } catch (error) {
        console.log('Error addShippingBarToDom', error);
    }
};

const renderContent = ({ style, content, currency }, cart) => {
    try {
        const { item_count } = cart;
        const { free_shipping_goal, initial_msg, progress_msg, goal_msg } = content

        let moneyAmount = '';
        let message = goal_msg?.first;
        let icon = '';
        let iconStyle = '';

        // truong hop shipping fee = 0 thi show message mien phi
        if (parseInt(free_shipping_goal) === 0) {
            if (initial_msg?.icon?.status) {
                iconStyle = renderIconStyle(initial_msg?.icon)
                icon = getMessageIcon({ key: initial_msg?.icon?.key })
            }
            message = initial_msg?.free
        } else {
            if (item_count) {

                const remaining = renderRemainMoney({ free_shipping_goal, currency }, cart)
                if (remaining) {
                    // message = `${progress_msg?.first} ${formatMoney({ style, currency }, remaining)} ${progress_msg?.last}`
                    if (progress_msg?.icon?.status) {
                        iconStyle = renderIconStyle(progress_msg?.icon)
                        icon = getMessageIcon({ key: progress_msg?.icon?.key })
                    }

                    message = progress_msg?.first
                    moneyAmount = formatMoney({ style, currency }, remaining)
                }

            } else {
                // message = `${initial_msg?.first} ${formatMoney({ style, currency }, initial_msg?.middle)} ${initial_msg?.last}`
                if (initial_msg?.icon?.status) {
                    iconStyle = renderIconStyle(initial_msg?.icon)
                    icon = getMessageIcon({ key: initial_msg?.icon?.key })
                }

                message = initial_msg?.first
                moneyAmount = formatMoney({ style, currency }, free_shipping_goal)
            }
        }

        // replace code {{money}}
        message = iconStyle + icon + message.replace(/{{money}}/g, moneyAmount);

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

const renderIcon = ({ color, key, size }) => {
    return `<style></style>`
}

const formatMoney = ({ currency }, shippingFee) => {
    try {
        const { code, position, symbol } = currency;

        let displayPrice = `${symbol}${shippingFee}`

        if (position) {
            displayPrice = `${shippingFee}${symbol}`
        }

        return displayPrice
    } catch (error) {
        hideShippingBar();
    }
}

const addGoogleFont = ({ font_family }) => {
    try {
        let fontsGoogleStr = ''
        font_family.forEach(item => {
            fontsGoogleStr += fontsGoogle[item]
        })
        document.head.insertAdjacentHTML("beforeend", fontsGoogleStr);
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
        const submitForm = document.querySelectorAll('form[method="post"]')
        submitForm.forEach(element => {
            const submitButton = element.querySelectorAll('button')
            submitButton.forEach(item => {
                item.addEventListener('click', handleClickButton)
            })

            // const aTag = element.querySelectorAll('a')
            // aTag.forEach(item => {
            //     const aHref = item.getAttribute('href')
            //     if (aHref && aHref.includes('/cart/change')) {
            //         item.addEventListener('click', handleClickButton)
            //     }
            // })
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

const handleMutationObserverCart = () => {
    try {
        if (window.location.pathname === '/cart') {
            // Select the node that will be observed for mutations
            const targetNodeAll = document.querySelectorAll('form[action="/cart"]');
            let oneTarget = false;
            targetNodeAll.forEach((targetNode) => {
                // Options for the observer (which mutations to observe)
                const config = { attributes: true, childList: true, subtree: true };

                // Callback function to execute when mutations are observed
                const callback = async (mutationList, observer) => {
                    console.log('A child node has been added or removed.', mutationList);
                    console.log('observer', observer);
                    if (mutationList.length === 1) {
                        handleClickButton({ time_out: 0 })
                    }
                };

                // Create an observer instance linked to the callback function
                const observer = new MutationObserver(callback);

                // Start observing the target node for configured mutations
                observer.observe(targetNode, config);

                // Later, you can stop observing
                // observer.disconnect();
            })

        }

    } catch (error) {
        console.log('Error handleMutationObserverCart');
    }
}

const handleClickButton = async ({ time_out = 3000 }) => {
    try {
        console.log('Click button || document visibility change');
        if (window.SpShopifyInfo) {
            const cartTimeout = setTimeout(async () => {
                clearTimeout(cartTimeout)
                const cart = await getCartShopify({ myshopify_domain: window.SpShopifyInfo?.shop });
                if (window.SpCart?.item_count !== cart?.item_count) {
                    const message = renderContent({
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

const getMessageIcon = ({ key }) => {
    let icon = '';
    messageIcons.forEach(item => {
        if (item?.key === key) {
            icon = `<span id="${key}_icon_sinlip">${item?.icon}</span>`
        }
    })
    return icon;
}

const renderIconStyle = ({ color, size, key }) => {
    return `<style>
                #${key}_icon_sinlip { display: flex; width: ${size}px; height: ${size}px; margin-right: 5px; }
                #${key}_icon_sinlip svg { width: 100%; height: 100%; }
                #${key}_icon_sinlip svg path {fill: ${color}}
            </style>`
}

export const renderImageHidden = ({ url }) => {
    try {
        const html = `<img src="${url}" class="smsinpee__hidden"/>`
        document.body.insertAdjacentHTML('beforeend', html)
    } catch (error) {
        console.log('Error renderImageHidden', error);
    }
}
