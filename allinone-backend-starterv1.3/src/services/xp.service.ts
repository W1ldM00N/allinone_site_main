import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
export async function awardXP(
  userId: string,
  amount: number,
  taskId: string
) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Invalid XP amount");
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const transaction = await tx.xPTransaction.create({
      data: {
        userId,
        amount,
        reason: "Task completed",
        referenceId: taskId,
        idempotencyKey: 'task:${taskId}:xp',
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { xp: { increment: amount } },
    });

    return transaction;
  });
}