import { RoomsTab } from "./RoomsTab";
import type { RouterOutputs } from "~/utils/api";
import { TOPBAR_HEIGHT } from "./Topbar";
import { Loading } from "./Loading";

export type MenuItem = RouterOutputs["rooms"]["listOwned"][number];

export function Sidebar({
    children,
    menuItems,
}: {
    children: React.ReactNode;
    menuItems?: Array<MenuItem>;
}) {
    return (
        <div
            className="drawer"
            style={{ height: `calc(100vh - ${TOPBAR_HEIGHT})` }}
        >
            <input
                defaultChecked
                id="sidebar-drawer"
                type="checkbox"
                className="drawer-toggle"
            />
            <div className="drawer-content flex flex-col bg-base-300">
                {children}
            </div>
            <div className="drawer-side w-80 border-r border-neutral/50">
                <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
                <div className="flex h-full flex-col items-center bg-base-100">
                    {menuItems && <RoomsTab menuItems={menuItems} />}
                    {!menuItems && <Loading />}
                </div>
            </div>
        </div>
    );
}
