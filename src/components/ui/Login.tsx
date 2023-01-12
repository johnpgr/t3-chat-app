import {signIn} from "next-auth/react";

export function Login() {
    return (
        <div className="h-screen flex justify-center items-center">
            {/*<button className="btn">Login with Google</button>*/}
            {/*<button className="btn">Login with Facebook</button>*/}
            {/*<button className="btn">Login with Discord</button>*/}
            <button onClick={() => signIn("discord")} className="btn">
                Login with Discord
            </button>
        </div>
    );
}
