import classNames from "classnames";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import {
    CurrentRoomAtom,
    CurrentSidebarViewAtom,
    CurrentViewAtom,
    SidebarView,
    View
} from "~/components/app/atoms/CurrentView";
import { api } from "~/utils/api";
import { Loading } from "./Loading";
import { RoomEnterModal } from "./RoomEnterModal";
import { MenuItem } from "./Sidebar";

export function RoomsTab({ menuItems }: { menuItems: Array<MenuItem> }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTab, setCurrentTab] = useAtom(CurrentSidebarViewAtom);
    const [, setCurrentView] = useAtom(CurrentViewAtom)
    const [,setCurrentRoom] = useAtom(CurrentRoomAtom)
    const { data: allRooms, isLoading } = api.rooms.listAll.useQuery(undefined, {
        enabled: currentTab.view === SidebarView.ALL_ROOMS
    });
    const { data: session } = useSession()

    function handleEnterOwnRoom(roomId: string) {
        setCurrentView({ view: View.ROOM_VIEW, roomId });
        setCurrentRoom(roomId)
    }

    function handleChangeTab(view: SidebarView) {
        setCurrentTab({ view });
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
            <ul className="menu w-full p-4">
                {currentTab.view === SidebarView.MY_ROOMS &&
                    menuItems.map((room) => (
                        <li key={room.id}>
                            <button onClick={() => handleEnterOwnRoom(room.id)}>
                                {room.name}
                                <div className="flex items-center gap-1 text-xs opacity-50 ml-auto">
                                    {room._count.RoomUser} / {room.maxUsers}
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
                        {allRooms && allRooms.map((room) => (
                            room.RoomUser.some((user) =>
                                user.userId === session?.user?.id
                                && user.owner)
                                ? <li key={room.id}>
                                    <button onClick={() => handleEnterOwnRoom(room.id)}>
                                        {room.name}
                                        <div className="flex items-center gap-1 text-xs opacity-50 ml-auto">
                                            {room.RoomUser.length} / {room.maxUsers}
                                            <FaUser className="h-3" />
                                        </div>
                                    </button>
                                </li>
                                : <RoomEnterModal
                                    room={room}
                                    key={room.id}
                                    modalOpen={modalOpen}
                                    setModalOpen={setModalOpen}
                                >
                                    <li key={room.id}>
                                        <button onClick={() => setModalOpen(!modalOpen)}>
                                            {room.password && <FaLock className="h-3" />}
                                            {room.name}
                                            <div className="flex items-center gap-1 text-xs opacity-50 ml-auto">
                                                {room.RoomUser.length} / {room.maxUsers}
                                                <FaUser className="h-3" />
                                            </div>
                                        </button>
                                    </li>
                                </RoomEnterModal>
                        ))}
                    </>
                }
            </ul>
        </>
    );
}
