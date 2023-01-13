import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { supabase } from "~/utils/supabase";
import type { Payload } from "~/types/realtime";
import { api, type RouterOutputs } from "~/utils/api";
import { ChatInput } from "../chat-input/ChatInput";
import { ChatBox } from "./ChatBox";
import { CurrentChannelAtom } from "~/atoms/CurrentChannel";
import { CurrentRoomAtom } from "~/atoms/CurrentRoom";
import { InTransitMessagesAtom } from "~/atoms/InTransitMessages";
import { useIsIntersecting } from "~/utils/hooks/useIsIntersecting";
import classNames from "classnames";
import { useSession } from "next-auth/react";

// export type Message = RouterOutputs["messages"]["list"]["messages"][number];
export type Message =
    RouterOutputs["messages"]["listInfinite"]["messages"][number];

type MessagePayload = Payload<Message>;

export function ChatRoomView() {
    const [roomId] = useAtom(CurrentRoomAtom);
    const [isLoadMoreVisible, ref] = useIsIntersecting<HTMLDivElement>();
    const [currentMsgLimit, setCurrentMsgLimit] = useState(20);
    const {
        data,
        isFetching,
        isInitialLoading,
        isSuccess,
        hasNextPage,
        fetchNextPage,
    } = api.messages.listInfinite.useInfiniteQuery(
        { roomId: roomId! },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            enabled: Boolean(roomId),
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            staleTime: Infinity,
        }
    );
    const fetchNextPageRef = useRef(fetchNextPage);
    fetchNextPageRef.current = fetchNextPage;

    const [inTransitMessages, setInTransitMessages] = useAtom(
        InTransitMessagesAtom
    );
    const [status, setStatus] = useState("");
    const [, setCurrentChannel] = useAtom(CurrentChannelAtom);
    const chatBoxRef = useRef<HTMLDivElement>(null);
    const [chatBoxScrollHeigth, setChatBoxScrollHeigth] = useState(
        chatBoxRef?.current?.scrollHeight ?? 0
    );
    const { data: session } = useSession();
    const [isLastMessageVisible, lastMsgRef] =
        useIsIntersecting<HTMLDivElement>();
    const [newMessagesAlert, setNewMessagesAlert] = useState(false);

    // supabase realtime channel setup
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

    // initial messagebox scroll
    useEffect(() => {
        if (!chatBoxRef.current || isInitialLoading) return;
        chatBoxRef.current.scrollTo({
            top: chatBoxRef.current.scrollHeight,
        });
    }, [roomId, isInitialLoading]); // only scroll on the first message page load, and on roomId change

    // consecutive messagebox scrolls
    useEffect(() => {
        if (isInitialLoading) return;

        const currScrollHeigth = chatBoxRef?.current?.scrollHeight;

        if (!currScrollHeigth) return;

        setChatBoxScrollHeigth((prev) => {
            // console.log("curr-prev:",currScrollHeigth - prev)
            chatBoxRef?.current?.scrollTo({
                top: currScrollHeigth - prev,
                behavior: "smooth",
            });
            return currScrollHeigth;
        });
    }, [isFetching]);

    //fetch next page
    useEffect(() => {
        if (isLoadMoreVisible && hasNextPage && !isFetching) {
            void fetchNextPageRef.current();
        }
    }, [isLoadMoreVisible, hasNextPage, isFetching]);

    //scroll to bottom when user sends message
    useEffect(() => {
        if (inTransitMessages.at(-1)?.user.id === session?.user?.id) {
            chatBoxRef?.current?.scrollTo({
                top: chatBoxRef?.current?.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [inTransitMessages]);

    return (
        <div className="flex h-full flex-col">
            <div
                ref={chatBoxRef}
                className="h-full overflow-y-scroll p-4 scrollbar-thin scrollbar-track-base-100 scrollbar-thumb-neutral scrollbar-track-rounded-md scrollbar-thumb-rounded-md"
            >
                <div
                    className={classNames("", {
                        hidden: !data,
                    })}
                    ref={ref}
                />

                {data && (
                    <ChatBox
                        messages={data.pages
                            .map((page) => page.messages)
                            .flat()
                            .reverse()}
                    />
                )}
                {inTransitMessages && <ChatBox messages={inTransitMessages} />}
                <div ref={lastMsgRef} />
            </div>
            {/*{data?.pages.length} pages loaded | hasNextPage:{" "}*/}
            {/*{hasNextPage?.toString()} | isInitialLoading:{" "}*/}
            {/*{isInitialLoading.toString()} | isSuccess: {isSuccess.toString()} |*/}
            {/*chatBoxScrollHeigth: {chatBoxScrollHeigth} | isFetching :{" "}*/}
            {/*{isFetching.toString()} | newMessagesAlert:{" "}*/}
            {/*{newMessagesAlert.toString()} | isLastMessagesVisible:{" "}*/}
            {/*{isLastMessageVisible.toString()}*/}
            {/*<p>{newMessagesAlert && !isLastMessageVisible && "New messages"}</p>*/}
            <ChatInput />
        </div>
    );
}
