import { AxiosResponse } from "axios";
import axiosAuthInstance from "../utils/axiosAuthInstance";
import { API_URL } from "../config";


const API_URL_CHAT = `${API_URL}chat/`;


export const friendList = (): Promise<AxiosResponse> => 
    axiosAuthInstance.get(`${API_URL_CHAT}friends/`).then(resp => resp.data);

export const conversationList = (): Promise<AxiosResponse> =>
    axiosAuthInstance.get(`${API_URL_CHAT}conversation/`).then(resp => resp.data);

export const messagesList = (conversationId: number): Promise<AxiosResponse> =>
    axiosAuthInstance.get(`${API_URL_CHAT}conversation/${conversationId}/messages/`).then(resp => resp.data);