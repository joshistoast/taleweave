import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import {
  redirect,
  fail,
  error,
  type Actions
} from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const session = await locals.auth.validate()
  const { id } = params

  // check if post userid matches session userid
  if (!session) {
    const fromUrl = url.pathname + url.search
    throw redirect(302, `/login?redirectTo=${fromUrl}`)
  }

  const post = await db.post.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      author: true,
    }
  })

  if (!post)
    throw error(404, 'Post not found')
  if (post.authorId !== session.userId)
    throw redirect(302, '/posts')

  return {
    post,
  }
}

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    let message = ''

    const session = await locals.auth.validate()
    const { id } = params

    if (!session)
      throw redirect(302, '/login')

    // get form data
    const {
      title,
      description,
      content,
      published,
    } = Object.fromEntries(await request.formData() ) as Record<string, string>

    if (!title || !content) {
      message = 'Title, description, and content are required'
      return fail(400, { success: false, message })
    }

    // check if post exists
    const post = await db.post.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        author: true,
      }
    })

    if (!post)
      return fail(404, { success: false, message: 'Post not found' })
    if (post.authorId !== session.userId)
      return fail(403, { success: false, message: 'You do not have permission to edit this post' })

    // update post
    const res = await db.post.update({
      where: {
        id: Number(id)
      },
      data: {
        title,
        description,
        content,
        published: published === 'true',
      },
    })
      .then((res) => {
        message = 'Post updated'
        return { success: true, message }
      })
      .catch((err: Error) => {
        message = 'Could not update post'
        // TODO: different error messages for different errors
        return { success: false }
      })

    if (!res.success)
      return fail(400, { success: false, message })
  }
}
