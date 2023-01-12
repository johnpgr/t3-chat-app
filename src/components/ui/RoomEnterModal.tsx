import { useAtom } from "jotai";
import { SetStateAction, useState } from "react";
import { createPortal, findDOMNode } from "react-dom";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { api, RouterOutputs } from "~/utils/api"
import { CurrentRoomAtom, CurrentViewAtom, View } from "../app/atoms/CurrentView";
import { Loading } from "./Loading";

type Props = {
    room: RouterOutputs["rooms"]["listAll"][number];
    modalOpen: boolean;
    setModalOpen: React.Dispatch<SetStateAction<boolean>>;
    children: React.ReactNode;
}

type RoomEnterData = {
    password: string;
}

export function RoomEnterModal({ room, children, modalOpen, setModalOpen }: Props) {
    const [, setRoomId] = useAtom(CurrentRoomAtom);
    const [, setCurrentView] = useAtom(CurrentViewAtom);
    const { mutateAsync: enterRoom, isLoading } = api.rooms.enter.useMutation();
    const { register, handleSubmit } = useForm<RoomEnterData>()
    const [error, setError] = useState("")

    function handleToggleModal() {
        setModalOpen(!modalOpen);
    }

    async function onSubmit(data: RoomEnterData) {
        const { password } = data;
        const roomEntered = Boolean(await enterRoom({ roomId: room.id, password }));

        if (!roomEntered) {
            setError("Wrong password!")
            return;
        };

        setCurrentView({ view: View.ROOM_VIEW, roomId: room.id });
        setRoomId(room.id);
    }

    const modalId = `modal-room-${room.id}`;

    return (
        <div>
            <label
                onClick={handleToggleModal}
                htmlFor={modalId}
            >
                {children}
            </label>
            <input
                type="checkbox"
                id={modalId}
                className="modal-toggle"
                checked={modalOpen}
                readOnly
            />

            <div className="modal">
                <div className="modal-box relative">
                    <button
                        onClick={handleToggleModal}
                        className="btn-sm btn-circle btn absolute top-2 right-2"
                    >
                        <IoClose className="text-lg" />
                    </button>
                    <form
                        className="form-control gap-2"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h3 className="text-center font-bold">{room.name}</h3>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                {...register("password", { required: true })}
                                type="password"
                                placeholder="Password"
                                className="input-bordered input"
                            />
                        </div>
                        <div className="modal-action">
                            <button
                                type="submit"
                                className="btn-primary btn w-full gap-2"
                            >
                                {isLoading && <Loading />} Enter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
