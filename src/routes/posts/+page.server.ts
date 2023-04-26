import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, url }) => {
  const isFeatured = url.searchParams.get('featured') === 'true'

  return {
    posts: await db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        published: true,
        featured: isFeatured ? true : undefined,
      },
      include: {
        author: true,
      }
    })
  }
}
