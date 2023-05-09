import type { PageServerLoad } from './$types'
import type { Actions } from '@sveltejs/kit'
import db from '$lib/server/db'

export const load: PageServerLoad = async () => {
  return 'penis'
}

export const actions: Actions = {
  // takes a string and returns a list of tags that match
  autocomplete: async ({ request }) => {
    const formData = await request.formData()
    const query = formData.get('query') as string

    if (!query) return []

    const matches = await db.tag.findMany({
      where: {
        name: {
          startsWith: query
        }
      }
    })

    if (!matches) return []

    return matches
  }
}
