const isNode = typeof window === 'undefined';

const isClearAccessTokenRequested = () =>
    !isNode && new URLSearchParams(window.location.search).get("clear_access_token") === 'true';

const clearStoredAccessToken = () => {
    if (isNode) return;
    window.localStorage.removeItem('supabase_access_token');
    window.localStorage.removeItem('token');
}

const getStoredAccessToken = () => {
    if (isNode) return null;
    return window.localStorage.getItem('supabase_access_token') || window.localStorage.getItem('token');
}

const getAppParams = () => {
    if (isClearAccessTokenRequested()) {
        clearStoredAccessToken();
    }
    return {
        appId: import.meta.env.VITE_SUPABASE_APP_ID || import.meta.env.VITE_supabase_APP_ID,
        token: getStoredAccessToken(),
        functionsVersion: import.meta.env.VITE_SUPABASE_FUNCTIONS_VERSION || import.meta.env.VITE_supabase_FUNCTIONS_VERSION,
        appBaseUrl: import.meta.env.VITE_SUPABASE_APP_BASE_URL || import.meta.env.VITE_supabase_APP_BASE_URL,
    }
}

export const appParams = {
    ...getAppParams()
}