import { Message } from "~/components/app/ChatRoomView"
import Image from "next/image"
import { format, isToday } from "date-fns"

export function ChatBox({ messages }: { messages: Array<Message> }) {

    return (
        <ul>
            {messages.map((message) => (
                <li className="chat chat-start" key={message.id}>
                    <Image
                        src={message.user.image!}
                        alt={message.user.name!}
                        width={100}
                        height={100}
                        className="rounded-full chat-image avatar w-10"
                    />

                    <div className="chat-header">
                        {message.user.name}{" "}
                        <time className="text-xs opacity-50">
                            {isToday(message.createdAt)
                                ? (<>
                                    Today{" "}
                                    {format(new Date(message.createdAt),
                                        "HH:mm")}
                                </>)
                                : format(new Date(message.createdAt),
                                    "dd/MM/yyyy HH:mm")
                            }
                        </time>
                    </div>
                    <div className="chat-bubble">
                        {message.text}
                    </div>

                </li>
            ))}
        </ul>
    )
}
