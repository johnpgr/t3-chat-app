import {useChatInput} from "./useChatInput";

export function ChatInput() {
    const {register, handleSubmit, onSubmit} = useChatInput();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-2 flex gap-2">
            <input
                placeholder="Enter your message here"
                {...register("text")}
                type="text"
                className="input input-sm w-full max-w-none"
            />
            <button className="btn btn-sm btn-primary" type="submit">Send
            </button>
        </form>
    );
}
