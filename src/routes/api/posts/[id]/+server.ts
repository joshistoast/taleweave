import type { RequestHandler } from './$types'
import {
  getPostById,
  getBookmarkStatus,
  getUserScoreOnPost,
} from '$lib/server/data'
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params, locals }) => {
  const { id } = params
  const { user } = await locals.auth.validateUser()

  // get post
  const [post, isBookmarked, score] = await Promise.all([
    getPostById(id),
    getBookmarkStatus(id, user?.userId),
    getUserScoreOnPost(id, user?.userId),
  ])

  // throw 404 if post not found
  if (!post) {
    throw error(404, 'Post not found')
  }

  // return post
  return new Response(JSON.stringify({
    post,
    isBookmarked,
    score,
  }), {
    status: 200,
    statusText: 'OK',
  })
}
