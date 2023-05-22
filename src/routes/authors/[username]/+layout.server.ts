import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: LayoutServerLoad = async ({ params, fetch }) => {
  const { username } = params
  const author = await (await fetch(`/api/authors/${username}`)).json()

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
