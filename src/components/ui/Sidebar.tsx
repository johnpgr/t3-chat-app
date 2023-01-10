import Link from "next/link";
import { type Room } from "@prisma/client";
import { Loading } from "./Loading";
import { useAtom } from "jotai";
import { CurrentViewAtom, View } from "../app/atoms/CurrentView";
import { RoomsTab } from "./Topbar/RoomsTab";

type MenuItem = Pick<Room, "id" | "name">;

export const Sidebar: React.FC<{
    children: React.ReactNode;
    menuItems?: Array<MenuItem>;
}> = ({ children, menuItems }) => {
    const [, setCurrentView] = useAtom(CurrentViewAtom);

    function handleChangeView(id: string) {
        setCurrentView({ view: View.ROOM_VIEW, roomId: id });
    }

    return (
        <div className="drawer-mobile drawer">
            <input
                checked
                id="my-drawer-2"
                type="checkbox"
                className="drawer-toggle"
            />
            <div className="drawer-content flex flex-col bg-base-300">
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu w-80 border-r border-base-100 bg-base-200 p-4 text-base-content">
                    <RoomsTab />
                    {menuItems?.map((item) => (
                        <li key={item.id}>
                            <button onClick={() => handleChangeView(item.id)}>
                                {item.name}
                            </button>
                        </li>
                    ))}
                    {!menuItems && <Loading />}
                </ul>
            </div>
        </div>
    );
};
