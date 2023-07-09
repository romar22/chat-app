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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});

export default function Login(){
    const router = useRouter();
    const { 
        mutate ,
        isLoading,
    } = useMutation<AxiosResponse<Token>, AxiosError<any>, Credentials>(getToken);

    const form = useForm<Credentials>({
        resolver: yupResolver(schema),
        defaultValues: {
            username: "",
            password: "",
        }
    });

    function onSubmit(credentials: Credentials){
        mutate(credentials, {
            onSuccess: (resp) => {
                setAxiosAuthInstanceHeader(resp.data.access);
                Cookies.set(TOKEN.ACCESS, resp.data.access);
                Cookies.set(TOKEN.REFRESH, resp.data.refresh);
                router.push("/u/u/");
            },
            onError: (error) => {
                if(error.code === "ERR_NETWORK"){
                    form.setError("password", { type: "manual", message: "Server Down" });
                }else{
                    form.setError("username", { type: "manual", message: "" });
                    form.setError("password", {
                        type: "manual",
                        message: error.response?.data?.non_field_errors[0]
                    });
                }
            }
        });
    }

    return (
        <div className="w-11/12 max-w-md m-auto pt-44">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} 
                      className="flex-grow space-y-5"
                >
                    <div className="text-center">
                        <h1 className="text-4xl">
                            Sign in to your account
                        </h1>
                        {/* <small>Click to enable darkmode</small> */}
                    </div>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your username" {...field} />
                                </FormControl>
                                <FormMessage className="font-normal" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button 
                        disabled={isLoading}
                        type="submit"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Logging In..': 'Login'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}