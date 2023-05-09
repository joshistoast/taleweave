import type { PageServerLoad } from './$types'
import type { Actions } from '@sveltejs/kit'
import db from '$lib/server/db'

export const load: PageServerLoad = async () => {
  const tags = await db.tag.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          posts: true,
        },
      }
    },
    take: 50,
  })

  return {
    tags,
  }
}
