import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { useAuthorName } from '$lib/utils'
import { postOfFeedSelect } from '$lib/data'

export const load: PageServerLoad = async ({ params, parent }) => {

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
    },
    select: {
      ...postOfFeedSelect,
    },
  })

  const { author } = await parent()

  return {
    posts,
    page: {
      title: `Posts by ${useAuthorName(author)}`,
      description: author.bio,
    },
  }
}
