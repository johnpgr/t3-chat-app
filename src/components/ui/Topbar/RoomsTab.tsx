import classNames from "classnames";
import { useAtom } from "jotai";
import { FaUser } from "react-icons/fa";
import {
    CurrentRoomAtom,
    CurrentSidebarViewAtom,
    CurrentViewAtom,
    SidebarView,
    View
} from "~/components/app/atoms/CurrentView";
import { api } from "~/utils/api";
import { Loading } from "../Loading";
import { MenuItem } from "../Sidebar";

export function RoomsTab({ menuItems }: { menuItems: Array<MenuItem> }) {
    const [currentTab, setCurrentTab] = useAtom(CurrentSidebarViewAtom);
    const [, setCurrentView] = useAtom(CurrentViewAtom);
    const [, setRoomId] = useAtom(CurrentRoomAtom);
    const { data: allRooms, isLoading } = api.rooms.listAll.useQuery(undefined, {
        enabled: currentTab.view === SidebarView.ALL_ROOMS
    })

    function handleChangeTab(view: SidebarView) {
        setCurrentTab({ view });
    }

    function handleEnterRoom(id: string) {
        setCurrentView({ view: View.ROOM_VIEW, roomId: id });
        setRoomId(id);
    }

    return (
        <>
            <div className="tabs tabs-boxed mt-4">
                <button
                    onClick={() => handleChangeTab(SidebarView.MY_ROOMS)}
                    className={classNames("tab", {
                        "tab-active": currentTab.view === SidebarView.MY_ROOMS,
                    })}
                >
                    My Rooms
                </button>
                <button
                    onClick={() => handleChangeTab(SidebarView.ALL_ROOMS)}
                    className={classNames("tab", {
                        "tab-active": currentTab.view === SidebarView.ALL_ROOMS,
                    })}
                >
                    All Rooms
                </button>
            </div>
            <ul className="menu w-full p-4 text-base-content">
                {currentTab.view === SidebarView.MY_ROOMS &&
                    menuItems.map((item) => (
                        <li key={item.id}>
                            <button onClick={() => handleEnterRoom(item.id)}>
                                {item.name}
                                <div className="flex items-center gap-1 text-xs opacity-50 ml-auto">
                                    {item._count.RoomUser} / {item.maxUsers}
                                    <FaUser className="h-3" />
                                </div>
                            </button>
                        </li>
                    ))}
                {currentTab.view === SidebarView.ALL_ROOMS &&
                    <>
                        {isLoading &&
                            <div className="pt-4 flex items-center justify-center">
                                <Loading />
                            </div>}
                        {allRooms && allRooms.map((item) => (
                            <li key={item.id}>
                                <button onClick={() => handleEnterRoom(item.id)}>
                                    {item.name}
                                    <div className="flex items-center gap-1 text-xs opacity-50 ml-auto">
                                        {item._count.RoomUser} / {item.maxUsers}
                                        <FaUser className="h-3" />
                                    </div>
                                </button>
                            </li>
                        ))}
                    </>
                }
            </ul>
        </>
    );
}
