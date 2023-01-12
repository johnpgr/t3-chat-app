import { RoomsTab } from "./Topbar/RoomsTab";
import { RouterOutputs } from "~/utils/api"
import { TOPBAR_HEIGHT } from "./Topbar";
import { Loading } from "./Loading";

export type MenuItem = RouterOutputs["rooms"]["listOwned"][number]

export function Sidebar({ children, menuItems }
    : { children: React.ReactNode, menuItems?: Array<MenuItem> }) {
    return (
        <div className="drawer-mobile drawer"
            style={{ height: `calc(100vh - ${TOPBAR_HEIGHT})` }}>
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
            <div className="drawer-side w-80">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <div className="h-full bg-base-100 flex flex-col items-center">
                    {menuItems && <RoomsTab menuItems={menuItems} />}
                    {!menuItems && <Loading />}
                </div>
            </div>
        </div>
    );
};
