export function NewMessageToast({chatBoxRef}: { chatBoxRef: React.RefObject<HTMLDivElement> }) {
    function handleScrollToBottom() {
        chatBoxRef.current?.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth"
        })
    }

    return (
        <div className="toast toast-center w-max mb-16">
            <div className="alert alert-info">
                <button onClick={handleScrollToBottom}>
                    <span>New messages received</span>
                </button>
            </div>
        </div>
    )
}