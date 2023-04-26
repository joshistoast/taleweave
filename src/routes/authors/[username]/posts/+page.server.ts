import type { } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import db from '$lib/server/db'

export const load: PageServerLoad = async ({ request, params }) => {

  // get posts from author
  const { username } = params

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      author: {
        username: String(username)
      }
    }
  })

  return {
    posts,
  }
}
