import {createClient} from "@supabase/supabase-js";
import {env} from "~/env/client.mjs"

export const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_URL,
    {
        realtime: {
            params: {
                eventsPerSecond: 10,
            },
        },
    }
);
