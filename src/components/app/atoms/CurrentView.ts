import { atom } from "jotai";

export type CurrentView = {
    id: string;
};

export const CurrentViewAtom = atom<CurrentView | null>(null);
