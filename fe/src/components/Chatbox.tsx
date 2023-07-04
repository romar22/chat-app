import { messagesList } from "@/shared/api/chat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { use, useEffect, useState } from "react";

interface ChatboxProps {
    conversationId: number;
    isMe: (id: number) => boolean;
    webSocket: WebSocket;
}

export default function Chatbox({ 
    conversationId,
    isMe,
    webSocket,
}: ChatboxProps) {
    const id = `conversation-${conversationId}`
    const { data: messages } = useQuery<any, any>([id], () => messagesList(conversationId), {
        enabled: !!conversationId,
        staleTime: Infinity,
    });
    const [message, setMessage] = useState<string>('');
    const queryClient = useQueryClient();

    useEffect(() => {
        webSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            queryClient.setQueryData([id], (oldMessages: any) => {
                return [...oldMessages, {
                    id: Math.random(),
                    sender: {
                        id: 1,
                        name: 'test',
                    },
                    text: data.message,
                }];
            });
        };
    }, [])

    function onMessageEnter(){
        webSocket.send(JSON.stringify({
            message: message,
        }));
    }

    return (
        <div className="flex flex-col h-full px-4 pb-8">
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
                    </div>
                </div>
            </div>
            <div className="w-full">
                <input 
                    onKeyDown={(e) => e.key === 'Enter' && onMessageEnter()}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text" 
                    placeholder="Message"
                    className="w-full p-4 text-base focus:outline-none border-2 border-gray-300 rounded-[30px]"
                />
            </div>
        </div>
    )
}