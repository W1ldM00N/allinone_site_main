import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { prisma } from "./db.js";
const app = Fastify({ logger: true });
await app.register(cors, { origin: ["http://localhost:5173", "http://127.0.0.1:5173"] });
app.get("/health", async () => ({ status: "ok" }));
const querySchema = z.object({ projectId: z.string().uuid().optional(), status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional() });
app.get("/api/tasks", async (request, reply) => {
 const parsed = querySchema.safeParse(request.query);
 if (!parsed.success) return reply.code(400).send({ error: "Invalid query parameters", details: parsed.error.flatten() });
 const tasks = await prisma.task.findMany({ where: { ...(parsed.data.projectId ? { projectId: parsed.data.projectId } : {}), ...(parsed.data.status ? { status: parsed.data.status } : {}) }, orderBy: { createdAt: "desc" }, include: { assignee: { select: { id: true, name: true, email: true } }, project: { select: { id: true, name: true } } } });
 return { data: tasks };
});
const port = Number(process.env.PORT ?? 3001);
try { await app.listen({ port, host: process.env.HOST ?? "127.0.0.1" }); } catch (e) { app.log.error(e); await prisma.$disconnect(); process.exit(1); }
const shutdown = async () => { await app.close(); await prisma.$disconnect(); process.exit(0); };
process.on("SIGINT", shutdown); process.on("SIGTERM", shutdown);
