import { RealtimeChannel } from "@supabase/supabase-js";
import { atom } from "jotai";

export const CurrentChannelAtom = atom<RealtimeChannel | null>(null);

