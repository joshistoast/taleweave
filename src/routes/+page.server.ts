import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { postOfFeedSelect } from '$lib/data'

export const load: PageServerLoad = async () => {
  const recentlyPublished = await db.post.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
    take: 3,
    select: postOfFeedSelect,
  })

  const recentlyFeatured = await db.post.findMany({
    where: { featured: true },
    orderBy: { updatedAt: 'desc' },
    take: 3,
    select: postOfFeedSelect,
  })

  return {
    recentlyPublished,
    recentlyFeatured,
  }
}
