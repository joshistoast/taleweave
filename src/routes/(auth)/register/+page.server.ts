import { error, fail, redirect } from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import type { PageServerLoad, Actions } from './$types'

// redirect to home if already has valid session
export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate()
  if (session) {
    throw redirect(302, '/')
  }
  return {
    page: {
      title: 'Register a new account',
    }
  }
}

export const actions: Actions = {
  // Register a new user with a username and password
  default: async ({ request }) => {
    let message = ''

    const { username, password } = Object.fromEntries(
      await request.formData()
    ) as Record<string, string>

    if (!username || !password) {
      message = 'Username and password are required'
      return fail(400, { success: false, message })
    }

    // create user
    const res = await auth.createUser({
      primaryKey: {
        providerId: 'username',
        providerUserId: username,
        password
      },
      attributes: {
        username,
      },
    })
      .then(() => {
        message = 'Successfully registered, now you can log in.'
        return { success: true, message }
      })
      .catch((err) => {
        const e = err as Error
        console.error(e.message)
        if (e.message === 'AUTH_DUPLICATE_KEY_ID') {
          message = 'An author with that username already exists'
        } else {
          message = 'Something went wrong with registration'
        }
        return { success: false }
      })

    if (!res.success)
      return fail(400, { success: false, message })
    else
      return { success: true, message }
  }
}
