import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { TOKEN } from './shared/config';
import { isAccessTokenValid, isRefreshTokenValid } from './shared/utils/helper';
 
export function middleware(req: NextRequest) {
    const resp = NextResponse;
    const { pathname } = req.nextUrl;

    const access = req.cookies.get(TOKEN.ACCESS)?.value
    const refresh = req.cookies.get(TOKEN.REFRESH)?.value

    const withAuthPage = pathname.split('/')[1] === 'u' ?? false;
    const tokenValid = access && refresh && isRefreshTokenValid(refresh) && isAccessTokenValid(access);

    if(!tokenValid && withAuthPage){
        req.cookies.clear();
        return resp.redirect(new URL('/', req.url));
    }else if(tokenValid && !withAuthPage){
        return resp.redirect(new URL('/u', req.url));
    }

    return resp.next();
}

export const config = {
  matcher: ['/u/:path*', '/'],
}