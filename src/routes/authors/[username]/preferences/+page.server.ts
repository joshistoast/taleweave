import type { PageServerLoad } from './$types'
import { redirect, error, fail, type Actions } from '@sveltejs/kit'
import { validateUserPreferences } from '$lib/utils'
import db from '$lib/server/db'

export const load: PageServerLoad = async ({ locals, params, parent }) => {
  const { session, user } = await locals.auth.validateUser()
  const { username } = params

  if (!session || user.username !== username) {
    const redirectTo = `/login?redirectTo=/authors/${username}/preferences`
    throw redirect(302, redirectTo)
  }

  const userData = await db.authUser.findUnique({
    where: { username },
  })

  return {
    page: {
      title: 'Preferences',
      robots: 'noindex',
    },
    props: {
      user: userData,
    }
  }
}

export const actions: Actions = {
  // set user preferences
  default: async ({ request, params, locals }) => {
    const { username } = params
    const { session, user } = await locals.auth.validateUser()

    if (!session || user.username !== params.username) {
      throw redirect(302, `/login?redirectTo=/authors/${username}/preferences`)
    }

    let message = ''

    // get form data
    const formData = Object.fromEntries(await request.formData()) as Record<string, string>
    const validationResult = await validateUserPreferences.safeParseAsync(formData)
    if (!validationResult.success) {
      message = validationResult.error.issues.map((issue) => issue.message).join(', ')
      return fail(500, { success: false, message })
    }

    const { bio, displayName } = validationResult.data

    // update user
    const updatedUser = await db.authUser.update({
      where: { id: user.userId },
      data: {
        bio,
        displayName,
      }
    })
      .then((user) => {
        message = 'Preferences updated'
        return { success: true, message, user }
      })
      .catch((err) => {
        message = err.message
        return { success: false, message }
      })

    if (!updatedUser.success) {
      return fail(500, { success: false, message, updatedUser })
    } else {
      return { success: true, message, updatedUser }
    }
  }
}
