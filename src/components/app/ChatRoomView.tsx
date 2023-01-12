import {
    REALTIME_LISTEN_TYPES
} from "@supabase/supabase-js";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { supabase } from "~/services/supabase";
import { Payload } from "~/types/realtime";
import { api, RouterOutputs } from "~/utils/api";
import { ChatInput } from "../ui/chat-input/ChatInput";
import { ChatBox } from "../ui/ChatBox";
import { Loading } from "../ui/Loading";
import { CurrentRoomAtom } from "./atoms/CurrentView";
import { InTransitMessagesAtom } from "./atoms/InTransitMessages";

export type Message = RouterOutputs["messages"]["list"][number]

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
        <div className="flex h-[96%] flex-col w-full">
            <div className="flex flex-col w-full items-center justify-center">
                <h1>Chat Room: {roomId}</h1>
                <p>Status: {status}</p>
            </div>
            <div className="p-4 h-full overflow-y-scroll">
                {isPersistedMessagesLoading && (
                    <div className="flex h-full justify-center items-center">
                        <Loading />
                    </div>
                )}
                {persistedMessages && <ChatBox messages={persistedMessages} />}
                {inTransitMessages && <ChatBox messages={inTransitMessages} />}
            </div>
            <ChatInput />
        </div>
    );
}
