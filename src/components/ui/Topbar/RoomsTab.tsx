import classNames from "classnames";
import { useAtom } from "jotai";
import { CurrentViewAtom, View } from "~/components/app/atoms/CurrentView";

export function RoomsTab() {
    const [currentTab, setCurrentTab] = useAtom(CurrentViewAtom);

    function handleChangeTab(view: View.MY_ROOMS_VIEW | View.ALL_ROOMS_VIEW) {
        setCurrentTab({ view });
    }

    return (
        <div className="tabs">
            <button
                onClick={() => handleChangeTab(View.MY_ROOMS_VIEW)}
                className={classNames("tab tab-lifted", {
                    "tab-active": currentTab.view === View.MY_ROOMS_VIEW,
                })}
            >
                My Rooms
            </button>
            <button
                onClick={() => handleChangeTab(View.ALL_ROOMS_VIEW)}
                className={classNames("tab tab-lifted", {
                    "tab-active": currentTab.view === View.ALL_ROOMS_VIEW,
                })}
            >
                All Rooms
            </button>
        </div>
    );
}
