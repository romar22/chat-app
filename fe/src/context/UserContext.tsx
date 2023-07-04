import { API_URL, TOKEN } from "@/shared/config";
import axios, { AxiosResponse } from "axios";
import { createContext, useContext } from "react";
import Cookies from "js-cookie";
import { Token } from "@/shared/model/User";
import { setAxiosAuthInstanceHeader } from "@/shared/utils/axiosAuthInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "@/shared/api/user";

const UserContext = createContext<any>({});

const UserContextProvider = (props: any) => {

    const { data: user } = useQuery<any>(['me'], getUser, {
        enabled: !!Cookies.get(TOKEN.ACCESS),
    });

    function logout(){
        Cookies.remove(TOKEN.ACCESS);
        Cookies.remove(TOKEN.REFRESH);
        window.location.href = '/';
    }

    function isMe(id: number){
        return user?.id === id;
    }

    const userContextValue = {
        user,
        logout,
        isMe,
    }

    return <UserContext.Provider 
                value={userContextValue} 
                {...props} 
            />

}

const useUser = () => useContext(UserContext);

export { UserContextProvider, useUser }