import {
  fail,
  type Actions,
} from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import type { PageServerLoad } from './$types'
import { doRedirect } from '$lib/utils'
import { validateLogin } from '$lib/utils'

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth.validate()
  doRedirect(url, !!session)

  return {
    page: {
      title: 'Log in',
    },
    props: {
      title: 'Welcome back.',
      description: 'Let\'s get you back into your account.',
    }
  }
}

export const actions: Actions = {
  // Log in a user with a username and password
  default: async ({ request, locals, url }) => {
    let message = ''

    const formData = Object.fromEntries(await request.formData()) as Record<string, string>

    const validationResult = await validateLogin.safeParseAsync(formData)
    if (!validationResult.success) {
      message = validationResult.error.issues.map((issue) => issue.message).join(', ')
      return fail(400, { success: false, message })
    }

    const res = await auth.useKey('email', formData.email, formData.password)
      .then(async (key) => {
        const session = await auth.createSession(key.userId)
        locals.auth.setSession(session)
        return { success: true }
      })
      .catch((err: Error) => {
        switch(err.message) {
          case 'AUTH_INVALID_KEY_ID':
          case 'AUTH_INVALID_PASSWORD':
            message = 'Incorrect email or password'
            break
          default:
            message = 'Could not log in, please try again later'
            break
        }
        return { success: false }
      })

    if (!res.success) {
      return fail(400, { success: false, message })
    } else {
      doRedirect(url, true)
    }
  }
}
