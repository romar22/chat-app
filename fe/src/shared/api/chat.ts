import { AxiosResponse } from "axios";
import axiosAuthInstance from "../utils/axiosAuthInstance";
import { API_URL } from "../config";


const API_URL_CHAT = `${API_URL}chat/`;


export const friendList = () => 
    axiosAuthInstance.get(`${API_URL_CHAT}friends/`).then(resp => resp.data);

export const apiConversationList = () =>
    axiosAuthInstance.get(`${API_URL_CHAT}conversation/`).then(resp => resp.data);

export const apiMessagesList = (conversationId: any) =>
    axiosAuthInstance.get(`${API_URL_CHAT}conversation/${conversationId}/messages/`).then(resp => resp.data);

export const apiSendMessage = (conversationId: any, data: any) => {
    return axiosAuthInstance.post(`${API_URL_CHAT}conversation/${conversationId}/messages/`, data);
}