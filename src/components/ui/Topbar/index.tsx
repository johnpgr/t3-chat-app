import { NewRoomButton } from "./NewRoomButton";

export const TOPBAR_HEIGHT = "64px"

export function Topbar() {
    return (
        <nav style={{ height: TOPBAR_HEIGHT }} className="navbar border-b border-base-100 bg-base-200/30">
            <NewRoomButton />
        </nav>
    );
}
