import { auth } from '$lib/server/auth'
import { redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

// redirect to home if already has valid session
export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate()
  if (!session) {
    throw redirect(302, '/')
  }
  return {}
}

export const actions: Actions = {
  default: async ({ locals }) => {
    const session = await locals.auth.validate()

    if (!session)
      throw redirect(302, '/')

    await auth.invalidateSession(session.sessionId) // invalidate session
    locals.auth.setSession(null) // remove cookie
  }
}
