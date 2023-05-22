import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { getAuthor } from '$lib/server/data'

export const load: LayoutServerLoad = async ({ params }) => {
  const { username } = params
  const author = await getAuthor(username)

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
