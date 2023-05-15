import { fail, redirect } from '@sveltejs/kit'
import { auth } from '$lib/server/auth'
import type { PageServerLoad, Actions } from './$types'
import { validateSignup } from '$lib/utils'

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate()
  if (session) {
    throw redirect(302, '/')
  }
  return {
    page: {
      title: 'Join Taleweave',
    },
    props: {
      title: 'Join Taleweave.',
      description: 'Create an account to access all of the features of the platform.',
    }
  }
}

export const actions: Actions = {
  default: async ({ request }) => {
    let message = ''

    const formData = Object.fromEntries(await request.formData()) as Record<string, string>

    const validationResult = await validateSignup.safeParseAsync(formData)
    if (!validationResult.success) {
      message = validationResult.error.issues.map((issue) => issue.message).join(', ')
      return fail(400, { success: false, message })
    }

    // create user
    const res = await auth.createUser({
      primaryKey: {
        providerId: 'email',
        providerUserId: formData.email,
        password: formData.password,
      },
      attributes: {
        email: formData.email,
        username: formData.username,
        displayName: formData.username,
      },
    })
      .then(() => {
        message = 'Successfully registered, now you can log in.'
        return { success: true, message }
      })
      .catch((err) => {
        const e = err as Error
        if (e.message === 'AUTH_DUPLICATE_KEY_ID') {
          message = 'An author with that username already exists'
        } else {
          message = 'Something went wrong with registration'
          console.error(e)
        }
        return { success: false }
      })

    if (!res.success)
      return fail(400, { success: false, message })
    else
      return { success: true, message }
  }
}
