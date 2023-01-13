import { RoomsTab } from "./RoomsTab";
import type { RouterOutputs } from "~/utils/api";
import { TOPBAR_HEIGHT } from "../Topbar";
import { Loading } from "../Loading";
import { useAtom } from "jotai";
import { isSidebarOpenAtom } from "~/atoms/SidebarOpen";
import classNames from "classnames";

export type MenuItem = RouterOutputs["rooms"]["listOwned"][number];

export function Index({
    children,
    menuItems,
}: {
    children: React.ReactNode;
    menuItems?: Array<MenuItem>;
}) {
    const [isOpen, setIsOpen] = useAtom(isSidebarOpenAtom);
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
            <div className="drawer-content overflow-hidden bg-base-300">
                <div
                    className={classNames(
                        "h-full overflow-hidden transition-all duration-300",
                        {
                            "w-[83vw] translate-x-80": isOpen,
                            "w-screen translate-x-0": !isOpen,
                        }
                    )}
                >
                    {children}
                </div>
            </div>
            <div className="drawer-side w-80 border-r border-neutral/50">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="drawer-overlay"
                />
                <div className="flex h-full flex-col items-center bg-base-100">
                    {menuItems && <RoomsTab menuItems={menuItems} />}
                    {!menuItems && <Loading />}
                </div>
            </div>
        </div>
    );
}
