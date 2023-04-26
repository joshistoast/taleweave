import { fail, redirect, type Actions } from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate()
  if (session) throw redirect(302, '/')
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    // retrieve form data
    const { username, password } = Object.fromEntries(
      await request.formData()
    ) as Record<string, string>

    // fail if either username or password is not of type string
    if ([username, password].some(x => typeof x !== 'string')) {
      return fail(400, { message: 'username or password are invalid' })
    }

    await auth.useKey('username', username, password)
      .then(async (key) => {
        const session = await auth.createSession(key.userId)
        locals.auth.setSession(session)
      })
      .catch((err) => {
        const e = err as Error
        console.error(e)
        if (e.message === 'AUTH_INVALID_CREDENTIALS') {
          return fail(400, { message: 'Invalid credentials' })
        }
        return fail(400, { message: 'Could not create user' })
      })
  }
}
