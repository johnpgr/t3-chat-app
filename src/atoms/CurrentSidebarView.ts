import {atom} from "jotai";

export enum SidebarView {
    MY_ROOMS = "MY_ROOMS",
    ALL_ROOMS = "ALL_ROOMS",
}

type CurrentSidebarView = {
    view: SidebarView;
};

export const CurrentSidebarViewAtom = atom<CurrentSidebarView>({
    view: SidebarView.MY_ROOMS,
} satisfies CurrentSidebarView);
