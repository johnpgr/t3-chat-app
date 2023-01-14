import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as console from "console";

export const messagesRouter = createTRPCRouter({
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
