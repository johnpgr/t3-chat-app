import { atom } from "jotai";

export enum View {
    ALL_ROOMS_VIEW = "ALL_ROOMS_VIEW",
    MY_ROOMS_VIEW = "MY_ROOMS_VIEW",
    INITIAL_VIEW = "INITIAL_VIEW",
    ROOM_VIEW = "ROOM_VIEW",
}

type CurrentView<V> = V extends View.ROOM_VIEW
    ? { view: V; roomId: string }
    : { view: V };

export const CurrentViewAtom = atom<CurrentView<View>>({
    view: View.INITIAL_VIEW,
} satisfies CurrentView<View.INITIAL_VIEW>);
