import Cookies from 'js-cookie';
import { TOKEN } from '../config';
import { NextRouter } from "next/router";

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


export const isRouteActive = (router: NextRouter, url: string, levelCheck:number = 1): string | boolean => {
    if(router.pathname === url) return true;

    if (url === undefined) return false;

    const routeChunks: string [] = router.pathname.split('/')
    const routeCheck: string [] = url.replace(/\/$/,"").split('/')

    if(routeChunks.length !== routeCheck.length) return false;
    for(let i = 0, check = 0; i < routeChunks.length; i++){
        if(routeChunks[i] === '') continue

        if(check === levelCheck) return true;

        if(routeChunks[i][0] !== '[' && routeChunks[i][routeChunks.length - 1] !== ']'){
            if(routeCheck[i] !== routeChunks[i]){
                return false;
            }
        }

        check++;
    }

    return true;
}

export const routeActiveAddClass = (router: NextRouter, url: string, className: string, levelCheck:number = 1): string => 
    isRouteActive(router, url, levelCheck) ? className : '';