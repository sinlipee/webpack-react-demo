const API_PATH = {
    STOREFRONT: '/api/storefront/salesmessage'
}

export const getStoreFrontData = async ({ myshopify_domain }) => {
    try {
        const options = {
            method: 'GET',
            header: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            })
        }
        const url = `${process.env.APP_URL}${API_PATH?.STOREFRONT}?myshopify_domain=${myshopify_domain}`;
        const response = await fetch(url, options);
        const { status = null, data = null } = await response.json() || {};
        if (status === 200 && data) {
            return data
        }
        return null
    } catch (error) {
        console.log('Error getFrontData', error);
        return null
    }
}