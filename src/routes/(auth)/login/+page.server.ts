import {
  fail,
  redirect,
  type Actions,
} from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, url }) => {
  const redirectTo = url.searchParams.get('redirectTo')
  const session = await locals.auth.validate()
  if (session) {
    if (redirectTo?.length) {
      throw redirect(302, `/${redirectTo.slice(1)}`)
    } else {
      throw redirect(302, '/')
    }
  }

  return {}
}

export const actions: Actions = {
  // Log in a user with a username and password
  default: async ({ request, locals, url }) => {
    let message = ''

    const { username, password } = Object.fromEntries(
      await request.formData()
    ) as Record<string, string>

    if (!username || !password) {
      message = 'Username and password are required'
      return fail(400, { success: false, message })
    }

    const res = await auth.useKey('username', username, password)
      .then(async (key) => {
        const session = await auth.createSession(key.userId)
        locals.auth.setSession(session)
        return { success: true }
      })
      .catch((err: Error) => {
        switch(err.message) {
          case 'AUTH_INVALID_KEY_ID':
          case 'AUTH_INVALID_PASSWORD':
            message = 'Invalid username or password'
            break
          default:
            message = 'Could not log in user'
            break
        }
        return { success: false }
      })

    if (!res.success) {
      return fail(400, { success: false, message })
    } else {
      const redirectTo = url.searchParams.get('redirectTo')
      if (redirectTo?.length) {
        throw redirect(302, `/${redirectTo.slice(1)}`)
      } else {
        throw redirect(302, '/')
      }
    }
  }
}
