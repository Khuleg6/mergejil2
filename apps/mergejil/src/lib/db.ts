import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Cache the client on `globalThis` in dev so Next.js hot-reload doesn't spin
// up a new connection pool on every module reload.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getConnectionString(): string {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new Error(
      'DATABASE_URL is not set. Add it to apps/mergejil/.env.local for local dev — see apps/mergejil/.env.local.example.',
    );
  }
  return value;
}

export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    // Prisma 7+ requires an explicit driver adapter — a bare `url` in the
    // datasource is no longer enough to connect.
    const adapter = new PrismaPg({ connectionString: getConnectionString() });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}
