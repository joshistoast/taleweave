import type { PrismaClient } from '@prisma/client'
import type { AuthRequest } from 'lucia-auth'
// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals extends AuthRequest {
      auth: import('lucia-auth').AuthRequest
    }
    // interface PageData {}
    // interface Platform {}
  }
  let __prisma: PrismaClient

  namespace Lucia {
    type Auth = import('$lib/server/auth').Auth
    type UserAttributes = import('@prisma/client').User
  }
}

// leave this the fuck alone
export {}
