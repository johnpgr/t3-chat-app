import {atom} from "jotai";
import type {Message} from "~/components/app/ChatRoomView"

export const InTransitMessagesAtom = atom<Array<Message>>([])
