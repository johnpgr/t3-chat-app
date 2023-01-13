import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { supabase } from "~/utils/supabase";
import type { Payload } from "~/types/realtime";
import { api, type RouterOutputs } from "~/utils/api";
import { ChatInput } from "../chat-input/ChatInput";
import { ChatBox } from "./ChatBox";
import { Loading } from "../ui/Loading";
import { CurrentChannelAtom } from "~/atoms/CurrentChannel";
import { CurrentRoomAtom } from "~/atoms/CurrentView";
import { InTransitMessagesAtom } from "~/atoms/InTransitMessages";

export type Message = RouterOutputs["messages"]["list"][number];

type MessagePayload = Payload<Message>;

export function ChatRoomView() {
    const [roomId] = useAtom(CurrentRoomAtom);
    const { data: persistedMessages, isLoading: isPersistedMessagesLoading } =
        api.messages.list.useQuery(
            { roomId: roomId! },
            {
                enabled: Boolean(roomId),
                refetchOnWindowFocus: false,
            }
        );
    const [inTransitMessages, setInTransitMessages] = useAtom(
        InTransitMessagesAtom
    );
    const [status, setStatus] = useState("");
    const [, setCurrentChannel] = useAtom(CurrentChannelAtom);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!roomId) return;

        const channel = supabase.channel(roomId);

        channel
            .on(
                REALTIME_LISTEN_TYPES.BROADCAST,
                { event: "MESSAGE" },
                (payload: MessagePayload) => {
                    if (typeof payload.payload?.createdAt === "string") {
                        payload.payload.createdAt = new Date(
                            payload.payload.createdAt
                        );
                    }
                    setInTransitMessages((prev) => [...prev, payload.payload!]);
                }
            )
            .subscribe((status) => {
                setStatus(status);
            });

        setCurrentChannel(channel);

        return () => {
            channel && supabase.removeChannel(channel);
            setInTransitMessages([]);
            setCurrentChannel(null);
        };
    }, [roomId]);

    useEffect(() => {
        if (!chatBoxRef.current) return;
        chatBoxRef.current.scrollTo({
            top: chatBoxRef.current.scrollHeight,
        });
    }, [isPersistedMessagesLoading, roomId]);

    return (
        <div className="flex h-full flex-col">
            <div
                ref={chatBoxRef}
                className="h-full overflow-y-scroll p-4 scrollbar-thin scrollbar-track-base-100 scrollbar-thumb-neutral scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
            >
                {isPersistedMessagesLoading && (
                    <div className="flex h-full items-center justify-center">
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
