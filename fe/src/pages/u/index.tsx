import Chatbox from "@/components/Chatbox";
import { useUser } from "@/context/UserContext"
import { conversationList } from "@/shared/api/chat";
import { API_STREAM } from "@/shared/config";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";

export default function Home() {
    const { user, isMe, logout } = useUser();
    const { data: conversations } = useQuery<any, any>(['conversation'], conversationList);
    const [selectConversation, setSelectConversation] = useState<number>(0);

    const websSocket = new WebSocket(API_STREAM);

    useEffect(() => {
        if(conversations) setSelectConversation(conversations[0].id);
    }, [conversations]);

    function userClicked(id: number){
        setSelectConversation(id);
    }

    return (
        <div>
            <header className="h-[40px]">
                header
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

                {selectConversation && (
                    <section className="h-full flex-grow">
                        <Chatbox 
                            conversationId={selectConversation} 
                            isMe={isMe}
                            webSocket={websSocket}
                        />
                    </section>
                )}
            </main>
        </div>
    )
}