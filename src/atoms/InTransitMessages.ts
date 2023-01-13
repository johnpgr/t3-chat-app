import {atom} from "jotai";
import type {MessagePayload} from "~/components/app/ChatRoomView";

export const InTransitMessagesAtom = atom<Array<MessagePayload["payload"]>>([]);
