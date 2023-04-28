import type { PageServerLoad } from './$types'
import { redirect, error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, params, parent }) => {
  const session = await locals.auth.validate()
  const { username } = params

  if (!session) {
    const redirectTo = `/login?redirectTo=/authors/${username}/preferences`
    throw redirect(302, redirectTo)
  }

  const authorId = (await parent()).author.id
  const userId = session.userId

  if (authorId !== userId) {
    throw redirect(302, `/authors/${username}`)
  }
}
