import type { Actions, PageServerLoad } from './$types'
import db from '$lib/server/db'
import { error, fail, redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
  return {
    // return all posts with newest first
    // return author info for each post
    posts: await db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      }
    })
  }
}

export const actions: Actions = {

  createPost: async ({ request, locals }) => {

    const { user, session } = await locals.auth.validateUser()

    if (!(user && session))
      throw redirect(302, '/login')

    const { content } = Object.fromEntries(await request.formData()) as {
      content: string
    }

    if (!content) return fail(400, { message: 'Content is required' })

    await db.post.create({
      data: {
        content,
        authorId: user.userId,
      },
    })
      .catch(err => {
        console.error(err)
        return fail(500, { message: 'Something went wrong' })
      })
      .then(res => {
        return {
          status: 201,
        }
      })
  },

  deletePost: async ({ params, locals, url }) => {
    const { user, session } = await locals.auth.validateUser()

    if (!(user && session))
      throw redirect(302, '/login')

    const postId = url.searchParams.get('id')
  }

}
