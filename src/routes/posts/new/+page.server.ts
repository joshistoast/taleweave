import db from '$lib/server/db'
import type { Post } from '@prisma/client'
import type { PageServerLoad } from './$types'
import { validatePost } from '$lib/utils'
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
      throw redirect(302, '/login?redirect=/posts/new')

    let message = ''

    const formData = Object.fromEntries(await request.formData()) as Record<string, string>
    const published = formData.published === 'true' ? true : false

    // Process Tags
    const tagNames = formData.tags.split(',').map((tag) => tag.trim())

    const validationResult = await validatePost.safeParseAsync(formData)
    if (!validationResult.success) {
      message = validationResult.error.issues.map((issue) => issue.message).join(', ')
      return fail(400, { success: false, message})
    }

    const newPost = await db.post.create({
      data: {
        ...formData,
        published,
        authorId: user.userId,
        tags: {
          connectOrCreate: tagNames.map((name) => ({
            create: { name },
            where: { name },
          })),
        },
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

    if (!newPost.success) {
      return fail(400, { success: false, message })
    } else {
      throw redirect(302, `/posts/${newPost.post.id}`)
    }
  },
}
