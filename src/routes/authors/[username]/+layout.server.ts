import type { LayoutServerLoad } from './$types'
import db from '$lib/server/db'
import {
  error,
} from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ params }) => {

  const { username } = params
  const author = await db.authUser.findUnique({
    where: { username },
  })

  if (!author) {
    throw error(404, 'Author not found')
  }

  return {
    author,
    page: {
      title: author.displayName,
      description: author.bio,
    }
  }
}
