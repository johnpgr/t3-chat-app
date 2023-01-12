import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const messagesRouter = createTRPCRouter({

    list: protectedProcedure.input(z.object({
        roomId: z.string()
    })).query(async ({ ctx, input }) => {
        const { roomId } = input;
        return await ctx.prisma.message.findMany({
            select: {
                text: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                createdAt: true,
            },
            where: {
                roomId
            }
        })
    }),

    create: protectedProcedure.input(z.object({
        text: z.string(),
        roomId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const { text, roomId } = input;
        const { id: userId } = ctx.session.user;

        return await ctx.prisma.message.create({
            data: {
                text,
                room: {
                    connect: {
                        id: roomId
                    }
                },
                user: {
                    connect: {
                        id: userId
                    }
                },
            }
        })
    })
})
