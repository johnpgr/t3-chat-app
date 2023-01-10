import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { roomInput } from "~/zod/inputs/rooms";

export const roomsRouter = createTRPCRouter({
    list: protectedProcedure.query(({ ctx }) => {
        const userId = ctx.session.user.id;
        return ctx.prisma.room.findMany({
            select: {
                id: true,
                name: true,
            },
            where: {
                RoomUser: {
                    some: {
                        userId,
                    },
                },
            },
        });
    }),
    create: protectedProcedure.input(roomInput).mutation(({ ctx, input }) => {
        const userId = ctx.session.user.id;
        return ctx.prisma.room.create({
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
