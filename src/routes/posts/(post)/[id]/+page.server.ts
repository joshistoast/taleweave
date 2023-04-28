import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import {
  error,
  fail,
  redirect,
  type Actions,
} from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params

  const post = await db.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  })

  if (!post) {
    throw error(404, 'Post was either deleted or does not exist.')
  }

  return {
    post,
  }
}

export const actions: Actions = {
  delete: async ({ locals, params }) => {
    const { user, session } = await locals.auth.validateUser()

    // if the user is not logged in, redirect to login page
    if (!(user && session))
      throw redirect(302, '/login')

    let message = ''

    // if the post ID is not provided, return 400
    const { id } = params
    if (!id)
      return fail(400, { success: false, message: 'Post ID is required' })

    // get the post from the database
    const post = await db.post.findUniqueOrThrow({
      where: { id }
    })

    // if the user is not the author of the post, return 403
    if (post.authorId !== user.userId)
      return fail(403, { success: false, message: 'You are not authorized to delete this post' })

    // delete the post
    const res = await db.post.delete({
      where: { id }
    })
      .then(() => {
        return { success: true }
      })
      .catch((err) => {
        switch (err.message) {
          default:
            message = 'Could not delete post'
        }
        return { success: false }
      })

    if (!res.success) {
      return fail(400, { success: false, message })
    } else {
      throw redirect(302, '/posts')
    }
  }
}
