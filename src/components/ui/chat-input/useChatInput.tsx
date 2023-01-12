import { CurrentRoomAtom } from "~/components/app/atoms/CurrentView";
import { Message } from "~/components/app/ChatRoomView";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useAtom } from "jotai";
import { InTransitMessagesAtom } from "~/components/app/atoms/InTransitMessages";
import { useSession } from "next-auth/react";

export function useChatInput() {
    const { register, handleSubmit, reset } = useForm<{ text: string }>()
    const { mutate: persistMessage } = api.messages.create.useMutation();
    const [roomId] = useAtom(CurrentRoomAtom);
    const [, setInTransitMessages] = useAtom(InTransitMessagesAtom)
    const { data: currUserData } = useSession()

    function onSubmit(data: { text: string }) {
        if (!roomId) return;
        if (!currUserData?.user
            || !currUserData.user.name
            || !currUserData.user.image
        ) return;

        const message = {
            text: data.text,
            user: {
                id: currUserData.user?.id,
                name: currUserData.user.name,
                imageUrl: currUserData.user.image
            },
            createdAt: new Date()
        } satisfies Message;

        setInTransitMessages((messages) => [...messages, message])
        persistMessage({ text: data.text, roomId })

        reset();
    }

    return { register, handleSubmit, onSubmit }
}
