import { API_URL, TOKEN } from "@/shared/config";
import { Credentials, Token } from "@/shared/model/User";
import axiosAuthInstance from "@/shared/utils/axiosAuthInstance";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";


export const getToken = (credentials: Credentials): Promise<AxiosResponse> => 
    axios.post(`${API_URL}token/`, credentials);

export const getAccessToken = async (): Promise<AxiosResponse> => {
    return await axios.post<Token>(`${API_URL}token/refresh/`, {
        refresh: Cookies.get(TOKEN.REFRESH)
    });
}

export const getUser = () => 
    axiosAuthInstance.get(`${API_URL}users/me/`).then(resp => resp.data);
