import { useChatInput } from "./hooks/useChatInput";

export function ChatInput() {
    const { register, handleSubmit, onSubmit } = useChatInput();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 p-4">
            <input
                placeholder="Enter your message here"
                {...register("text")}
                type="text"
                className="input w-full max-w-none"
            />
            <button className="btn-primary btn" type="submit">
                Send
            </button>
        </form>
    );
}
