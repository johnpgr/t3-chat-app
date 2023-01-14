import type {Message, MessagePayload} from "~/components/app/ChatRoomView";
import Image from "next/image";
import {format, isThisWeek, isToday} from "date-fns";
import classNames from "classnames";
import {useSession} from "next-auth/react";

export function ChatBox({messages}: { messages: Array<MessagePayload["payload"]> | Array<Message> }) {
    const {data: session} = useSession();
    return (
        <ul>
            {messages.map((message) => message && (
                <li
                    key={message.id}
                    className={classNames("chat", {
                        "chat-end": message.user.id === session?.user?.id,
                        "chat-start": message.user.id !== session?.user?.id,
                    })}
                >
                    <Image
                        src={message.user.image!}
                        alt={message.user.name!}
                        width={100}
                        height={100}
                        className="chat-image avatar w-10 rounded-full"
                    />
                    <div className="chat-header">
                        {message.user.name}{" "}
                        <time className="text-xs opacity-50">
                            {isThisWeek(message.createdAt)
                                ? isToday(message.createdAt)
                                    ? <>Today {" "}{format(message.createdAt, "HH:mm")}</>
                                    : format(message.createdAt, "EEEE HH:mm")
                                : format(message.createdAt, "dd/MM/yyyy HH:mm")
                            }
                        </time>
                    </div>
                    <div className="chat-bubble">{message.text}</div>
                </li>
            ))}
        </ul>
    );
}
