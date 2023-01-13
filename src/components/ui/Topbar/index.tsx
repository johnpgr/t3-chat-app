import { NewRoomButton } from "./NewRoomButton";
import { FaBars } from "react-icons/fa";
import { useAtom } from "jotai";
import { isSidebarOpenAtom } from "~/atoms/SidebarOpen";

export const TOPBAR_HEIGHT = "64px";

export function Topbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
    return (
        <nav
            style={{ height: TOPBAR_HEIGHT }}
            className="navbar justify-between border-b border-neutral/50 bg-base-200"
        >
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="btn-ghost btn-circle btn text-2xl text-white transition-all"
            >
                <FaBars />
            </button>
            <NewRoomButton />
        </nav>
    );
}
