import { useSession } from "next-auth/react";
import { App } from "~/components/app";
import { Loading } from "~/components/ui/Loading";
import { Login } from "~/components/ui/Login";

export default function Home() {
    const { status } = useSession();

    if (status === "loading")
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading />
            </div>
        );
    if (status === "unauthenticated") return <Login />;

    return <App />;
}
