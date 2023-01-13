import {REALTIME_LISTEN_TYPES} from "@supabase/supabase-js";
import {useAtom} from "jotai";
import {useEffect, useRef, useState} from "react";
import {supabase} from "~/utils/supabase";
import type {Payload} from "~/types/realtime";
import {api, type RouterOutputs} from "~/utils/api";
import {ChatInput} from "../chat-input/ChatInput";
import {ChatBox} from "./ChatBox";
import {CurrentChannelAtom} from "~/atoms/CurrentChannel";
import {CurrentRoomAtom} from "~/atoms/CurrentRoom";
import {InTransitMessagesAtom} from "~/atoms/InTransitMessages";
import {useIsIntersecting} from "~/utils/hooks/useIsIntersecting";
import classNames from "classnames";
import {useSession} from "next-auth/react";
import {NewMessageToast} from "~/components/ui/NewMessageToast";

// export type Message = RouterOutputs["messages"]["list"]["messages"][number];
export type Message =
    RouterOutputs["messages"]["listInfinite"]["messages"][number];

export type MessagePayload = Payload<Message & { read: boolean }>;

export function ChatRoomView() {
    const [roomId] = useAtom(CurrentRoomAtom);
    const [isLoadMoreVisible, ref] = useIsIntersecting<HTMLDivElement>();
    const {data, isFetching, isInitialLoading, hasNextPage, fetchNextPage} =
        api.messages.listInfinite.useInfiniteQuery(
            {roomId: roomId!},
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
    const [chatBoxScrollHeight, setChatBoxScrollHeight] = useState(
        chatBoxRef?.current?.scrollHeight ?? 0
    );
    const {data: session} = useSession();
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
                {event: "MESSAGE"},
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
            setChatBoxScrollHeight(0);
            setCurrentChannel(null);
        };
        //eslint-disable-next-line react-hooks/exhaustive-deps
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

        const currScrollHeight = chatBoxRef?.current?.scrollHeight;

        if (!currScrollHeight) return;

        setChatBoxScrollHeight((prev) => {
            chatBoxRef?.current?.scrollTo({
                top: currScrollHeight - prev,
                behavior: "smooth",
            });
            return currScrollHeight;
        });
    }, [isFetching, isInitialLoading]);

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
    }, [inTransitMessages, session?.user?.id]);

    //new messages alert
    useEffect(() => {
        const lastMessageInTransit = inTransitMessages.at(-1);

        console.log(lastMessageInTransit)
        if (!lastMessageInTransit) return;


        if (!isLastMessageVisible && !lastMessageInTransit.read) {
            setNewMessagesAlert(true);
            return;
        }

        lastMessageInTransit.read = true;
        setNewMessagesAlert(false);
    }, [inTransitMessages, isLastMessageVisible, session?.user?.id]);

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
                {inTransitMessages && <ChatBox messages={inTransitMessages}/>}
                <div ref={lastMsgRef}/>
            </div>
            {newMessagesAlert && <NewMessageToast chatBoxRef={chatBoxRef}/>}
            {/*realtime channel status: {status} | {data?.pages.length} pages*/}
            {/*loaded | hasNextPage: {hasNextPage?.toString()} |*/}
            {/*isInitialLoading:{" "}*/}
            {/*chatBoxScrollHeight: {chatBoxScrollHeight} | isFetching :{" "}*/}
            {/*{isFetching.toString()} | newMessagesAlert:{" "}*/}
            {/*{newMessagesAlert.toString()} | isLastMessagesVisible:{" "}*/}
            {/*{isLastMessageVisible.toString()}*/}
            <ChatInput/>
        </div>
    );
}
