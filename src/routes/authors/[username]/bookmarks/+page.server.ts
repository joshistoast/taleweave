import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import {
  redirect,
} from '@sveltejs/kit'
import { postOfFeedSelect } from '$lib/data'

export const load: PageServerLoad = async ({ params, locals }) => {
  const { user } = await locals.auth.validateUser()
  const { username } = params

  if (user?.username !== username) {
    throw redirect(302, `/login?redirectTo=/authors/${username}/bookmarks`)
  }

  return {
    posts: await db.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        bookmarks: {
          some: {
            userId: user?.userId
          }
        }
      },
      select: {
        ...postOfFeedSelect,
      },
    }),
    page: {
      title: 'Bookmarks',
      description: 'Posts you have bookmarked',
    },
  }
}
