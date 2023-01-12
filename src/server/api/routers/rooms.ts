import { createTRPCRouter, protectedProcedure } from "../trpc";
import { roomInput } from "~/zod/inputs/rooms";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const roomsRouter = createTRPCRouter({
    listAll: protectedProcedure.query(async ({ ctx }) => {
        const rooms = await ctx.prisma.room.findMany({
            select: {
                id: true,
                name: true,
                maxUsers: true,
                password: true,
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

        return rooms.map((room) => room.password
            ? { ...room, password: true }
            : { ...room, password: false });
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

    enter: protectedProcedure.input(z.object({
        roomId: z.string(),
        password: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.session.user;
        const { roomId, password } = input;

        const room = await ctx.prisma.room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!room) return null;

        if (password !== room.password) return null;

        return await ctx.prisma.roomUser.create({
            data: {
                room: {
                    connect: {
                        id: roomId,
                    }
                },
                user: {
                    connect: {
                        id: userId,
                    }
                },
            }
        })
    })
});
