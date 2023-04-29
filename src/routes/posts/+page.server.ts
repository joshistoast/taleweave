import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, url }) => {
  const isFeatured = url.searchParams.get('featured') === 'true'

  return {
    props: {
      title: isFeatured ? 'Featured Posts' : 'Browse Everything',
      isFeatured,
      description: isFeatured
        ? 'Hand-picked by our maintainers, these are what we consider must-reads.'
        : 'Browse all of our posts, from the latest to the oldest.',
    },
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
