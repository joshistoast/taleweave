import type { PageServerLoad } from './$types'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ request, params }) => {
  const { username } = params

  const author = await db.authUser.findUnique({
    where: {
      username: String(username)
    },
  })

  if (!author) {
    throw error(404, 'Author not found')
  }

  return {
    author,
  }
}
