import {
    REALTIME_LISTEN_TYPES
} from "@supabase/supabase-js";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { supabase } from "~/services/supabase";
import { Payload } from "~/types/realtime";
import { api } from "~/utils/api";
import { ChatInput } from "../ui/chat-input/ChatInput";
import { Loading } from "../ui/Loading";
import { CurrentRoomAtom } from "./atoms/CurrentView";
import { InTransitMessagesAtom } from "./atoms/InTransitMessages";

export type Message = {
    text: string
    user: {
        id: string,
        name: string,
        imageUrl: string
    }
    createdAt: Date
}

type MessagePayload = Payload<Message>;

export function ChatRoomView() {
    const [roomId] = useAtom(CurrentRoomAtom)
    const { data: persistedMessages, isLoading: isPersistedMessagesLoading } =
        api.messages.list.useQuery({ roomId: roomId! },
            {
                enabled: Boolean(roomId),
                refetchOnWindowFocus: false,
            })
    const [inTransitMessages, setInTransitMessages] =
        useAtom(InTransitMessagesAtom);
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (!roomId) return;

        const channel = supabase.channel(roomId);

        channel.on(
            REALTIME_LISTEN_TYPES.BROADCAST,
            { event: "MESSAGE" },
            (payload: MessagePayload) => {
                setInTransitMessages((prev) => [...prev, payload.payload!])
            }).subscribe(
                (status) => {
                    setStatus(status);
                }
            )

        return () => {
            console.log("Unsubscribing from channel");
            channel && supabase.removeChannel(channel);
            setInTransitMessages([]);
        }
    }, [roomId]);

    return (
        <div className="flex h-full flex-col w-full">
            <div className="flex flex-col w-full items-center justify-center">
                <h1>Chat Room: {roomId}</h1>
                <p>Status: {status}</p>
            </div>
            <div className="p-4">
                <ul>
                    {isPersistedMessagesLoading &&
                        <div className="flex h-full w-full justify-center items-center">
                            <Loading />
                        </div>
                    }
                    {persistedMessages?.map((message, index) => (
                        <li key={index}>
                            {message.createdAt.toLocaleString()}
                            {message.user.name}:
                            {message.text}
                        </li>
                    ))}
                </ul>
                <ul>
                    {inTransitMessages.map((message, index) => (
                        <li key={index}>
                            {message.createdAt.toLocaleString()}
                            {message.user.name}:
                            {message.text}
                        </li>
                    ))}
                </ul>

            </div>
            <ChatInput />
        </div>
    );
}
