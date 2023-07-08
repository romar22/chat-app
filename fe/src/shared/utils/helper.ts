import Cookies from 'js-cookie';
import { TOKEN } from '../config';

export const isRefreshTokenValid = (refresh: string | undefined) => 
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(refresh ? refresh : '');

export const isAccessTokenValid = (access: string | undefined) =>
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(access ? access : '');

export const forceLogout = () => {
    Cookies.remove(TOKEN.ACCESS);
    Cookies.remove(TOKEN.REFRESH);
    window.location.href = '/';
}


export const queryURL = (url: string, query: {}) => {
    const params = new URLSearchParams(query);
    return `${url}?${params.toString()}`;
}

