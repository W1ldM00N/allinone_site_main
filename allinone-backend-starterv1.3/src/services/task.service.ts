import { prisma } from "../lib/prisma.js";

export async function assignTask(
    username: string,
    title: string,
    description: string | null,
    xpReward: number,
    projectId: string,
    creatorId: string
) {
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });
    if (!user) {
        throw new Error("Pitiful Mortal not found my Lord");
    }
    const task = await prisma.task.create({
        data: {
            title,
            description,
            xpReward,
            projectId,
            assigneeId: user.id,
            creatorId,
        },
    });
    return task;
}
