import db from '$lib/server/db'
import type { PageServerLoad } from './$types'
import {
  redirect,
  fail,
  type Actions
} from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate()
  if (!session) {
    throw redirect(302, '/login')
  }
  return {}
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { user, session } = await locals.auth.validateUser()

    if (!(user && session))
      throw redirect(302, '/login')

    const { content, title, description, published } = Object.fromEntries(await request.formData()) as Record<string, string>

    if (!content)
      return fail(400, { message: 'Content is required' })

    await db.post.create({
      data: {
        content,
        title,
        description,
        authorId: user.userId,
        published: published === 'true'
      },
    })
      .catch((err) => {
        console.error(err)
        return fail(500, { message: 'Something went wrong' })
      })
      .then((res) => {
        return {
          status: 201,
          post: res,
        }
      })
  },
}
