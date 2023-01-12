import {atom} from "jotai";

export enum View {
    INITIAL_VIEW = "INITIAL_VIEW",
    ROOM_VIEW = "ROOM_VIEW",
}

type CurrentView<V> = V extends View.ROOM_VIEW
    ? { view: V; roomId: string }
    : { view: V };

export const CurrentViewAtom = atom<CurrentView<View>>({
    view: View.INITIAL_VIEW,
} satisfies CurrentView<View.INITIAL_VIEW>);

export const CurrentRoomAtom = atom<string | null>(null);

export enum SidebarView {
    MY_ROOMS = "MY_ROOMS",
    ALL_ROOMS = "ALL_ROOMS"
}

type CurrentSidebarView = {
    view: SidebarView;
}

export const CurrentSidebarViewAtom = atom<CurrentSidebarView>({
    view: SidebarView.MY_ROOMS,
} satisfies CurrentSidebarView);

