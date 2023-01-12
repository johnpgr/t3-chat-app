import {signIn} from "next-auth/react";

export function Login() {
    return (
        <div>
            <button className="btn">Login with Google</button>
            <button className="btn">Login with Facebook</button>
            <button className="btn">Login with Discord</button>
            <button onClick={() => signIn("discord")} className="btn">
                Login with Github
            </button>
        </div>
    );
}
