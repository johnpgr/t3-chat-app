import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { RoomInput, roomInput } from "~/zod/inputs/rooms";
import { zodResolver } from "@hookform/resolvers/zod";
export function useCreateRoomForm(
    setChecked: Dispatch<SetStateAction<boolean>>
) {
    const { rooms } = api.useContext();
    const { mutateAsync, isLoading, isError, error } =
        api.rooms.create.useMutation({
            onSuccess: () => {
                setChecked(false);
                rooms.listOwned.invalidate();
            },
        });

    const form = useForm<RoomInput>({
        resolver: zodResolver(roomInput),
    });

    async function onSubmit(data: RoomInput) {
        console.log({ newRoom: data });
        await mutateAsync(data);
        //check the checkbox
    }

    return { form, onSubmit, isLoading, isError, error };
}
