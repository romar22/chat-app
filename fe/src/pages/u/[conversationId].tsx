import { useUser } from "@/context/UserContext"
import { apiSendMessage, apiMessagesList, apiConversationList } from "@/shared/api/chat";
import { API_STREAM_CHAT } from "@/shared/config";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, RefObject, useEffect, useRef, useState, } from "react";
import UserLoader from "@/layouts/UserLoader";
import { useForm } from "react-hook-form";
import { WSocket } from "@/shared/utils/webSocket";
import MainLayout from "@/layouts/MainLayout";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InfiniteScroll from "react-infinite-scroll-component";

function Conversations() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { conversationId } = router.query;
    const { user, isMe, logout } = useUser();

    const [mounted, setMounted] = useState(false);

    const { data: conversations } = useQuery(["conversations"], apiConversationList);

    // const { data: messages } = useQuery([`conversation-${conversationId}`], () => apiMessagesList(conversationId), {
    //     enabled: !!conversationId,
    //     staleTime: Infinity,
    // });

    const { data: messages, isLoading, hasNextPage, fetchNextPage, isFetching, isFetchingNextPage, isFetched } = useInfiniteQuery(
        [`conversation-${conversationId}`], ({ pageParam = 1 }) => apiMessagesList(conversationId, pageParam), {
            enabled: !!conversationId,
            staleTime: Infinity,
            onSuccess: (data) => {
                // if(data?.pages.length > 1){
                //     const last = data.pages.pop();
                //     data.pages.unshift(last);
                // }
            },
            getNextPageParam: (lastPage, pages) => {
                if(pages.length < (lastPage.count/pages.length)){
                    return pages.length + 1;
                }else{
                    return undefined;
                }
            },
    });


    const webSocket = new WSocket(API_STREAM_CHAT);

    useEffect(() => {
        if(conversations?.length > 0){
            router.push(`/u/${conversations[0].id}`);
        }
    }, [conversations])

    useEffect(() => {
        webSocket.onMessage((res: any) => {
            queryClient.setQueryData(["conversations"], (data: any) => {
                let newData = [];
                data && newData.push(...data);
                const index = newData.findIndex((item: any) => item.id === res.conversation); 
                if(index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1);
                    newData.unshift(item);
                }
                return newData;
            });
            queryClient.invalidateQueries(["conversation"]);

            // queryClient.setQueryData([`conversation-${res.conversation}`], (data: any) => {
            //     let newMessages = [];
            //     data && newMessages.push(...data);
            //     newMessages.push(res);
            //     return newMessages;
            // });
        });

    }, []);


    const messageForm = useForm({
        defaultValues: {
            message: "",
        }
    });

    function userClicked(id: number){
        router.push(`/u/${id}`);
        scrollToBottom();
    }

    function onMessageSubmit(data: any){
        if(!data.message) return;

        apiSendMessage(conversationId, {
            'conversation': conversationId,
            'text': data.message,
        });
    }

    const messageEndRef = useRef<HTMLDivElement>(null);

    function scrollToBottom(){
        messageEndRef.current?.scrollTo({ top: Infinity });
    }

    useEffect(() => {
        if(!mounted && messages){
            setMounted(true);
            scrollToBottom();
        }
    }, [messages])

    console.log(messages)

    return (
        <MainLayout>
            <main className="flex h-[calc(100vh)]">
                <aside className="w-[390px] h-full">
                    <div className="flex flex-col h-full gap-4">
                        <div className="px-8 font-bold text-lg">Messages</div>
                        <div className="flex flex-col overflow-y-scroll flex-grow">
                            {conversations?.map((conversation: any) => (
                                <button 
                                    onClick={() => userClicked(conversation.id)}
                                    key={conversation.id} 
                                    className="flex gap-4 items-center cursor-pointer px-8 py-3 hover:bg-gray-200">
                                    {conversation?.participants?.map((p: any) => (
                                        !isMe(p.id)  && (
                                            <Fragment key={p.id}>
                                                <img className="w-12 h-12 rounded-full" src="https://avatars.githubusercontent.com/u/111821744?s=400&u=0ddd4bf7cbaab5bc4dc78f720fd2a75e93ff4c06&v=4" alt="" />
                                                <div className="truncate flex flex-col gap-1">
                                                    <div className="text-base font-medium text-left truncate flex items-center justify-between">
                                                        <div className="truncate">{p.username}</div>
                                                        <div className="text-[0.7rem] text-gray-400 font-normal">9.00am</div>
                                                    </div>
                                                    <div className="text-xs text-left truncate text-gray-400"> 
                                                        Lorem ipsum dolor sit ametLorem ipsum dolor sit amet 
                                                        Lorem ipsum dolor sit amet  Lorem ipsum dolor sit amet 
                                                    </div>
                                                </div>
                                            </Fragment>
                                        )
                                    ))}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <section className="h-full flex-grow">
                    <div className="flex flex-col h-full px-4 pb-4">
                        <div 
                            className="relative overflow-y-scroll h-full flex flex-col-reverse"
                            id="scrollableDiv"
                        >
                            <InfiniteScroll
                                dataLength={(messages?.pages.length ?? 0) * 3}
                                next={fetchNextPage}
                                hasMore={hasNextPage ?? false}
                                loader={<h4>Loading...</h4>}
                                inverse={true}
                                className="flex flex-col-reverse flex-grow-1"
                                scrollableTarget="scrollableDiv"
                            >
                                {messages?.pages.map((group: any, i) => (
                                    <Fragment key={i}>
                                        {group.results.map((message: any) => (
                                            <div 
                                                key={message.id} 
                                                className={`w-100 h-[500px] flex flex-col gap-4 ${isMe(message.sender.id) ? 'items-end' : 'items-start'}`}
                                            >
                                                <div>{message.sender.name}</div>
                                                <div>{message.text}</div>
                                            </div>
                                        ))}
                                    </Fragment>
                                ))}
                            </InfiniteScroll>
                            <div className="h-0" ref={messageEndRef}></div>
                        </div>
                        <Form {...messageForm}>
                            <form
                                className="w-full"
                                onSubmit={messageForm.handleSubmit(onMessageSubmit)} 
                                noValidate
                            >
                                <FormField
                                    control={messageForm.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input 
                                                    className="h-16 px-7 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border focus:border-gray-600"
                                                    autoComplete="off"
                                                    placeholder="Your message" 
                                                    {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>
                </section>
            </main>
        </MainLayout>
    )
}


const Home = () => (
    <UserLoader>
        <Conversations />
    </UserLoader>
)

export default Home;