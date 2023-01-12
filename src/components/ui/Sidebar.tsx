import { useAtom } from "jotai";
import { Loading } from "./Loading";
import { CurrentViewAtom, CurrentRoomAtom, View } from "../app/atoms/CurrentView";
import { RoomsTab } from "./Topbar/RoomsTab";
import { RouterOutputs } from "~/utils/api"
import { TOPBAR_HEIGHT } from "./Topbar";

type MenuItem = RouterOutputs["rooms"]["list"][number]

export function Sidebar({ children, menuItems }
    : { children: React.ReactNode, menuItems?: Array<MenuItem> }) {
    const [, setCurrentView] = useAtom(CurrentViewAtom);
    const [, setRoomId] = useAtom(CurrentRoomAtom)

    function handleChangeView(id: string) {
        setCurrentView({ view: View.ROOM_VIEW, roomId: id });
        setRoomId(id);
    }

    return (
        <div className="drawer-mobile drawer" style={{ height: `calc(100vh - ${TOPBAR_HEIGHT})` }}>
            <input
                readOnly
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
