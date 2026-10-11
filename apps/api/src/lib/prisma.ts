import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://portal:portal@localhost:5432/portal_estilo_luxo",
    },
  },
});

export const prismaReplica = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_REPLICA_URL ||
        process.env.DATABASE_URL ||
        "postgresql://portal:portal@localhost:5432/portal_estilo_luxo",
    },
  },
});
