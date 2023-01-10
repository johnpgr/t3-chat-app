import { NewRoomButton } from "./NewRoomButton";

export function Topbar() {
    return (
        <nav className="navbar border-b border-base-100 bg-base-200/30">
            <NewRoomButton />
        </nav>
    );
}
