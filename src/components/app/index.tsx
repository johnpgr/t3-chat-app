import {api} from "~/utils/api";
import {useAtom} from "jotai";
import {Sidebar} from "../ui/Sidebar";
import {CurrentViewAtom} from "./atoms/CurrentView";
import {Topbar} from "../ui/Topbar";
import {ChatRoomView} from "./ChatRoomView";

export function App() {
    const roomsQuery = api.rooms.listOwned.useQuery();
    const [currentView] = useAtom(CurrentViewAtom);

    return (
        <>
            <Topbar/>
            <Sidebar menuItems={roomsQuery.data}>
                {"roomId" in currentView && <ChatRoomView/>}
            </Sidebar>
        </>
    );
}
