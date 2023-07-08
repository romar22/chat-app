import { useUser } from "@/context/UserContext"
import { apiSendMessage, apiMessagesList, apiConversationList } from "@/shared/api/chat";
import { API_STREAM, API_STREAM_CHAT } from "@/shared/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, } from "react";
import UserLoader from "@/layouts/UserLoader";
import { useForm } from "react-hook-form";
import { WSocket } from "@/shared/utils/webSocket";

function Conversations() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { conversationId } = router.query;
    const { user, isMe, logout } = useUser();

    const { data: conversations } = useQuery(["conversations"], apiConversationList);

    const { data: messages } = useQuery([`conversation-${conversationId}`], () => apiMessagesList(conversationId), {
        enabled: !!conversationId,
        staleTime: Infinity,
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

            queryClient.setQueryData([`conversation-${res.conversation}`], (data: any) => {
                let newMessages = [];
                data && newMessages.push(...data);
                newMessages.push(res);
                return newMessages;
            });
        });
    }, []);

    const { register, handleSubmit } = useForm();

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
        messageEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    return (
        <div>
            <header className="h-[40px]">
                header
                <button onClick={logout}>logout</button>
            </header>
            <main className="flex h-[calc(100vh-40px)]">
                <aside className="w-[390px] h-full">
                    <div className="flex flex-col h-full gap-4">
                        <div className="px-8 font-bold text-lg">Messages</div>
                        <div className="flex flex-col overflow-y-scroll flex-grow">
                            {conversations?.map((conversation: any) => (
                                <button 
                                    onClick={() => userClicked(conversation.id)}
                                    key={conversation.id} 
                                    className="flex gap-4 items-center cursor-pointer px-8 py-2 hover:bg-gray-200">
                                    {conversation?.participants?.map((p: any) => (
                                        !isMe(p.id)  && (
                                            <Fragment key={p.id}>
                                                <img className="w-14 h-14 rounded-full" src="https://avatars.githubusercontent.com/u/111821744?s=400&u=0ddd4bf7cbaab5bc4dc78f720fd2a75e93ff4c06&v=4" alt="" />
                                                <div>
                                                    <div className="text-lg">{p.username}</div>
                                                    <div className="text-sm flex items-center gap-2"> <div>recent</div>
                                                        <div>• ago</div>
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
                    <form 
                        onSubmit={handleSubmit(onMessageSubmit)} 
                        noValidate
                        className="flex flex-col h-full px-4 pb-8"
                    >
                        <div className="relative overflow-y-scroll h-full">
                            <div className="flex flex-col absolute min-h-full w-full">
                                <div className="flex-auto"></div>
                                <div className="flex-initial">
                                    {messages?.map((message: any) => (
                                        <div 
                                            key={message.id} 
                                            className={`w-100 flex flex-col gap-4 ${isMe(message.sender.id) ? 'items-end' : 'items-start'}`}
                                        >
                                            <div>{message.sender.name}</div>
                                            <div>{message.text}</div>
                                        </div>
                                    ))}
                                    <div className="h-0" ref={messageEndRef}></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <input 
                                {...register("message")}
                                type="text" 
                                placeholder="Message"
                                className="w-full p-4 text-base focus:outline-none border-2 border-gray-300 rounded-[30px]"
                            />
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}


const Home = () => (
    <UserLoader>
        <Conversations />
    </UserLoader>
)

export default Home;