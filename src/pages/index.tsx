import { useSession } from "next-auth/react";
import { ChatView } from "~/components/app/ChatView";
import { Loading } from "~/components/ui/Loading";
import { Login } from "~/components/ui/Login";

export default function Home() {
    const { data, status } = useSession();

    if (status === "loading") return <Loading />;
    if (status === "unauthenticated") return <Login />;

    return <ChatView />;
}
