import type { RequestHandler } from './$types'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('query')

  if (!query)
    return new Response(JSON.stringify([]))

  const tags = await db.tag.findMany({
    where: {
      name: {
        contains: query,
      },
      posts: {
        every: {
          published: true
        }
      }
    },
    select: {
      name: true,
      id: true,
      _count: {
        select: {
          posts: true
        }
      }
    },
    take: 10
  })
    .then((res) => {
      return res
    })
    .catch((err) => {
      throw error(500, { message: err.message })
    })

  return new Response(JSON.stringify(tags))
}
