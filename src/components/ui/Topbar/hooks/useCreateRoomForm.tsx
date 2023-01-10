import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { RoomInput } from "~/zod/inputs/rooms";

export function useCreateRoomForm(
    setChecked: Dispatch<SetStateAction<boolean>>
) {
    const { rooms } = api.useContext();
    const { mutateAsync, isLoading, isError, error } =
        api.rooms.create.useMutation({
            onSuccess: () => {
                setChecked(false);
                rooms.list.invalidate();
            },
        });

    const form = useForm<RoomInput>();

    async function onSubmit(data: RoomInput) {
        console.log({ newRoom: data });
        await mutateAsync(data);
        //check the checkbox
    }

    return { form, onSubmit, isLoading, isError, error };
}
