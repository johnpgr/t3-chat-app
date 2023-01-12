import {REALTIME_LISTEN_TYPES} from "@supabase/supabase-js";
import {useAtom} from "jotai";
import {useEffect, useState} from "react";
import {supabase} from "~/services/supabase";
import type {Payload} from "~/types/realtime";
import {api, type RouterOutputs} from "~/utils/api";
import {ChatInput} from "../ui/chat-input/ChatInput";
import {ChatBox} from "../ui/ChatBox";
import {Loading} from "../ui/Loading";
import {CurrentChannelAtom} from "./atoms/CurrentChannel";
import {CurrentRoomAtom} from "./atoms/CurrentView";
import {InTransitMessagesAtom} from "./atoms/InTransitMessages";

export type Message = RouterOutputs["messages"]["list"][number]

type MessagePayload = Payload<Message>;

export function ChatRoomView() {
    const [roomId] = useAtom(CurrentRoomAtom)
    const {data: persistedMessages, isLoading: isPersistedMessagesLoading} =
        api.messages.list.useQuery({roomId: roomId!},
            {
                enabled: Boolean(roomId),
                refetchOnWindowFocus: false,
            })
    const [inTransitMessages, setInTransitMessages] =
        useAtom(InTransitMessagesAtom);
    const [status, setStatus] = useState("");
    const [, setCurrentChannel] = useAtom(CurrentChannelAtom);

    useEffect(() => {
        if (!roomId) return;

        const channel = supabase.channel(roomId);

        channel.on(
            REALTIME_LISTEN_TYPES.BROADCAST,
            {event: "MESSAGE"},
            (payload: MessagePayload) => {
                if (typeof payload.payload?.createdAt === "string") {
                    payload.payload.createdAt = new Date(payload.payload.createdAt);
                }
                setInTransitMessages((prev) => [...prev, payload.payload!])
            }).subscribe(
            (status) => {
                setStatus(status);
            }
        )

        setCurrentChannel(channel);

        return () => {
            channel && supabase.removeChannel(channel);
            setInTransitMessages([]);
            setCurrentChannel(null);
        }
    }, [roomId]);

    return (
        <div className="flex h-[96%] flex-col w-full">
            <div className="flex flex-col w-full items-center justify-center">
                <h1>Chat Room: {roomId}</h1>
                <p>Status: {status}</p>
            </div>
            <div
                className="p-4 h-full overflow-y-scroll scrollbar-thin scrollbar-track-rounded-md scrollbar-thumb-rounded-md scrollbar-track-base-100 scrollbar-thumb-neutral">
                {isPersistedMessagesLoading && (
                    <div className="flex h-full justify-center items-center">
                        <Loading/>
                    </div>
                )}
                {persistedMessages && <ChatBox messages={persistedMessages}/>}
                {inTransitMessages && <ChatBox messages={inTransitMessages}/>}
            </div>
            <ChatInput/>
        </div>
    );
}
