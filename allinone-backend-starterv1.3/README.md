# All-in-one backend starter
Fastify + TypeScript + Prisma + PostgreSQL scaffold.

1. Install Node.js and PostgreSQL
2. Copy `.env.local` to `.env` and adjust `DATABASE_URL`
3. Run `npm install`, then `npm run db:generate`, `npm run db:migrate`, and `npm run dev`

Endpoints: `GET /health`, `GET /api/tasks`

Данный черновик рассматривать исключительно в качестве template или стартера, полагаю. Требуется добавить далее предлагаю добавить лимиторы на заявки, ну и практически весь кабинет.