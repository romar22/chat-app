import axios from 'axios';
import Cookies from 'js-cookie';
import { TOKEN } from '../config';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import { getAccessToken } from '../api/user';
import { forceLogout } from './helper';

const baseURL = process.env.apiURL;

const axiosAuthInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Authorization': `JWT ${Cookies.get(TOKEN.ACCESS)}`,
        'Content-type': 'application/json',
    },
});


axiosAuthInstance.interceptors.request.use(async (req) => {
    const currentDateTime = dayjs.tz().unix();

    const accessExpiry = jwt_decode<{exp: number}>(Cookies.get(TOKEN.ACCESS) as any).exp;

    const isAcessExpired = accessExpiry - currentDateTime < 15;

    if(isAcessExpired){
        try {
            const response = await getAccessToken();

            setAxiosAuthInstanceHeader(response.data.access);
            Cookies.set(TOKEN.ACCESS, response.data.access);
            req.headers['Authorization'] = `JWT ${response.data.access}`;
        } catch (err) {
            forceLogout();
        }
    }

    return req;
})

export const setAxiosAuthInstanceHeader = (token: string) => {
    axiosAuthInstance.defaults.headers['Authorization'] = `JWT ${token}`;
}

export default axiosAuthInstance;
