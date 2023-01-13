import { NewRoomButton } from "./NewRoomButton";
import { FaBars } from "react-icons/fa";

export const TOPBAR_HEIGHT = "64px";

export function Topbar() {
    return (
        <nav
            style={{ height: TOPBAR_HEIGHT }}
            className="navbar justify-between border-b border-neutral/50 bg-base-200"
        >
            <label htmlFor="sidebar-drawer" className="btn-ghost btn-circle btn text-2xl text-white transition-all">
                <FaBars />
            </label>
            <NewRoomButton />
        </nav>
    );
}
