import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ request, params }) => {
  const { id } = params

  const post = await db.post.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      author: true,
    },
  })

  if (!post) {
    throw error(404, 'Post not found')
  }

  return {
    post,
  }
}
