import { sveltekit } from 'lucia-auth/middleware'
import lucia from 'lucia-auth'
import prisma from '@lucia-auth/adapter-prisma'
import { dev } from '$app/environment'

import prismaClient from './db'

export const auth = lucia({
  adapter: prisma(prismaClient),
  env: dev ? 'DEV' : 'PROD',
  middleware: sveltekit(),
  transformDatabaseUser: (databaseUser) => {
    return {
      userId: databaseUser.id,
      email: databaseUser.email,
      username: databaseUser.username,
      displayName: databaseUser.displayName,
      role: databaseUser.role,
    }
  }
})

export type Auth = typeof auth
