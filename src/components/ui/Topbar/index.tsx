import {NewRoomButton} from "./NewRoomButton";

export const TOPBAR_HEIGHT = "64px"

export function Topbar() {
    return (
        <nav style={{height: TOPBAR_HEIGHT}}
             className="navbar bg-base-200 border-b border-neutral/50">
            <NewRoomButton/>
        </nav>
    );
}
