import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

import { useUser } from "@/context/UserContext";
import { useState } from "react"
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { getToken } from '@/shared/api/user';
import { useMutation } from '@tanstack/react-query';
import { Credentials, Token } from '@/shared/model/User';
import { setAxiosAuthInstanceHeader } from '@/shared/utils/axiosAuthInstance';
import Cookies from 'js-cookie';
import { TOKEN } from '@/shared/config';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});

export default function Login(){
    const router = useRouter();
    const { 
        mutate ,
        isLoading,
    } = useMutation<AxiosResponse<Token>, AxiosError<any>, Credentials>(
        getToken
    );
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<Credentials>({
        resolver: yupResolver(schema),
        mode: "onTouched",
    });

    function onSubmit(credentials: Credentials){
        mutate(credentials, {
            onSuccess: (resp) => {
                setAxiosAuthInstanceHeader(resp.data.access);
                Cookies.set(TOKEN.ACCESS, resp.data.access);
                Cookies.set(TOKEN.REFRESH, resp.data.refresh);
                router.push('/u/u/');
            },
            onError: (error) => {
                if(error.code === 'ERR_NETWORK'){
                    setError("password", { type: "manual", message: 'Server Down' });
                }else{
                    setError("password", {
                        type: "manual",
                        message: error.response?.data?.non_field_errors[0]
                    });
                }
            }
        });
    }

    return (
        <div>
            {isLoading? 'loading...': ''}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <h1>Login</h1>
                <input {...register("username")} />
                <div>{errors.username?.message}</div>
                <br/>
                <input {...register("password")} autoComplete="true" type="password" />
                <div>{errors.password?.message}</div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}