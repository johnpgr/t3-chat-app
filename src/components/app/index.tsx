import { api } from "~/utils/api";
import { useAtom } from "jotai";
import { Index } from "../ui/Sidebar";
import { CurrentViewAtom } from "../../atoms/CurrentView";
import { Topbar } from "../ui/Topbar";
import { ChatRoomView } from "./ChatRoomView";

export function App() {
    const roomsQuery = api.rooms.listOwned.useQuery();
    const [currentView] = useAtom(CurrentViewAtom);

    return (
        <>
            <Topbar />
            <Index menuItems={roomsQuery.data}>
                {"roomId" in currentView && <ChatRoomView />}
            </Index>
        </>
    );
}
