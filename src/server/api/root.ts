import { createTRPCRouter } from "./trpc";
import { roomsRouter } from "./routers/rooms";
import { messagesRouter } from "./routers/messages";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
    rooms: roomsRouter,
    messages: messagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
