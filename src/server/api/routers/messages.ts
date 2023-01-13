import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as console from "console";

export const messagesRouter = createTRPCRouter({
    list: protectedProcedure
        .input(
            z.object({
                roomId: z.string(),
                currentMsgLimit: z.number(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { roomId, currentMsgLimit } = input;

            const _nthLatestMsg = await ctx.prisma.message.findFirst({
                skip: currentMsgLimit,
                where: {
                    roomId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            let cursor: string | undefined = _nthLatestMsg?.id;

            //the current limit surpassed number of total messages
            if (!_nthLatestMsg) {
                const firstMsg = await ctx.prisma.message.findFirst({
                    where: {
                        roomId,
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                });
                cursor = firstMsg?.id;
            }

            const messages = await ctx.prisma.message.findMany({
                cursor: {
                    id: cursor,
                },
                select: {
                    id: true,
                    text: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    createdAt: true,
                },
                where: {
                    roomId,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });

            return {
                messages,
                fetchedAll: !_nthLatestMsg,
            };
        }),

    listInfinite: protectedProcedure
        .input(
            z.object({
                cursor: z.string().optional(),
                limit: z.number().optional(),
                roomId: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { roomId, cursor } = input;
            const limit = input.limit ?? 20;

            const messages = await ctx.prisma.message.findMany({
                take: limit + 1,
                where: {
                    roomId: roomId,
                },
                select: {
                    id: true,
                    text: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    createdAt: true,
                },
                cursor: cursor ? {id: cursor} : undefined,
                orderBy: {
                    createdAt: "desc",
                },
            });

            let nextCursor: typeof cursor | undefined = undefined;

            if (messages.length > limit) {
                const lastMessage = messages.pop();
                nextCursor = lastMessage?.id;
            }

            return {
                messages,
                nextCursor,
            };
        }),

    create: protectedProcedure
        .input(
            z.object({
                text: z.string(),
                roomId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { text, roomId } = input;
            const { id: userId } = ctx.session.user;

            return await ctx.prisma.message.create({
                data: {
                    text,
                    room: {
                        connect: {
                            id: roomId,
                        },
                    },
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });
        }),
});
