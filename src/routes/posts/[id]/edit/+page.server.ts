import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import {
  redirect,
  fail,
  error,
  type Actions
} from '@sveltejs/kit'
import { validatePost } from '$lib/utils'

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const session = await locals.auth.validate()
  const { id } = params

  // check if post userid matches session userid
  if (!session) {
    const fromUrl = url.pathname + url.search
    throw redirect(302, `/login?redirectTo=${fromUrl}`)
  }

  const post = await db.post.findUnique({
    where: { id },
    include: {
      author: true,
      tags: true,
    }
  })

  if (!post)
    throw error(404, 'Post not found')
  if (post.author.id !== session.userId)
    throw redirect(302, '/posts')

  return {
    post,
    page: {
      title: 'Edit Post',
      description: 'Edit your post',
      robots: 'noindex, nofollow',
    },
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
    const formData = Object.fromEntries(await request.formData()) as Record<string, string>
    const published = formData.published === 'true' ? true : false

    const validationResult = await validatePost.safeParseAsync(formData)
    if (!validationResult.success) {
      message = validationResult.error.issues.map((issue) => issue.message).join(', ')
      return fail(400, { success: false, message })
    }

    // check if post exists
    const post = await db.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
      }
    })

    if (!post)
      return fail(404, { success: false, message: 'Post not found' })
    if (post.author.id !== session.userId)
      return fail(403, { success: false, message: 'You do not have permission to edit this post' })

    // Process Tags
    const tagNames = formData.tags.split(',').map((tag) => tag.trim())
    const tagsToRemove = post.tags.filter((tag) => !tagNames.includes(tag.name))

    // update post
    const res = await db.post.update({
      where: { id },
      data: {
        ...formData,
        published,
        tags: {
          connectOrCreate: tagNames.map((name) => ({
            create: { name },
            where: { name },
          })),
          disconnect: tagsToRemove.map((tag) => ({ id: tag.id })),
        },
      },
    })
      .then(() => {
        message = 'Post updated'
        return { success: true, message }
      })
      .catch((err: Error) => {
        switch(err.message) {
          default:
            message = 'Could not update post'
        }
        return { success: false }
      })

    if (!res.success)
      return fail(400, { success: false, message })
    else
      return { success: true, message }
  }
}
