import { atom } from "jotai";
import { Message } from "~/components/app/ChatRoomView"

export const InTransitMessagesAtom = atom<Array<Message>>([])
