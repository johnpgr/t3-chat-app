import { CurrentRoomAtom } from "~/components/app/atoms/CurrentView";
import { Message } from "~/components/app/ChatRoomView";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useAtom } from "jotai";
import { InTransitMessagesAtom } from "~/components/app/atoms/InTransitMessages";
import { useSession } from "next-auth/react";
import cuid from "cuid";
import { CurrentChannelAtom } from "~/components/app/atoms/CurrentChannel";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";

export function useChatInput() {
    const { register, handleSubmit, reset } = useForm<{ text: string }>()
    const { mutate: persistMessage } = api.messages.create.useMutation();
    const [roomId] = useAtom(CurrentRoomAtom);
    const [, setInTransitMessages] = useAtom(InTransitMessagesAtom)
    const { data: currUserData } = useSession()
    const [currentChannel] = useAtom(CurrentChannelAtom);

    function onSubmit(data: { text: string }) {
        if (!roomId) return;
        //TODO: handle user with no image, instead of exiting the function
        if (!currUserData?.user
            || !currUserData.user.name
            || !currUserData.user.image
        ) return;
        if (!currentChannel) return;

        const message = {
            id: cuid(),
            text: data.text,
            user: {
                id: currUserData.user?.id,
                name: currUserData.user.name,
                image: currUserData.user.image
            },
            createdAt: new Date()
        } satisfies Message;

        currentChannel.send({
            type: REALTIME_LISTEN_TYPES.BROADCAST,
            event: "MESSAGE",
            payload: message,
        });

        setInTransitMessages((messages) => [...messages, message])
        persistMessage({ text: data.text, roomId })

        reset();
    }

    return { register, handleSubmit, onSubmit }
}
