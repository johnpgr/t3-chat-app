import { z } from "zod";

export const roomInput = z.object({
    name: z.string().min(1).max(16),
    password: z.string().max(32).optional(),
    maxUsers: z
        .number()
        .max(16, "Max users allowed: 16")
        .positive("At least 1 user is required")
        .or(z.nan().transform(() => 10)),
});

export type RoomInput = z.infer<typeof roomInput>;
