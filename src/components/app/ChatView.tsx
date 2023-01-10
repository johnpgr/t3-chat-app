import { api } from "~/utils/api";
import { Sidebar } from "../ui/Sidebar";
import { useAtom } from "jotai";
import { CurrentViewAtom } from "./atoms/CurrentView";
import { Topbar } from "../ui/Topbar";

export function ChatView() {
    const roomsQuery = api.rooms.list.useQuery();
    const [currentView] = useAtom(CurrentViewAtom);

    return (
        <>
            <Topbar />
            <Sidebar menuItems={roomsQuery.data}>
                <div>
                    Current view: {currentView?.id ?? "no current view active."}
                </div>
            </Sidebar>
        </>
    );
}
