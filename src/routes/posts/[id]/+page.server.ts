import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import {
  error,
  fail,
  redirect,
  type Actions,
} from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { id } = params

  const res = await (await fetch(`/api/posts/${id}`)).json()
  if (!res) {
    throw error(404, 'Post was either deleted or does not exist.')
  }

  return {
    ...res,
    page: {
      title: res.post.title,
      description: res.post.description,
      robots: res.post.published ? 'index, follow' : 'noindex, nofollow',
    },
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
      where: { id },
      include: {
        author: true,
      },
    })
    if (!post)
      return fail(404, { success: false, message: 'Post was either deleted or does not exist' })

    const isAuthorized = (post.author.id === user.userId) || user.role === 'admin'
    if (!isAuthorized)
      return fail(403, { success: false, message: 'You are not authorized to delete this post' })

    // delete bookmarks of the post
    await db.bookmark.deleteMany({
      where: { postId: id }
    })
      .catch((err) => {
        switch (err.message) {
          default:
            message = 'Could not delete bookmarks of the post'
        }
        return { success: false }
      })
    // delete scores of the post
    await db.score.deleteMany({
      where: { postId: id }
    })
      .catch((err) => {
        switch (err.message) {
          default:
            message = 'Could not delete scores of the post'
        }
        return { success: false }
      })

    // delete the post
    const res = await db.post.delete({
      where: { id }
    })
      .then(() => {
        return { success: true }
      })
      .catch((err) => {
        console.error(err)
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
  },
  bookmark: async ({ locals, params }) => {
    const { user, session } = await locals.auth.validateUser()
    const { id } = params

    if (!id)
      return fail(400, { success: false, message: 'Post ID is required' })
    if (!(user && session))
      throw redirect(302, `/login?redirectTo=/posts/${id}`)

    let message = ''
    let isBookmarked: boolean

    // check if the user has already bookmarked the post
    // if so, remove the bookmark
    const existingBookmark = await db.bookmark.findFirst({
      where: {
        postId: id,
        userId: user.userId,
      }
    })
    if (existingBookmark) {
      await db.bookmark.delete({
        where: {
          id: existingBookmark.id
        }
      })
      isBookmarked = false
      message = 'Bookmark removed'
    } else {
      // if not, create a new bookmark
      await db.bookmark.create({
        data: {
          postId: id,
          userId: user.userId,
        }
      })
      isBookmarked = true
      message = 'Bookmark added'
    }

    return {
      isBookmarked,
      success: true,
      message,
    }
  },
  feature: async ({ locals, params }) => {
    const { user, session } = await locals.auth.validateUser()

    if (!(user && session))
      throw redirect(302, `/login?redirectTo=/posts/${params.id}`)
    if (user.role !== 'admin')
      return fail(403, { success: false, message: 'You are not authorized to feature this post' })

    const { id } = params
    if (!id)
      return fail(400, { success: false, message: 'Post ID is required' })

    let message = ''
    let isFeatured: boolean

    // check if the post is already featured
    // if so, remove the feature
    const existingFeature = await db.post.findFirst({
      where: {
        id,
        featured: true,
      }
    })
    if (existingFeature) {
      await db.post.update({
        where: { id },
        data: {
          featured: false,
        }
      })
      isFeatured = false
      message = 'Removed featured status from the post'
    } else {
      // if not, feature the post
      await db.post.update({
        where: { id },
        data: {
          featured: true,
        }
      })
      isFeatured = true
      message = 'Post status changed to featured'
    }

    return {
      isFeatured,
      success: true,
      message,
    }
  },
  score: async ({ locals, params, request }) => {
    const { user, session } = await locals.auth.validateUser()
    const { id } = params

    const { value } = Object.fromEntries(await request.formData()) as Record<string, string>

    if (!(user && session))
      throw redirect(302, `/login?redirectTo=/posts/${params.id}`)
    if (!value)
      return fail(400, { success: false, message: 'Score is required' })

    let message = ''

    const post = await db.post.findUnique({
      where: { id },
      include: {
        author: true,
      }
    })

    if (!post)
      return fail(404, { success: false, message: 'Post was either deleted or does not exist' })
    if (post.authorId === user.userId)
      return fail(400, { success: false, message: 'You cannot score your own post' })

    // create or update score
    const existingScore = await db.score.findFirst({
      where: {
        postId: id,
        userId: user.userId,
      }
    })
    if (existingScore) {
      await db.score.update({
        where: { id: existingScore.id },
        data: {
          value: parseInt(value),
        }
      })
      message = 'Score updated'
    } else {
      await db.score.create({
        data: {
          postId: id,
          userId: user.userId,
          value: parseInt(value),
        }
      })
      message = 'Score added'
    }

    return {
      success: true,
      message,
    }
  },
  addComment: async ({ locals, params, request }) => {
    const { user } = await locals.auth.validateUser()
    const { id } = params

    if (!user?.userId)
      throw redirect(302, `/login?redirectTo=/posts/${params.id}#comments`)
    if (!id)
      return fail(400, { success: false, message: 'Post ID is required' })

    const { content } = Object.fromEntries(await request.formData()) as Record<string, string>

    let message = ''

    const comment = await db.comment.create({
      data: {
        content,
        userId: user.userId,
        postId: id,
      },
    })
      .then(() => {
        message = 'Comment added'
        return { success: true, message }
      })
      .catch((err) => {
        switch (err.message) {
          default:
            message = 'Could not add comment'
        }
        return { success: false, message }
      })

    if (!comment.success) {
      return fail(400, { success: false, message })
    }

    return {
      success: true,
      message,
    }
  },
}
