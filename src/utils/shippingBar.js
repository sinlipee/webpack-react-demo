import { isMobileDevice } from "@src/utils/helper";
import { getProductDetail } from '@src/services/fetchdata.service';

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
    if (device === '2' && isMobile) {
        return true;
    }

    // device = 3 show desktop
    if (device === '3' && !isMobile) {
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

export const isProductPageSetting = async ({ product_page }) => {
    try {
        let isPage = true
        const page = product_page?.page
        if (page === '1') {
            const product_url = window.location.href;
            const product = await getProductDetail({ product_url });
            return product;
        }
        return isPage;
    } catch (error) {
        console.log('Error isProductPageSetting', error);
    }
}
