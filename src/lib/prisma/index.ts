import { PrismaClient } from "@prisma/client";

console.log('Do not want this in same commit')

export const prisma = new PrismaClient({
  log: ['query']
});