import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { postOfFeedSelect } from '$lib/data'

export const load: PageServerLoad = async ({ params, parent, locals, url }) => {
  const { user } = await locals.auth.validateUser()
  const { username } = params

  const userIsAuthor = user?.username === username

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      author: {
        username: String(username)
      },
      AND: [
        !userIsAuthor ? { // only show all private and public posts if user is author
          published: true,
        } : {},
      ],
    },
    select: {
      ...postOfFeedSelect,
    },
  })

  const { author } = await parent()

  return {
    posts,
    page: {
      title: `Posts by ${author.displayName}`,
      description: `Browse through all posts by ${author.displayName} on Taleweave`,
    },
  }
}
