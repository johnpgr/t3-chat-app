import { createTRPCRouter, protectedProcedure } from "../trpc";
import { roomInput } from "~/zod/inputs/rooms";

export const roomsRouter = createTRPCRouter({
    listAll: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.room.findMany({
            select: {
                id: true,
                name: true,
                maxUsers: true,
                _count: {
                    select: {
                        RoomUser: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }),

    listOwned: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        return await ctx.prisma.room.findMany({
            select: {
                id: true,
                name: true,
                maxUsers: true,
                _count: {
                    select: {
                        RoomUser: true,
                    }
                }
            },
            where: {
                RoomUser: {
                    some: {
                        userId,
                    },
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }),

    create: protectedProcedure.input(roomInput).mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        return await ctx.prisma.room.create({
            data: {
                name: input.name,
                password: input.password,
                maxUsers: input.maxUsers,
                RoomUser: {
                    create: {
                        userId,
                        owner: true,
                    },
                },
            },
        });
    }),
});
