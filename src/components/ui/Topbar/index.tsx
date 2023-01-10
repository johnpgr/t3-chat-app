import { BsPlusLg } from "react-icons/bs";
import { useCreateRoomForm } from "./hooks/useCreateRoomForm";
import { Loading } from "../Loading";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export function Topbar() {
    const [checked, setChecked] = useState(false);

    //passing the setChecked function to the hook, to automatically close the modal after the room is created
    const { form, onSubmit, isLoading } = useCreateRoomForm(setChecked);

    function handleToggleModal() {
        setChecked(!checked);
    }

    return (
        <>
            <nav className="navbar border-b border-base-100 bg-base-200/30">
                <label
                    onClick={handleToggleModal}
                    htmlFor="my-modal"
                    className="btn-ghost btn-circle btn text-2xl text-white transition-all "
                >
                    <BsPlusLg />
                </label>
            </nav>

            <input
                type="checkbox"
                id="my-modal"
                className="modal-toggle"
                checked={checked}
            />

            <div className="modal">
                <div className="modal-box relative">
                    <button
                        onClick={handleToggleModal}
                        className="btn-sm btn-circle btn  absolute top-2 right-2"
                    >
                        <IoClose className="text-lg" />
                    </button>
                    <form
                        className="form-control gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                {...form.register("name", { required: true })}
                                type="text"
                                placeholder="Name"
                                className="input-bordered input"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Password (optional)
                                </span>
                            </label>
                            <input
                                {...form.register("password")}
                                type="password"
                                placeholder="Password"
                                className="input-bordered input"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Max users (default:10)
                                </span>
                            </label>
                            <input
                                {...form.register("maxUsers", {
                                    valueAsNumber: true,
                                })}
                                type="number"
                                placeholder="Max users"
                                className="input-bordered input"
                            />
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn-primary btn">
                                {isLoading && <Loading />} Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
