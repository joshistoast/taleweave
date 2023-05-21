import type { RequestHandler, RequestEvent } from './$types'
import db from '$lib/server/db'
import { postOfPageSelect } from '$lib/data'
import { error } from '@sveltejs/kit'
import { validatePost } from '$lib/utils'

export const GET: RequestHandler = async ({ params, locals }) => {
  const { id } = params
  const { user } = await locals.auth.validateUser()

  // get post
  const post = await db.post.findUnique({
    where: { id },
    select: {
      ...postOfPageSelect,
    },
  })

  // throw 404 if post not found
  if (!post) {
    throw error(404, 'Post not found')
  }

  // see if user has bookmarked post
  const isBookmarked = user?.userId ? await db.bookmark.findFirst({
    where: {
      postId: post.id,
      userId: user?.userId,
    },
  }).then((res) => !!res) : false

  // get user's score
  const score = await db.score.findFirst({
    where: {
      postId: post.id,
      userId: user?.userId,
    },
  })

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
