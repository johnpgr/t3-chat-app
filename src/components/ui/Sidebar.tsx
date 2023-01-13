import { RoomsTab } from "./RoomsTab";
import type { RouterOutputs } from "~/utils/api";
import { TOPBAR_HEIGHT } from "./Topbar";
import { Loading } from "./Loading";
import {useAtom} from "jotai";
import {SidebarOpenAtom} from "~/components/app/atoms/Sidebar";
import classNames from "classnames";

export type MenuItem = RouterOutputs["rooms"]["listOwned"][number];

export function Sidebar({
    children,
    menuItems,
}: {
    children: React.ReactNode;
    menuItems?: Array<MenuItem>;
}) {
    const [isOpen,setIsOpen] = useAtom(SidebarOpenAtom)
    return (
        <div
            className="drawer"
            style={{ height: `calc(100vh - ${TOPBAR_HEIGHT})` }}
        >
            <input
                readOnly
                checked={isOpen}
                id="sidebar-drawer"
                type="checkbox"
                className="drawer-toggle"
            />
            <div className="drawer-content bg-base-300 overflow-hidden">
                <div className={classNames("h-full transition-all duration-300 overflow-hidden",{
                    "translate-x-80 w-[83vw]": isOpen,
                    "translate-x-0 w-screen": !isOpen
                })}>
                    {children}
                </div>
            </div>
            <div className="drawer-side w-80 border-r border-neutral/50">
                <div onClick={()=> setIsOpen(!isOpen)}
                       className="drawer-overlay" />
                <div className="flex h-full flex-col items-center bg-base-100">
                    {menuItems && <RoomsTab menuItems={menuItems} />}
                    {!menuItems && <Loading />}
                </div>
            </div>
        </div>
    );
}