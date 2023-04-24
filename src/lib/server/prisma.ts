// Protects against multiple instances of PrismaClient in development

import { PrismaClient } from '@prisma/client'
import { env } from '$env/dynamic/private'

const prisma: PrismaClient = global.__prisma || new PrismaClient()

if (env.NODE_ENV === 'development') {
  global.__prisma = prisma
}

export { prisma }
