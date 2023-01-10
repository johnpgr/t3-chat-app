import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { roomsRouter } from "./routers/rooms";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter, rooms: roomsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
