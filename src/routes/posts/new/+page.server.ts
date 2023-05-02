import db from '$lib/server/db'
import type { Post } from '@prisma/client'
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

  return {
    page: {
      title: 'New Post',
      description: 'Create a new post',
      robots: 'noindex, nofollow',
    }
  }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { user, session } = await locals.auth.validateUser()

    if (!(user && session))
      throw redirect(302, '/login')

    let message = ''

    const {
      content,
      title,
      description,
      published
    } = Object.fromEntries(await request.formData()) as Record<string, string>

    const minContentLength = 50
    if (!content?.length)
      return fail(400, { success: false, message: 'Content is required' })
    if (content.length < minContentLength)
      // TODO: Properly count characters in richtext
      return fail(400, { success: false, message: 'Content is too short' })

    const res = await db.post.create({
      data: {
        content,
        title,
        description,
        authorId: user.userId,
        published: published === 'true'
      },
    })
      .catch((err: Error) => {
        switch (err.message) {
          default:
            message = 'Could not create post'
        }
        return { success: false }
      })
      .then((res) => {
        message = 'Post created!'
        const post = res as Post // because for some reason it's not typed as Post already
        return { success: true, post }
      })

    if (!res.success) {
      return fail(400, { success: false, message })
    } else {
      throw redirect(302, `/posts/${res.post.id}`)
    }
  },
}
